import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, isOpenAIAvailable } from '@/lib/ai-architect/openai-client';
import { ChatContext } from '@/types/ai-architect';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is available
    if (!isOpenAIAvailable()) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured', available: false },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { query, context }: { query: string; context?: ChatContext } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Call OpenAI
    const response = await callOpenAI(query, context);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate response',
        available: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    available: isOpenAIAvailable(),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  });
}

