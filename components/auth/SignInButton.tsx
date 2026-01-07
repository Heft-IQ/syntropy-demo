'use client';

import { SignInButton as ClerkSignInButton } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';

export function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        <LogIn size={16} />
        Sign In
      </button>
    </ClerkSignInButton>
  );
}

