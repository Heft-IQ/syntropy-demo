'use client';

import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

/**
 * Custom hook to check if the current user is a first-time user
 * Returns:
 * - isFirstTime: true if account was created in last 5 minutes
 * - hasSeenTour: true if user has seen the onboarding tour
 * - shouldShowTour: true if tour should be shown (first-time OR hasn't seen tour)
 */
export function useFirstTimeUser() {
  const { user, isLoaded } = useUser();

  const { isFirstTime, hasSeenTour, shouldShowTour } = useMemo(() => {
    if (!isLoaded || !user) {
      return {
        isFirstTime: false,
        hasSeenTour: false,
        shouldShowTour: false,
      };
    }

    // Check if user has seen tour in Clerk metadata
    const hasSeenTourInMetadata = user.publicMetadata?.hasSeenTour === true;
    
    // Check if user is a first-time user (account created in last 5 minutes)
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    if (!createdAt) {
      return {
        isFirstTime: false,
        hasSeenTour: hasSeenTourInMetadata,
        shouldShowTour: !hasSeenTourInMetadata,
      };
    }
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const isFirstTimeUser = createdAt >= fiveMinutesAgo;

    return {
      isFirstTime: isFirstTimeUser,
      hasSeenTour: hasSeenTourInMetadata,
      shouldShowTour: isFirstTimeUser || !hasSeenTourInMetadata,
    };
  }, [user, isLoaded]);

  return {
    isFirstTime,
    hasSeenTour,
    shouldShowTour,
    user,
    isLoaded,
  };
}

