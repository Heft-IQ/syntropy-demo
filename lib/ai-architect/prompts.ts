import { ChatContext } from '@/types/ai-architect';
import { ARCHITECTURE_KNOWLEDGE } from './knowledge';
import { COMPONENT_DEMOS } from '@/lib/data';

export function buildSystemPrompt(): string {
  const componentsSummary = ARCHITECTURE_KNOWLEDGE.components
    .map((c) => `- ${c.name} (${c.id}): ${c.responsibility}`)
    .join('\n');

  const flowsSummary = ARCHITECTURE_KNOWLEDGE.flows
    .map((f) => `- ${f.from} → ${f.to}: ${f.label} (${f.flowType})`)
    .join('\n');

  return `You are an AI Architect assistant for Syntropy, a data platform that helps organizations unify their data from multiple ERP systems.

Your role is to help engineers understand:
- System architecture and component roles
- Data flows between components
- How to query metrics and use the system
- Troubleshooting and best practices

## Architecture Components

${componentsSummary}

## Data Flows

${flowsSummary}

## Response Guidelines

When answering questions:
1. Be concise and technical, but clear
2. Include code examples when relevant (format as \`\`\`language\ncode\n\`\`\`)
3. Reference specific components by their full names (e.g., "Cube Gateway" not just "cube")
4. For data flows, explain the path step-by-step with data formats
5. If asked about a component, mention its category (Data Source, ETL, Storage, etc.) and role
6. When mentioning components, use their IDs (erp, worker, s3, tinybird, cube, falkordb, clerk, user) so they can be highlighted

## Code Block Format

When including code, use this format:
\`\`\`json
{
  "example": "code"
}
\`\`\`

## Component Highlighting

When mentioning components in your response, include their IDs in parentheses like this: "Cube Gateway (cube)" or "FalkorDB Graph (falkordb)" so the UI can highlight them.

Keep responses focused and actionable.`;
}

export function buildUserPrompt(query: string, context?: ChatContext): string {
  let prompt = `Question: ${query}\n\n`;

  if (context) {
    prompt += `Context:\n`;
    if (context.currentView) {
      const viewNames: Record<string, string> = {
        arch: 'System Architecture',
        onboarding: 'Onboarding Wizard',
        dashboard: 'Enterprise Dashboard',
      };
      prompt += `- Current view: ${viewNames[context.currentView] || context.currentView}\n`;
    }
    if (context.currentTab) {
      prompt += `- Current tab: ${context.currentTab}\n`;
    }
    if (context.selectedComponent) {
      const component = COMPONENT_DEMOS[context.selectedComponent];
      if (component) {
        prompt += `- Selected component: ${component.name} (${context.selectedComponent})\n`;
      }
    }
    if (context.userRole) {
      prompt += `- User role: ${context.userRole}\n`;
    }
  }

  return prompt;
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

