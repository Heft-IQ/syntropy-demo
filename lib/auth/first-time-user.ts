import { User } from '@clerk/nextjs/server';

/**
 * Check if a user is a first-time user based on their account creation date
 * A user is considered "first-time" if their account was created within the last 5 minutes
 */
export function isFirstTimeUser(user: User | null | undefined): boolean {
  if (!user) return false;
  
  const createdAt = new Date(user.createdAt);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  return createdAt >= fiveMinutesAgo;
}

/**
 * Check if user has seen the onboarding tour (stored in Clerk metadata)
 */
export function hasSeenTour(user: User | null | undefined): boolean {
  if (!user) return false;
  
  return user.publicMetadata?.hasSeenTour === true;
}

/**
 * Mark user as having seen the tour (updates Clerk metadata)
 * Note: This requires a server action or API route to update Clerk user metadata
 */
export async function markTourAsSeen(userId: string): Promise<void> {
  // This will be called from a server action or API route
  // For now, we'll handle it client-side with localStorage as fallback
  if (typeof window !== 'undefined') {
    localStorage.setItem(`tour-seen-${userId}`, 'true');
  }
}

