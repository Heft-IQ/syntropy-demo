import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, isOpenAIAvailable } from '@/lib/ai-architect/openai-client';
import { callC1, isC1Available, shouldUseC1 } from '@/lib/ai-architect/c1-client';
import { ChatContext } from '@/types/ai-architect';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context, useC1 }: { query: string; context?: ChatContext; useC1?: boolean } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Determine if we should use C1 for visual generation
    const shouldUseC1ForQuery = useC1 !== undefined ? useC1 : shouldUseC1(query);

    // Try C1 first if available and appropriate
    if (shouldUseC1ForQuery && isC1Available()) {
      try {
        const c1Response = await callC1(query, context);
        return NextResponse.json({
          success: true,
          ...c1Response,
          source: 'c1',
        });
      } catch (error: any) {
        console.warn('C1 API failed, falling back to OpenAI:', error);
        // Fall through to OpenAI
      }
    }

    // Fallback to OpenAI
    if (isOpenAIAvailable()) {
      try {
        const openaiResponse = await callOpenAI(query, context);
        return NextResponse.json({
          success: true,
          ...openaiResponse,
          source: 'openai',
        });
      } catch (error: any) {
        console.error('OpenAI API error:', error);
        return NextResponse.json(
          {
            error: error.message || 'Failed to generate response',
            available: false,
          },
          { status: 500 }
        );
      }
    }

    // No APIs available
    return NextResponse.json(
      { error: 'No AI API configured', available: false },
      { status: 503 }
    );
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
    openai: {
      available: isOpenAIAvailable(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    c1: {
      available: isC1Available(),
      baseURL: process.env.THESYS_BASE_URL || 'https://api.thesys.dev/v1/embed',
    },
  });
}

