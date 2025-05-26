"use client";
// components/AIExplanation.tsx
import { useState, useEffect } from 'react';

interface AIExplanationProps {
  drugName: string;
  drugCID: string;
}

export default function AIExplanation({ drugName, drugCID }: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExplanation() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/drugs/explanation?name=${encodeURIComponent(drugName)}&cid=${drugCID}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setExplanation(data.explanation);
      } catch (error) {
        console.error('Failed to fetch AI explanation:', error);
        setError('Failed to generate explanation. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (drugName && drugCID) {
      fetchExplanation();
    }
  }, [drugName, drugCID]);

  return (
    <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast p-6 rounded-md mt-4 shadow-md transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" 
            clipRule="evenodd" 
          />
        </svg>
        Mechanism of Action
      </h3>
      
      {loading ? (
        <div className="flex items-center space-x-3 text-muted-foreground py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p>Generating scientific explanation...</p>
        </div>
      ) : error ? (
        <div className="text-destructive p-4 rounded-md bg-destructive/10">
          <p className="mb-2 font-medium">An error occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="leading-relaxed text-foreground">
            {explanation.split('\n').map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-3' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-muted dark:border-muted/50">
            <div className="text-xs text-muted-foreground italic">
              This explanation was generated with AI assistance. Verify with medical sources.
            </div>
            
            <button 
              onClick={() => {
                setLoading(true);
                fetch(`/api/drugs/explanation?name=${encodeURIComponent(drugName)}&cid=${drugCID}&refresh=true`)
                  .then(response => response.json())
                  .then(data => {
                    setExplanation(data.explanation);
                    setLoading(false);
                  })
                  .catch(() => {
                    setError('Failed to regenerate explanation.');
                    setLoading(false);
                  });
              }}
              className="text-xs flex items-center text-primary hover:text-primary/80 transition-colors dark:text-primary-foreground/90"
              aria-label="Regenerate explanation"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3.5 w-3.5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}