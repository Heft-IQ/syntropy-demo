import OpenAI from 'openai';
import { ChatContext } from '@/types/ai-architect';
import { buildSystemPrompt, buildUserPrompt, getModel } from './prompts';

let c1Client: OpenAI | null = null;

export function isC1Available(): boolean {
  return !!process.env.THESYS_API_KEY;
}

function getClient(): OpenAI | null {
  if (!isC1Available()) {
    return null;
  }

  if (!c1Client) {
    c1Client = new OpenAI({
      apiKey: process.env.THESYS_API_KEY,
      baseURL: process.env.THESYS_BASE_URL || 'https://api.thesys.dev/v1/embed',
    });
  }

  return c1Client;
}

export interface C1Response {
  content: string;
  components?: any; // C1 component data
  codeBlocks?: Array<{ language: string; code: string; title?: string }>;
  highlights?: string[];
}

export async function callC1(
  query: string,
  context?: ChatContext
): Promise<C1Response> {
  const client = getClient();
  if (!client) {
    throw new Error('Thesys C1 API key not configured');
  }

  const systemPrompt = buildSystemPrompt() + '\n\nWhen appropriate, generate interactive UI components using C1:\n- Architecture diagrams for component relationships\n- Flow charts for data flows\n- Comparison tables for component differences\n- Query builders for metric queries\n- Detail cards for component information';
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
      max_tokens: 2000, // More tokens for UI generation
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // C1 returns structured data in the response
    // Parse to extract components and text
    const parsed = parseC1Response(content);

    return {
      content: parsed.content,
      components: parsed.components,
      codeBlocks: parsed.codeBlocks,
      highlights: parsed.highlights,
    };
  } catch (error) {
    console.error('C1 API error:', error);
    throw error;
  }
}

function parseC1Response(response: string): {
  content: string;
  components?: any;
  codeBlocks: Array<{ language: string; code: string; title?: string }>;
  highlights: string[];
} {
  const codeBlocks: Array<{ language: string; code: string; title?: string }> = [];
  const highlights: string[] = [];
  let content = response;
  let components: any = undefined;

  // Try to parse C1 component data (if present in response)
  try {
    // C1 might return JSON structure for components
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[1]);
      if (jsonData.components || jsonData.type === 'c1') {
        components = jsonData;
        content = content.replace(jsonMatch[0], '');
      }
    }
  } catch {
    // Not JSON, continue with text parsing
  }

  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    // Skip if it's C1 component JSON
    if (language === 'json' && code.includes('"type":"c1"')) {
      continue;
    }
    codeBlocks.push({ language, code });
    content = content.replace(match[0], '');
  }

  // Extract component highlights
  const componentIds = ['erp', 'worker', 's3', 'tinybird', 'cube', 'falkordb', 'clerk', 'user'];
  componentIds.forEach((id) => {
    const regex = new RegExp(`\\(${id}\\)`, 'gi');
    if (regex.test(response)) {
      highlights.push(id);
    }
  });

  content = content.trim().replace(/\n{3,}/g, '\n\n');

  return { content, components, codeBlocks, highlights };
}

// Detect if query should use C1 for visual generation
export function shouldUseC1(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const visualTriggers = [
    'show me',
    'visualize',
    'diagram',
    'chart',
    'graph',
    'compare',
    'difference',
    'table',
    'flow',
    'architecture',
    'build a query',
    'query builder',
  ];

  return visualTriggers.some((trigger) => lowerQuery.includes(trigger));
}

