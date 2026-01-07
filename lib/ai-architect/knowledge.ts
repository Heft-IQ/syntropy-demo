import { ArchitectureKnowledge, ComponentDefinition, FlowDefinition, FAQ, CodeExample } from '@/types/ai-architect';
import { COMPONENT_DEMOS, FLOW_CONNECTIONS } from '@/lib/data';

export const ARCHITECTURE_KNOWLEDGE: ArchitectureKnowledge = {
  components: Object.values(COMPONENT_DEMOS).map((demo) => ({
    id: demo.id,
    name: demo.name,
    description: demo.description,
    responsibility: demo.responsibility,
    category: demo.category,
    dataFlowIn: demo.architectureContext?.dataFlowIn || [],
    dataFlowOut: demo.architectureContext?.dataFlowOut || [],
    dependencies: [
      ...(demo.dependencies?.dependsOn || []),
      ...(demo.dependencies?.dependedBy || []),
    ],
    examples: {
      code: demo.examples.data?.content,
      queries: demo.examples.data?.content,
      config: demo.examples.data?.content,
    },
  })),

  flows: FLOW_CONNECTIONS.map((flow) => ({
    from: flow.from,
    to: flow.to,
    label: flow.label,
    flowType: flow.flowType,
    description: `Data flows from ${COMPONENT_DEMOS[flow.from]?.name || flow.from} to ${COMPONENT_DEMOS[flow.to]?.name || flow.to} as ${flow.label}`,
    dataFormat: flow.label,
  })),

  commonQuestions: [
    {
      question: 'How does data flow from ERP to Tinybird?',
      answer: 'Data flows through the ingestion pipeline: ERP (NetSuite) → dlt Worker → S3 Bronze → Tinybird. The ERP system provides raw JSON data via REST API, which is normalized by the dlt Worker into Parquet format, stored in S3 Bronze, and then ingested into Tinybird for querying.',
      keywords: ['erp', 'tinybird', 'data flow', 'ingestion', 'pipeline'],
      relatedComponents: ['erp', 'worker', 's3', 'tinybird'],
    },
    {
      question: 'What is FalkorDB used for?',
      answer: 'FalkorDB is the Knowledge Graph (Control Plane) that stores mappings between Business Terms (Canonical), ERP Columns (Physical), and Access Control (RBAC). It maintains semantic relationships between canonical business terms, physical ERP assets, and access control policies. Cube Gateway queries FalkorDB to resolve metric definitions.',
      keywords: ['falkordb', 'knowledge graph', 'control plane', 'canonical', 'mappings'],
      relatedComponents: ['falkordb', 'cube'],
    },
    {
      question: 'How do I query Net Revenue?',
      answer: 'To query Net Revenue: 1) User sends a metric query to Cube Gateway, 2) Cube Gateway checks permissions with Clerk Auth, 3) Cube Gateway resolves the metric schema from FalkorDB, 4) Cube Gateway translates the query to SQL and sends it to Tinybird, 5) Tinybird executes the query and returns results. The Net Revenue metric is calculated as: gross_sales - returns - tax.',
      keywords: ['query', 'net revenue', 'cube', 'tinybird', 'metric'],
      relatedComponents: ['user', 'cube', 'clerk', 'falkordb', 'tinybird'],
    },
    {
      question: "What's the difference between S3 Bronze and Tinybird?",
      answer: 'S3 Bronze is the immutable storage layer (data lake) that stores raw ingested data in Parquet format, organized by vendor connectors. Tinybird is the compute layer (Silver/Gold) that provides high-performance analytical queries on processed data. S3 Bronze is for storage, Tinybird is for querying.',
      keywords: ['s3', 'tinybird', 'storage', 'compute', 'difference'],
      relatedComponents: ['s3', 'tinybird'],
    },
    {
      question: 'What does the dlt Worker do?',
      answer: 'The dlt Worker is an ETL pipeline that normalizes and transforms data. It receives raw JSON from ERP systems, detects schemas, maps fields to canonical names, validates data types, and standardizes formats (dates, currencies, etc.). It outputs normalized Parquet files to S3 Bronze.',
      keywords: ['dlt', 'worker', 'etl', 'normalization', 'transformation'],
      relatedComponents: ['worker', 'erp', 's3'],
    },
    {
      question: 'How does authentication work?',
      answer: 'Authentication uses Clerk Auth: 1) User logs in through the Dashboard, 2) Clerk validates credentials and issues a JWT token, 3) The JWT contains user role and permissions, 4) Cube Gateway validates the JWT for each query, 5) Permissions are checked against RBAC policies stored in FalkorDB.',
      keywords: ['auth', 'authentication', 'clerk', 'jwt', 'permissions'],
      relatedComponents: ['user', 'clerk', 'cube', 'falkordb'],
    },
    {
      question: 'What is Cube Gateway?',
      answer: 'Cube Gateway is the semantic layer API gateway that resolves metric definitions, checks permissions, and routes queries. It acts as the intermediary between the frontend and data stores, translating business metrics into SQL queries and enforcing access control.',
      keywords: ['cube', 'gateway', 'semantic layer', 'api'],
      relatedComponents: ['cube', 'user', 'clerk', 'falkordb', 'tinybird'],
    },
  ],

  codeExamples: [
    {
      id: 'query-net-revenue',
      title: 'Query Net Revenue',
      description: 'Example query to get Net Revenue metric',
      language: 'json',
      code: `{
  "metric": "Net Revenue",
  "filters": {"date": "2024-Q1"}
}`,
      relatedComponent: 'cube',
      category: 'query',
    },
    {
      id: 'netsuite-api',
      title: 'NetSuite API Response',
      description: 'Example response from NetSuite ERP',
      language: 'json',
      code: `{
  "transactions": [{
    "id": "TXN-001",
    "gross_sales": 125000.00,
    "returns": 2500.00,
    "tax": 10250.00
  }]
}`,
      relatedComponent: 'erp',
      category: 'example',
    },
    {
      id: 'cypher-query',
      title: 'FalkorDB Cypher Query',
      description: 'Query the knowledge graph for metric definitions',
      language: 'cypher',
      code: `MATCH (c:VendorColumn {name: 'AMOUNT_NET'})
MATCH (a:CanonicalAttribute {name: 'GrossRevenue'})
CREATE (c)-[:MAPS_TO {confidence: 0.98}]->(a)`,
      relatedComponent: 'falkordb',
      category: 'query',
    },
  ],
};

