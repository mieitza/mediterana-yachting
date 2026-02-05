'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  RotateCcw,
  Trash2,
  Clock,
  HardDrive,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface Backup {
  id: string;
  filename: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
}

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/backups');
      if (!response.ok) throw new Error('Failed to fetch backups');
      const data = await response.json();
      setBackups(data);
    } catch (err) {
      setError('Failed to load backups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      setError(null);
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to create backup');
      await fetchBackups();
    } catch (err) {
      setError('Failed to create backup');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setRestoring(id);
      setError(null);
      const response = await fetch(`/api/admin/backups/${id}/restore`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to restore backup');
      setConfirmRestore(null);
      await fetchBackups();
      alert('Database restored successfully. A pre-restore backup was created.');
    } catch (err) {
      setError('Failed to restore backup');
      console.error(err);
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      setError(null);
      const response = await fetch(`/api/admin/backups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete backup');
      setConfirmDelete(null);
      await fetchBackups();
    } catch (err) {
      setError('Failed to delete backup');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <Loader2 className="h-8 w-8 text-slate-400 mx-auto mb-4 animate-spin" />
        <p className="text-sm text-slate-500">Loading backups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create Backup
          </button>
          <button
            onClick={fetchBackups}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        <p className="text-sm text-slate-500">{backups.length} backup(s)</p>
      </div>

      {/* Backups Table */}
      {backups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No backups yet
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Create your first backup to protect your data.
          </p>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create First Backup
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Backup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {backup.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <HardDrive className="h-4 w-4" />
                      {backup.sizeFormatted}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {formatDate(backup.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {confirmRestore === backup.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Confirm?</span>
                          <button
                            onClick={() => handleRestore(backup.id)}
                            disabled={restoring === backup.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded hover:bg-amber-200 disabled:opacity-50"
                          >
                            {restoring === backup.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Yes'
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmRestore(null)}
                            className="px-2 py-1 text-slate-500 text-xs font-medium rounded hover:bg-slate-100"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRestore(backup.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-amber-600 text-sm font-medium rounded-lg hover:bg-amber-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restore
                        </button>
                      )}

                      {confirmDelete === backup.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(backup.id)}
                            disabled={deleting === backup.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 disabled:opacity-50"
                          >
                            {deleting === backup.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Yes'
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 text-slate-500 text-xs font-medium rounded hover:bg-slate-100"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(backup.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
        <h4 className="text-sm font-medium text-slate-900 mb-2">About Backups</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Backups are stored on the production server in /root/backups/</li>
          <li>• Restoring a backup will automatically create a pre-restore backup first</li>
          <li>• Consider creating a backup before making major content changes</li>
        </ul>
      </div>
    </div>
  );
}
