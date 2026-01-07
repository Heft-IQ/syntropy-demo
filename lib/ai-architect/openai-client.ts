import OpenAI from 'openai';
import { ChatContext } from '@/types/ai-architect';
import { buildSystemPrompt, buildUserPrompt, getModel } from './prompts';

let openaiClient: OpenAI | null = null;

export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

function getClient(): OpenAI | null {
  if (!isOpenAIAvailable()) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

export interface OpenAIResponse {
  content: string;
  codeBlocks?: Array<{ language: string; code: string; title?: string }>;
  highlights?: string[];
}

export async function callOpenAI(
  query: string,
  context?: ChatContext
): Promise<OpenAIResponse> {
  const client = getClient();
  if (!client) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(query, context);
  const model = getModel();

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Parse response to extract code blocks and highlights
    const parsed = parseAIResponse(content);

    return {
      content: parsed.content,
      codeBlocks: parsed.codeBlocks,
      highlights: parsed.highlights,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

function parseAIResponse(response: string): {
  content: string;
  codeBlocks: Array<{ language: string; code: string; title?: string }>;
  highlights: string[];
} {
  const codeBlocks: Array<{ language: string; code: string; title?: string }> = [];
  const highlights: string[] = [];
  let content = response;

  // Extract code blocks (```language\ncode\n```)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    codeBlocks.push({ language, code });
    // Remove from content
    content = content.replace(match[0], '');
  }

  // Extract component highlights (component IDs in parentheses)
  const componentIds = ['erp', 'worker', 's3', 'tinybird', 'cube', 'falkordb', 'clerk', 'user'];
  componentIds.forEach((id) => {
    const regex = new RegExp(`\\(${id}\\)`, 'gi');
    if (regex.test(response)) {
      highlights.push(id);
    }
  });

  // Clean up content (remove extra whitespace)
  content = content.trim().replace(/\n{3,}/g, '\n\n');

  return { content, codeBlocks, highlights };
}

