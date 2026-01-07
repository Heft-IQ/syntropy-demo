'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export function UserButton() {
  return (
    <div className="flex items-center">
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'bg-slate-900 border border-slate-800',
            userButtonPopoverActions: 'bg-slate-900',
            userButtonPopoverActionButton: 'text-slate-300 hover:bg-slate-800',
            userButtonPopoverFooter: 'hidden',
          },
        }}
      />
    </div>
  );
}

