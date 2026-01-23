import NextAuth from 'next-auth';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

// JWT type augmentation - Next-auth v5 beta uses different module structure
// The jwt callback in config.ts handles these fields, TypeScript will infer them
