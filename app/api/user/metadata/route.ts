import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to update user metadata in Clerk
 * This allows us to persist tour completion status across devices
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hasSeenTour } = body;

    // Update user metadata in Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        hasSeenTour: hasSeenTour === true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user metadata' },
      { status: 500 }
    );
  }
}

