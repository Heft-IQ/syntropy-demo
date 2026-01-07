export interface ETLvsELTComparison {
  etl: {
    name: string;
    description: string;
    flow: string[];
    characteristics: string[];
    pros: string[];
    cons: string[];
    useCase: string;
  };
  elt: {
    name: string;
    description: string;
    flow: string[];
    characteristics: string[];
    pros: string[];
    cons: string[];
    useCase: string;
  };
  keyDifferences: Array<{
    aspect: string;
    etl: string;
    elt: string;
  }>;
  whyELT: Array<{
    benefit: string;
    explanation: string;
    example?: string;
  }>;
  migrationPath: Array<{
    step: string;
    description: string;
    action: string;
  }>;
}

export const ETL_VS_ELT_CONTENT: ETLvsELTComparison = {
  etl: {
    name: 'ETL (Extract, Transform, Load)',
    description: 'Traditional approach where data is transformed BEFORE being loaded into storage. This is a "schema-on-write" approach.',
    flow: [
      'Extract data from source (ERP)',
      'Transform data in memory/ETL server',
      'Load transformed data into warehouse',
      'Query transformed data',
    ],
    characteristics: [
      'Schema-on-write: Data structure defined before storage',
      'Transformation happens during ingestion',
      'Requires predefined schema',
      'Slower ingestion (transformation bottleneck)',
      'Less flexible for schema changes',
    ],
    pros: [
      'Data is already structured when stored',
      'Queries can be faster (pre-aggregated)',
      'Familiar pattern for many engineers',
    ],
    cons: [
      'Slower ingestion (transformation is blocking)',
      'Schema changes require pipeline updates',
      'Less flexible for exploratory analytics',
      'Higher compute costs during ingestion',
      'Data loss risk if transformation fails',
    ],
    useCase: 'Best for: Stable schemas, known use cases, when query performance is critical and ingestion speed is not.',
  },
  elt: {
    name: 'ELT (Extract, Load, Transform)',
    description: 'Modern approach where data is loaded FIRST, then transformed as needed. This is a "schema-on-read" approach.',
    flow: [
      'Extract data from source (ERP)',
      'Load raw data into data lake (S3 Bronze)',
      'Transform data on-demand or in batches',
      'Query transformed data from analytics store',
    ],
    characteristics: [
      'Schema-on-read: Data structure defined when querying',
      'Transformation happens after storage',
      'Flexible schema handling',
      'Faster ingestion (no transformation bottleneck)',
      'More flexible for schema changes',
    ],
    pros: [
      'Faster ingestion (no transformation blocking)',
      'Schema flexibility (handle changes easily)',
      'Cost efficient (transform only what you need)',
      'Better for exploratory analytics',
      'Lower risk (raw data preserved)',
      'Modern data lake architecture',
    ],
    cons: [
      'Requires more storage (raw + transformed)',
      'Transformation happens at query time (can be slower)',
      'Requires more sophisticated tooling',
    ],
    useCase: 'Best for: Modern data platforms, schema evolution, high-volume ingestion, exploratory analytics, data lakes.',
  },
  keyDifferences: [
    {
      aspect: 'Transformation Timing',
      etl: 'Before storage (during ingestion)',
      elt: 'After storage (on-demand or batch)',
    },
    {
      aspect: 'Schema Approach',
      etl: 'Schema-on-write (define before storing)',
      elt: 'Schema-on-read (define when querying)',
    },
    {
      aspect: 'Ingestion Speed',
      etl: 'Slower (transformation is blocking)',
      elt: 'Faster (no transformation bottleneck)',
    },
    {
      aspect: 'Schema Flexibility',
      etl: 'Less flexible (requires pipeline updates)',
      elt: 'More flexible (handles schema changes)',
    },
    {
      aspect: 'Storage Requirements',
      etl: 'Only transformed data stored',
      elt: 'Raw + transformed data stored',
    },
    {
      aspect: 'Cost Model',
      etl: 'Higher compute during ingestion',
      elt: 'Pay for transformation only when needed',
    },
    {
      aspect: 'Risk',
      etl: 'Data loss if transformation fails',
      elt: 'Raw data always preserved',
    },
  ],
  whyELT: [
    {
      benefit: 'Faster Ingestion',
      explanation: 'By loading raw data first, we eliminate the transformation bottleneck. Data flows from ERP → S3 Bronze without waiting for complex transformations.',
      example: 'In our demo: ERP sends JSON → dlt Worker normalizes → S3 Bronze stores Parquet. No transformation blocking the pipeline.',
    },
    {
      benefit: 'Schema Flexibility',
      explanation: 'When ERP systems change their schema (new fields, renamed columns), ELT handles it gracefully. We can update transformations without breaking ingestion.',
      example: 'If NetSuite adds a new field, our ELT pipeline continues working. We update the transformation logic separately without stopping data flow.',
    },
    {
      benefit: 'Cost Efficiency',
      explanation: 'Transform only the data you actually query. No need to transform everything upfront, saving compute costs.',
      example: 'We store raw data in S3 Bronze (cheap storage), then transform only what\'s needed for analytics in Tinybird.',
    },
    {
      benefit: 'Exploratory Analytics',
      explanation: 'Raw data is always available for new use cases. You can create new transformations without re-ingesting data.',
      example: 'A new business question? Query the raw data in S3, create a new transformation, no need to modify the ingestion pipeline.',
    },
    {
      benefit: 'Data Preservation',
      explanation: 'Raw data is never lost. Even if a transformation fails, the original data remains intact in the data lake.',
      example: 'If a transformation bug corrupts data, we can always re-run the transformation from the preserved raw data in S3 Bronze.',
    },
    {
      benefit: 'Modern Architecture',
      explanation: 'ELT aligns with modern data lake architectures (Bronze/Silver/Gold layers) and cloud-native patterns.',
      example: 'Our architecture: S3 Bronze (raw) → Tinybird Silver/Gold (transformed). This is the modern standard for data platforms.',
    },
  ],
  migrationPath: [
    {
      step: 'Understand Current ETL',
      description: 'Identify where transformations happen in your current pipeline',
      action: 'Map your current ETL flow: Extract → Transform → Load',
    },
    {
      step: 'Separate Extract & Load',
      description: 'Move transformation logic out of the ingestion path',
      action: 'Create a pipeline that: Extract → Load raw data → (Transform separately)',
    },
    {
      step: 'Implement Raw Storage',
      description: 'Set up data lake storage for raw data (Bronze layer)',
      action: 'Configure S3 Bronze or similar to store raw, untransformed data',
    },
    {
      step: 'Move Transformations',
      description: 'Move transformation logic to run after data is loaded',
      action: 'Transform data in Tinybird or separate compute layer',
    },
    {
      step: 'Validate & Monitor',
      description: 'Ensure data quality and monitor transformation performance',
      action: 'Compare results, monitor costs, validate data quality',
    },
  ],
};

export const ELT_IN_DEMO = {
  title: 'ELT in Our Demo',
  description: 'See how ELT works in the Syntropy architecture',
  flow: [
    {
      step: 1,
      component: 'ERP (NetSuite, Salesforce, SAP)',
      action: 'Extract raw JSON data via REST API',
      dataFormat: 'Raw JSON',
      note: 'No transformation at this stage',
    },
    {
      step: 2,
      component: 'dlt Worker',
      action: 'Normalize JSON structure, convert to Parquet',
      dataFormat: 'Normalized Parquet',
      note: 'Minimal transformation - just format conversion',
    },
    {
      step: 3,
      component: 'S3 Bronze',
      action: 'Store raw/normalized data in data lake',
      dataFormat: 'Parquet files',
      note: 'Raw data preserved - schema-on-read',
    },
    {
      step: 4,
      component: 'Tinybird',
      action: 'Auto-ingest and transform for analytics',
      dataFormat: 'Queryable analytics',
      note: 'Transformation happens here - schema-on-read',
    },
  ],
  keyPoints: [
    'No transformation blocking the ERP → S3 pipeline',
    'Raw data always preserved in S3 Bronze',
    'Transformations happen in Tinybird (Silver/Gold layer)',
    'Schema changes don\'t break ingestion',
    'Fast ingestion, flexible transformations',
  ],
};

