export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
  links?: Array<{ label: string; href: string }>;
  highlights?: string[]; // Component IDs to highlight
  c1Components?: any; // C1 Generative UI components
  source?: 'openai' | 'c1' | 'pattern'; // Response source
}

export interface CodeBlock {
  language: string;
  code: string;
  title?: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  responsibility: string;
  category: string;
  dataFlowIn: string[];
  dataFlowOut: string[];
  dependencies: string[];
  examples: {
    code?: string;
    queries?: string;
    config?: string;
  };
}

export interface FlowDefinition {
  from: string;
  to: string;
  label: string;
  flowType: string;
  description: string;
  dataFormat: string;
}

export interface ArchitectureKnowledge {
  components: ComponentDefinition[];
  flows: FlowDefinition[];
  commonQuestions: FAQ[];
  codeExamples: CodeExample[];
}

export interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
  relatedComponents?: string[];
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  relatedComponent?: string;
  category: 'query' | 'config' | 'example' | 'troubleshooting';
}

export interface ChatContext {
  currentView?: 'arch' | 'onboarding' | 'dashboard';
  currentTab?: string;
  selectedComponent?: string;
  userRole?: string;
}

