export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: {
    overview?: string;
    steps?: Array<{
      title: string;
      description: string;
      tip?: string;
    }>;
    features?: Array<{
      name: string;
      description: string;
    }>;
    examples?: Array<{
      title: string;
      content: string;
    }>;
  };
}

export const USER_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    content: {
      overview: 'Welcome to Syntropy Demo! This guide will help you discover and use all the powerful features of the platform.',
      steps: [
        {
          title: 'Navigate Between Views',
          description: 'Use the navigation buttons in the header to switch between Architecture, Onboarding, and Enterprise Dashboard views.',
          tip: 'Each view provides different insights into the system.',
        },
        {
          title: 'Explore Interactive Features',
          description: 'Many elements in the app are interactive. Look for clickable components, hover tooltips, and expandable sections.',
          tip: 'When in doubt, try clicking! Most interactive elements provide visual feedback.',
        },
        {
          title: 'Use the AI Assistant',
          description: 'Click the floating chat button (bottom-right) to open the AI Architect assistant for help with architecture questions.',
          tip: 'The AI can explain components, data flows, and answer technical questions.',
        },
      ],
    },
  },
  {
    id: 'architecture-view',
    title: 'Architecture View',
    icon: '🏗️',
    content: {
      overview: 'The Architecture view shows the complete system architecture with interactive components you can explore.',
      features: [
        {
          name: 'Clickable Components',
          description: 'Every component in the architecture diagram is clickable! Click any component to see detailed information about its role, responsibilities, data flows, and examples.',
        },
        {
          name: 'Component Categories',
          description: 'Each component has a category badge (Data Source, ETL, Storage, Compute, etc.) that helps you understand its role in the system.',
        },
        {
          name: 'Flow Simulation',
          description: 'Use the simulation buttons (Simulate Ingestion, Simulate Query, Simulate Auth) to see how data flows through the system in real-time.',
        },
        {
          name: 'Component Details',
          description: 'When you click a component, a detailed panel opens showing: architecture context, dependencies, data examples, process steps, and metrics.',
        },
      ],
      steps: [
        {
          title: 'Explore a Component',
          description: 'Click on any component (like "Cube Gateway" or "FalkorDB Graph") to see its detailed demo panel.',
        },
        {
          title: 'Run a Flow Simulation',
          description: 'Click "Simulate Ingestion" to see how data flows from ERP → dlt Worker → S3 → Tinybird.',
        },
        {
          title: 'Understand Categories',
          description: 'Notice the colored badges under each component name - these indicate the component category and role.',
        },
      ],
    },
  },
  {
    id: 'ai-architect-chat',
    title: 'AI Architect Chat',
    icon: '🤖',
    content: {
      overview: 'The AI Architect is your intelligent assistant for understanding the system architecture, data flows, and components.',
      features: [
        {
          name: 'Open the Chat',
          description: 'Click the floating chat button in the bottom-right corner to open the AI Architect panel.',
        },
        {
          name: 'Expand the Window',
          description: 'Click the maximize icon in the chat header to expand to full screen for better readability of detailed responses.',
        },
        {
          name: 'Ask Questions',
          description: 'Ask questions about architecture, data flows, components, or how to use the system. Examples: "How does data flow from ERP to Tinybird?" or "What is FalkorDB used for?"',
        },
        {
          name: 'Interactive Components',
          description: 'The AI can generate interactive diagrams, charts, and tables using Thesys C1 Generative UI for visual explanations.',
        },
        {
          name: 'Component Highlighting',
          description: 'When the AI mentions components, they are automatically highlighted in the Architecture view for better understanding.',
        },
      ],
      examples: [
        {
          title: 'Example Questions',
          content: `• "Show me the architecture diagram"
• "How does data flow from ERP to Tinybird?"
• "Compare S3 Bronze and Tinybird"
• "What is FalkorDB used for?"
• "Help me understand the ingestion pipeline"`,
        },
      ],
    },
  },
  {
    id: 'enterprise-dashboard',
    title: 'Enterprise Dashboard',
    icon: '📊',
    content: {
      overview: 'The Enterprise Dashboard provides comprehensive views of your metrics, data lineage, and audit logs.',
      features: [
        {
          name: 'Quick Wins',
          description: 'View actionable insights and quick wins for improving your data platform.',
        },
        {
          name: 'Semantic Layer',
          description: 'Manage metric definitions, view pending approvals, and track metric status. Click "Review" on pending metrics to see impact analysis.',
        },
        {
          name: 'Data Lineage',
          description: 'Visualize how data flows from source fields through canonical fields to metrics. Click the lineage icon on any metric to view its lineage.',
        },
        {
          name: 'Audit Log',
          description: 'Comprehensive audit trail with advanced filtering, search, and detailed views. See the Audit Log section for more details.',
        },
      ],
      steps: [
        {
          title: 'Navigate Tabs',
          description: 'Use the sidebar to switch between Quick Wins, Semantic Layer, Data Lineage, and Audit Log.',
        },
        {
          title: 'Review Metrics',
          description: 'Click "Review" on any pending metric to see impact analysis and approve or reject it.',
        },
        {
          title: 'View Lineage',
          description: 'Click the network icon on any metric to view its complete data lineage.',
        },
      ],
    },
  },
  {
    id: 'audit-log-features',
    title: 'Audit Log Features',
    icon: '📋',
    content: {
      overview: 'The Audit Log provides enterprise-grade tracking of all system actions with advanced filtering and analysis capabilities.',
      features: [
        {
          name: 'Advanced Filtering',
          description: 'Use the filter panel to search by action type, actor, severity, status, date range, or full-text search across all fields.',
        },
        {
          name: 'Table & Timeline Views',
          description: 'Switch between Table view (sortable columns) and Timeline view (chronological visualization) using the toggle buttons.',
        },
        {
          name: 'Detailed View',
          description: 'Click "Details" on any log entry to see complete information including metadata, before/after changes, network info, and compliance hash.',
        },
        {
          name: 'Sorting',
          description: 'Click column headers in Table view to sort by time, actor, action, severity, or status.',
        },
        {
          name: 'Export',
          description: 'Export filtered results to CSV or JSON format for external analysis or compliance reporting.',
        },
      ],
      steps: [
        {
          title: 'Filter Logs',
          description: 'Use the filter panel to narrow down logs. Try filtering by severity "error" or status "failed" to find issues.',
        },
        {
          title: 'View Details',
          description: 'Click "Details" on any log entry to see the complete audit trail including IP addresses, session IDs, and change tracking.',
        },
        {
          title: 'Switch Views',
          description: 'Toggle between Table and Timeline views to see logs in different formats. Timeline is great for understanding chronological patterns.',
        },
      ],
    },
  },
  {
    id: 'data-lineage',
    title: 'Data Lineage',
    icon: '🔗',
    content: {
      overview: 'Data Lineage shows the complete path from source fields through canonical fields to metrics.',
      features: [
        {
          name: 'Interactive Graph',
          description: 'The lineage graph is interactive - you can see how data flows and transforms at each step.',
        },
        {
          name: 'Multiple Views',
          description: 'View lineage by Source Fields, Canonical Fields, Metrics, or Usage to understand different aspects of data flow.',
        },
        {
          name: 'Field Mapping',
          description: 'See how physical ERP fields map to canonical business terms, enabling semantic understanding across systems.',
        },
      ],
      steps: [
        {
          title: 'Navigate to Lineage',
          description: 'Go to Enterprise Dashboard → Data Lineage tab, or click the network icon on any metric.',
        },
        {
          title: 'Explore Views',
          description: 'Switch between different lineage views to see source fields, canonical mappings, metrics, and usage patterns.',
        },
        {
          title: 'Understand Flow',
          description: 'Follow the connections in the graph to understand how data transforms from raw sources to business metrics.',
        },
      ],
    },
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: '⌨️',
    content: {
      overview: 'Use keyboard shortcuts for faster navigation and common actions.',
      features: [
        {
          name: 'Navigation',
          description: 'Use Tab to navigate between interactive elements, Enter to activate buttons.',
        },
        {
          name: 'Search',
          description: 'Press Ctrl/Cmd + K to focus search fields when available.',
        },
        {
          name: 'Close Modals',
          description: 'Press Escape to close modals, detail views, and panels.',
        },
      ],
      examples: [
        {
          title: 'Common Shortcuts',
          content: `• Escape - Close modals/panels
• Tab - Navigate between elements
• Enter - Activate buttons/links
• Ctrl/Cmd + K - Focus search (where available)`,
        },
      ],
    },
  },
  {
    id: 'tips-tricks',
    title: 'Tips & Tricks',
    icon: '💡',
    content: {
      overview: 'Pro tips to get the most out of Syntropy Demo.',
      features: [
        {
          name: 'Component Highlighting',
          description: 'When the AI mentions components, they are automatically highlighted in the Architecture view. This helps you see connections visually.',
        },
        {
          name: 'Expand Chat for Long Responses',
          description: 'If the AI provides a detailed response with code blocks or diagrams, expand the chat window for better readability.',
        },
        {
          name: 'Use Filters Effectively',
          description: 'In the Audit Log, combine multiple filters to find specific events. For example, filter by "error" severity and "last 24 hours" to find recent issues.',
        },
        {
          name: 'Explore Component Demos',
          description: 'Don\'t just read component descriptions - click through multiple components to see real examples of data, processes, and metrics.',
        },
        {
          name: 'Ask the AI for Examples',
          description: 'The AI can provide code examples, query examples, and configuration examples. Ask for specific examples related to your use case.',
        },
      ],
    },
  },
];

export function getGuideSection(id: string): GuideSection | undefined {
  return USER_GUIDE_SECTIONS.find(section => section.id === id);
}

export function searchGuideContent(query: string): GuideSection[] {
  const lowerQuery = query.toLowerCase();
  return USER_GUIDE_SECTIONS.filter(section => {
    const titleMatch = section.title.toLowerCase().includes(lowerQuery);
    const contentMatch = JSON.stringify(section.content).toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  });
}

