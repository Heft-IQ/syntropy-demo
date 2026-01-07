'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface C1RendererProps {
  components: any;
  onError?: (error: Error) => void;
}

export function C1Renderer({ components, onError }: C1RendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // Try to dynamically import and render C1 components
    const loadC1Component = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if C1 SDK is available
        try {
          // For now, we'll render a placeholder that shows the component structure
          // In production, this would use the actual C1Component from @thesysai/genui-sdk
          if (components) {
            // Render based on component type
            const componentType = components.type || components.componentType;
            
            if (componentType === 'diagram' || componentType === 'architecture') {
              setRenderedComponent(<ArchitectureDiagramPlaceholder data={components} />);
            } else if (componentType === 'chart' || componentType === 'flow') {
              setRenderedComponent(<FlowChartPlaceholder data={components} />);
            } else if (componentType === 'table' || componentType === 'comparison') {
              setRenderedComponent(<ComparisonTablePlaceholder data={components} />);
            } else {
              setRenderedComponent(<GenericC1Placeholder data={components} />);
            }
          }
        } catch (sdkError) {
          // C1 SDK not available, use placeholder
          setRenderedComponent(<C1Placeholder data={components} />);
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to render C1 component');
        setIsLoading(false);
        onError?.(err);
      }
    };

    if (components) {
      loadC1Component();
    }
  }, [components, onError]);

  if (isLoading) {
    return (
      <div className="my-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center gap-3">
        <Loader2 size={16} className="text-indigo-400 animate-spin" />
        <span className="text-sm text-slate-400">Generating interactive component...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <div className="text-sm text-red-400">Failed to render component: {error}</div>
      </div>
    );
  }

  return <div className="my-4">{renderedComponent}</div>;
}

// Placeholder components until C1 SDK is fully integrated
function ArchitectureDiagramPlaceholder({ data }: { data: any }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="text-sm font-bold text-white mb-4">🏗️ Architecture Diagram</div>
      <div className="text-xs text-slate-400 mb-4">
        Interactive architecture visualization (C1 component)
      </div>
      <div className="bg-slate-900 rounded p-4 font-mono text-xs text-slate-500">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}

function FlowChartPlaceholder({ data }: { data: any }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="text-sm font-bold text-white mb-4">📊 Data Flow Chart</div>
      <div className="text-xs text-slate-400 mb-4">
        Interactive flow visualization (C1 component)
      </div>
      <div className="bg-slate-900 rounded p-4 font-mono text-xs text-slate-500">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}

function ComparisonTablePlaceholder({ data }: { data: any }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="text-sm font-bold text-white mb-4">📋 Comparison Table</div>
      <div className="text-xs text-slate-400 mb-4">
        Interactive comparison table (C1 component)
      </div>
      <div className="bg-slate-900 rounded p-4 font-mono text-xs text-slate-500">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}

function GenericC1Placeholder({ data }: { data: any }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="text-sm font-bold text-white mb-4">✨ Interactive Component</div>
      <div className="text-xs text-slate-400 mb-4">
        C1 Generative UI component
      </div>
      <div className="bg-slate-900 rounded p-4 font-mono text-xs text-slate-500 overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}

function C1Placeholder({ data }: { data: any }) {
  return (
    <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-4 my-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-indigo-400">C1 Component</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-600/20 text-indigo-300 rounded">
          Generative UI
        </span>
      </div>
      <div className="text-xs text-slate-400">
        This response includes interactive UI components generated by C1. 
        The full C1 SDK integration will render these as interactive elements.
      </div>
      {data && (
        <details className="mt-3">
          <summary className="text-xs text-slate-500 cursor-pointer">View component data</summary>
          <pre className="mt-2 text-[10px] text-slate-500 bg-slate-900 rounded p-2 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

