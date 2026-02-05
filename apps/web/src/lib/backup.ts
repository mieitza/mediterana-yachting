import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// When running in Docker, use local file operations
// The backup directory and database are mounted as volumes
const BACKUP_MODE = process.env.BACKUP_MODE || 'local'; // 'local' or 'ssh'
const BACKUP_DIR = process.env.BACKUP_DIR || '/app/backups';
const DB_PATH = process.env.DATABASE_PATH || '/app/data/mediterana.db';

// SSH settings (only used when BACKUP_MODE=ssh)
const SSH_HOST = process.env.BACKUP_SSH_HOST || '76.13.15.171';
const SSH_USER = process.env.BACKUP_SSH_USER || 'root';
const SSH_KEY_PATH = process.env.BACKUP_SSH_KEY_PATH || '/Users/mihai/.ssh/hostinger';
const SSH_DB_PATH = '/var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db';
const SSH_BACKUP_DIR = '/root/backups';

interface Backup {
  id: string;
  filename: string;
  size: number;
  sizeFormatted: string;
  createdAt: Date;
}

function sshCommand(command: string): string {
  return `ssh -o StrictHostKeyChecking=no -i "${SSH_KEY_PATH}" ${SSH_USER}@${SSH_HOST} "${command}"`;
}

function validateFilename(filename: string): boolean {
  // Only allow mediterana_*.db pattern to prevent path traversal
  return /^mediterana_\d{8}_\d{6}(_[a-zA-Z0-9-]+)?\.db$/.test(filename);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function parseDateTime(filename: string): Date {
  // Extract date from filename like mediterana_20260204_111229.db
  const match = filename.match(/mediterana_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  }
  return new Date();
}

function generateTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

// ============ LOCAL MODE FUNCTIONS ============

async function listBackupsLocal(): Promise<Backup[]> {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const files = await fs.readdir(BACKUP_DIR);
    const backups: Backup[] = [];

    for (const file of files) {
      if (file.endsWith('.db') && validateFilename(file)) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        backups.push({
          id: file.replace('.db', ''),
          filename: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          createdAt: parseDateTime(file),
        });
      }
    }

    return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error listing backups (local):', error);
    throw new Error('Failed to list backups');
  }
}

async function createBackupLocal(description?: string): Promise<Backup> {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Build filename
    let filename = `mediterana_${generateTimestamp()}`;
    if (description) {
      const sanitized = description.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 30);
      if (sanitized) {
        filename += `_${sanitized}`;
      }
    }
    filename += '.db';

    const destPath = path.join(BACKUP_DIR, filename);

    // Copy database file
    await fs.copyFile(DB_PATH, destPath);

    // Get file info
    const stats = await fs.stat(destPath);

    return {
      id: filename.replace('.db', ''),
      filename,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating backup (local):', error);
    throw new Error('Failed to create backup');
  }
}

async function restoreBackupLocal(filename: string): Promise<void> {
  if (!validateFilename(filename)) {
    throw new Error('Invalid backup filename');
  }

  try {
    // First create a pre-restore backup
    await createBackupLocal('pre-restore');

    // Restore the backup
    const srcPath = path.join(BACKUP_DIR, filename);
    await fs.copyFile(srcPath, DB_PATH);
  } catch (error) {
    console.error('Error restoring backup (local):', error);
    throw new Error('Failed to restore backup');
  }
}

async function deleteBackupLocal(filename: string): Promise<void> {
  if (!validateFilename(filename)) {
    throw new Error('Invalid backup filename');
  }

  try {
    const filePath = path.join(BACKUP_DIR, filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting backup (local):', error);
    throw new Error('Failed to delete backup');
  }
}

async function getBackupInfoLocal(filename: string): Promise<Backup | null> {
  if (!validateFilename(filename)) {
    return null;
  }

  try {
    const filePath = path.join(BACKUP_DIR, filename);
    const stats = await fs.stat(filePath);

    return {
      id: filename.replace('.db', ''),
      filename,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      createdAt: parseDateTime(filename),
    };
  } catch {
    return null;
  }
}

// ============ SSH MODE FUNCTIONS ============

async function listBackupsSSH(): Promise<Backup[]> {
  try {
    const command = sshCommand(`ls -la ${SSH_BACKUP_DIR}/*.db 2>/dev/null || echo ""`);
    const { stdout } = await execAsync(command);

    if (!stdout.trim()) {
      return [];
    }

    const lines = stdout.trim().split('\n').filter(line => line.includes('.db'));
    const backups: Backup[] = [];

    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 9) {
        const size = parseInt(parts[4]);
        const filename = parts[parts.length - 1].split('/').pop() || '';

        if (validateFilename(filename)) {
          backups.push({
            id: filename.replace('.db', ''),
            filename,
            size,
            sizeFormatted: formatBytes(size),
            createdAt: parseDateTime(filename),
          });
        }
      }
    }

    return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error listing backups (SSH):', error);
    throw new Error('Failed to list backups');
  }
}

async function createBackupSSH(description?: string): Promise<Backup> {
  try {
    await execAsync(sshCommand(`mkdir -p ${SSH_BACKUP_DIR}`));

    let filename = `mediterana_${generateTimestamp()}`;
    if (description) {
      const sanitized = description.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 30);
      if (sanitized) {
        filename += `_${sanitized}`;
      }
    }
    filename += '.db';

    const command = sshCommand(`cp "${SSH_DB_PATH}" "${SSH_BACKUP_DIR}/${filename}"`);
    await execAsync(command);

    const infoCommand = sshCommand(`ls -la "${SSH_BACKUP_DIR}/${filename}"`);
    const { stdout } = await execAsync(infoCommand);

    const parts = stdout.trim().split(/\s+/);
    const size = parseInt(parts[4]) || 0;

    return {
      id: filename.replace('.db', ''),
      filename,
      size,
      sizeFormatted: formatBytes(size),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating backup (SSH):', error);
    throw new Error('Failed to create backup');
  }
}

async function restoreBackupSSH(filename: string): Promise<void> {
  if (!validateFilename(filename)) {
    throw new Error('Invalid backup filename');
  }

  try {
    await createBackupSSH('pre-restore');
    const command = sshCommand(`cp "${SSH_BACKUP_DIR}/${filename}" "${SSH_DB_PATH}"`);
    await execAsync(command);
  } catch (error) {
    console.error('Error restoring backup (SSH):', error);
    throw new Error('Failed to restore backup');
  }
}

async function deleteBackupSSH(filename: string): Promise<void> {
  if (!validateFilename(filename)) {
    throw new Error('Invalid backup filename');
  }

  try {
    const command = sshCommand(`rm "${SSH_BACKUP_DIR}/${filename}"`);
    await execAsync(command);
  } catch (error) {
    console.error('Error deleting backup (SSH):', error);
    throw new Error('Failed to delete backup');
  }
}

async function getBackupInfoSSH(filename: string): Promise<Backup | null> {
  if (!validateFilename(filename)) {
    return null;
  }

  try {
    const command = sshCommand(`ls -la "${SSH_BACKUP_DIR}/${filename}" 2>/dev/null || echo ""`);
    const { stdout } = await execAsync(command);

    if (!stdout.trim() || stdout.includes('No such file')) {
      return null;
    }

    const parts = stdout.trim().split(/\s+/);
    const size = parseInt(parts[4]) || 0;

    return {
      id: filename.replace('.db', ''),
      filename,
      size,
      sizeFormatted: formatBytes(size),
      createdAt: parseDateTime(filename),
    };
  } catch {
    return null;
  }
}

// ============ EXPORTED FUNCTIONS ============

export async function listBackups(): Promise<Backup[]> {
  return BACKUP_MODE === 'ssh' ? listBackupsSSH() : listBackupsLocal();
}

export async function createBackup(description?: string): Promise<Backup> {
  return BACKUP_MODE === 'ssh' ? createBackupSSH(description) : createBackupLocal(description);
}

export async function restoreBackup(filename: string): Promise<void> {
  return BACKUP_MODE === 'ssh' ? restoreBackupSSH(filename) : restoreBackupLocal(filename);
}

export async function deleteBackup(filename: string): Promise<void> {
  return BACKUP_MODE === 'ssh' ? deleteBackupSSH(filename) : deleteBackupLocal(filename);
}

export async function getBackupInfo(filename: string): Promise<Backup | null> {
  return BACKUP_MODE === 'ssh' ? getBackupInfoSSH(filename) : getBackupInfoLocal(filename);
}
