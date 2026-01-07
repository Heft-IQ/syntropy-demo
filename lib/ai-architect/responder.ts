import { AIMessage, ChatContext, CodeBlock } from '@/types/ai-architect';
import { ARCHITECTURE_KNOWLEDGE } from './knowledge';
import { COMPONENT_DEMOS } from '@/lib/data';
import { shouldUseC1 } from './c1-client';

// Main response generator - tries C1/OpenAI first, falls back to pattern matching
export async function generateResponse(query: string, context?: ChatContext): Promise<AIMessage> {
  // Check if any AI API is available (client-side check)
  const apiStatus = typeof window !== 'undefined' 
    ? await checkAPIAvailability()
    : { openai: false, c1: false };

  // Determine if we should use C1 for visual generation
  const useC1 = shouldUseC1(query);

  if (apiStatus.openai || apiStatus.c1) {
    try {
      // Call API route which handles C1/OpenAI routing
      const response = await fetch('/api/ai-architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context, useC1 }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.content,
            timestamp: new Date(),
            codeBlocks: data.codeBlocks,
            highlights: data.highlights,
            c1Components: data.components,
            source: data.source || 'openai',
          };
        }
      }
    } catch (error) {
      console.warn('AI API failed, using fallback:', error);
    }
  }

  // Fallback to pattern matching
  const patternResponse = generatePatternMatchResponse(query, context);
  return {
    ...patternResponse,
    source: 'pattern',
  };
}

// Check if AI APIs are available via API route
async function checkAPIAvailability(): Promise<{ openai: boolean; c1: boolean }> {
  try {
    const response = await fetch('/api/ai-architect');
    const data = await response.json();
    return {
      openai: data.openai?.available === true,
      c1: data.c1?.available === true,
    };
  } catch {
    return { openai: false, c1: false };
  }
}

// Pattern matching fallback (original implementation)
function generatePatternMatchResponse(query: string, context?: ChatContext): AIMessage {
  const lowerQuery = query.toLowerCase();
  const codeBlocks: CodeBlock[] = [];
  const highlights: string[] = [];
  let response = '';
  let links: Array<{ label: string; href: string }> = [];

  // Add context-aware greeting if on architecture view
  if (context?.currentView === 'arch' && (lowerQuery.includes('help') || lowerQuery.length < 5)) {
    response = `I see you're viewing the System Architecture! I can help explain:\n\n`;
    response += `- Component roles and how they connect\n`;
    response += `- Data flows between components\n`;
    response += `- Click any component to see detailed demos\n\n`;
    response += `Try asking: "How does data flow from ERP to Tinybird?" or "What is FalkorDB?"`;
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
  }

  // Check for common questions first
  const matchedFAQ = ARCHITECTURE_KNOWLEDGE.commonQuestions.find((faq) =>
    faq.keywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase()))
  );

  if (matchedFAQ) {
    response = matchedFAQ.answer;
    if (matchedFAQ.relatedComponents) {
      highlights.push(...matchedFAQ.relatedComponents);
    }
  } else {
    // Pattern matching for different question types
    if (lowerQuery.includes('data flow') || lowerQuery.includes('how does data')) {
      response = generateDataFlowResponse(lowerQuery, highlights);
    } else if (lowerQuery.includes('what is') || lowerQuery.includes('what does')) {
      response = generateComponentExplanation(lowerQuery, highlights, codeBlocks);
    } else if (lowerQuery.includes('how do i') || lowerQuery.includes('how to')) {
      response = generateHowToResponse(lowerQuery, codeBlocks, highlights);
    } else if (lowerQuery.includes('difference') || lowerQuery.includes('compare')) {
      response = generateComparisonResponse(lowerQuery, highlights);
    } else if (lowerQuery.includes('query') || lowerQuery.includes('sql')) {
      response = generateQueryExample(lowerQuery, codeBlocks, highlights);
    } else {
      response = generateDefaultResponse(lowerQuery, highlights);
    }
  }

  // Add code examples if relevant
  if (codeBlocks.length === 0 && (lowerQuery.includes('example') || lowerQuery.includes('code'))) {
    const relevantExample = ARCHITECTURE_KNOWLEDGE.codeExamples.find((ex) =>
      lowerQuery.includes(ex.relatedComponent || '')
    );
    if (relevantExample) {
      codeBlocks.push({
        language: relevantExample.language,
        code: relevantExample.code,
        title: relevantExample.title,
      });
    }
  }

  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: response,
    timestamp: new Date(),
    codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
    links: links.length > 0 ? links : undefined,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

function generateDataFlowResponse(query: string, highlights: string[]): string {
  if (query.includes('erp') && query.includes('tinybird')) {
    highlights.push('erp', 'worker', 's3', 'tinybird');
    return `Data flows from ERP to Tinybird through the ingestion pipeline:

1. **ERP (NetSuite)** → Sends raw JSON data via REST API
2. **dlt Worker** → Normalizes and transforms JSON to Parquet format
3. **S3 Bronze** → Stores immutable Parquet files organized by vendor
4. **Tinybird** → Auto-ingests from S3 and provides queryable analytics

The data format changes at each step: Raw JSON → Normalized Parquet → Queryable Analytics.`;
  }

  if (query.includes('user') || query.includes('query') || query.includes('metric')) {
    highlights.push('user', 'cube', 'clerk', 'falkordb', 'tinybird');
    return `When a user queries a metric, the flow is:

1. **User/Dashboard** → Sends metric query request
2. **Clerk Auth** → Validates JWT token and permissions
3. **Cube Gateway** → Resolves metric definition from FalkorDB
4. **FalkorDB** → Returns canonical field mappings
5. **Cube Gateway** → Translates to SQL and queries Tinybird
6. **Tinybird** → Executes query and returns results
7. **User/Dashboard** → Displays the results

This is the serving/query pipeline.`;
  }

  return `I can explain data flows in the system. The main flows are:

- **Ingestion**: ERP → dlt Worker → S3 Bronze → Tinybird
- **Query**: User → Cube Gateway → FalkorDB/Tinybird → Results
- **Auth**: User → Clerk → JWT → Cube Gateway

Which specific flow would you like to know more about?`;
}

function generateComponentExplanation(
  query: string,
  highlights: string[],
  codeBlocks: CodeBlock[]
): string {
  const components = ARCHITECTURE_KNOWLEDGE.components;
  
  for (const component of components) {
    if (query.includes(component.id) || query.includes(component.name.toLowerCase())) {
      highlights.push(component.id);
      const demo = COMPONENT_DEMOS[component.id];
      
      let explanation = `**${component.name}** (${component.category})\n\n`;
      explanation += `${component.responsibility}\n\n`;
      explanation += `**Description**: ${component.description}\n\n`;
      
      if (component.dataFlowIn.length > 0) {
        explanation += `**Data Flow In**: ${component.dataFlowIn.join(', ')}\n\n`;
      }
      if (component.dataFlowOut.length > 0) {
        explanation += `**Data Flow Out**: ${component.dataFlowOut.join(', ')}\n\n`;
      }
      
      if (demo?.examples.data?.content) {
        codeBlocks.push({
          language: demo.examples.data.language || 'text',
          code: demo.examples.data.content,
          title: demo.examples.data.title,
        });
      }
      
      return explanation;
    }
  }
  
  return `I can explain any component in the architecture. The main components are:

- **Data Sources**: ERP (NetSuite)
- **ETL**: dlt Worker
- **Storage**: S3 Bronze
- **Compute**: Tinybird
- **API Gateway**: Cube Gateway
- **Control Plane**: FalkorDB Graph
- **Auth**: Clerk Auth
- **Frontend**: User/Dashboard

Which component would you like to learn about?`;
}

function generateHowToResponse(
  query: string,
  codeBlocks: CodeBlock[],
  highlights: string[]
): string {
  if (query.includes('query') || query.includes('metric')) {
    highlights.push('cube', 'tinybird', 'falkordb');
    const example = ARCHITECTURE_KNOWLEDGE.codeExamples.find((ex) => ex.id === 'query-net-revenue');
    if (example) {
      codeBlocks.push({
        language: example.language,
        code: example.code,
        title: example.title,
      });
    }
    return `To query a metric:

1. Send a metric query request to Cube Gateway with the metric name and filters
2. Cube Gateway validates your JWT token with Clerk
3. Cube Gateway resolves the metric schema from FalkorDB
4. Cube Gateway translates the metric to SQL and queries Tinybird
5. Results are returned to your application

Here's an example query:`;
  }

  return `I can help you with various tasks. Common questions include:

- How to query metrics
- How to add a new data source
- How to configure components
- How to troubleshoot issues

What specifically would you like to know how to do?`;
}

function generateComparisonResponse(query: string, highlights: string[]): string {
  if (query.includes('s3') && query.includes('tinybird')) {
    highlights.push('s3', 'tinybird');
    return `**S3 Bronze vs Tinybird**:

**S3 Bronze**:
- Immutable storage layer (data lake)
- Stores raw ingested data in Parquet format
- Organized by vendor connectors
- Long-term storage, not optimized for queries

**Tinybird**:
- Compute/analytics layer (Silver/Gold)
- High-performance columnar database
- Optimized for analytical queries
- Real-time query execution

Think of S3 as the warehouse and Tinybird as the fast query engine.`;
  }

  return `I can compare components for you. Common comparisons:

- S3 Bronze vs Tinybird (storage vs compute)
- ERP vs dlt Worker (source vs transformation)
- Cube Gateway vs FalkorDB (API vs control plane)

What would you like to compare?`;
}

function generateQueryExample(
  query: string,
  codeBlocks: CodeBlock[],
  highlights: string[]
): string {
  highlights.push('cube', 'tinybird');
  const example = ARCHITECTURE_KNOWLEDGE.codeExamples.find((ex) => ex.category === 'query');
  if (example) {
    codeBlocks.push({
      language: example.language,
      code: example.code,
      title: example.title,
    });
  }
  return `Here's an example query. Cube Gateway accepts metric queries in JSON format and translates them to SQL for Tinybird:`;
}

function generateDefaultResponse(query: string, highlights: string[]): string {
  return `I'm here to help you understand the system architecture! I can answer questions about:

- Component roles and responsibilities
- Data flows between components
- How to query metrics
- Configuration and setup
- Troubleshooting

Try asking: "How does data flow from ERP to Tinybird?" or "What is FalkorDB used for?"`;
}

