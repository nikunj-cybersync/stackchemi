import DrugInteractionAnalyzer from '@/components/DrugInteractionAnalyzer';

export const metadata = {
  title: 'Drug Interaction Analyzer',
  description: 'Analyze potential interactions between medications with our AI-powered drug interaction checker.',
};

export default function InteractionsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Drug Interaction Analyzer</h1>
          <p className="text-xl text-muted-foreground">
            Check for potential interactions between multiple medications using our AI-powered analysis tool.
          </p>
        </div>
        
        <DrugInteractionAnalyzer />
        
        <div className="mt-12 p-6 bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-foreground">About This Tool</h2>
          <div className="text-muted-foreground space-y-4">
            <p>
              The Drug Interaction Analyzer uses advanced AI to evaluate potential interactions between medications.
              It analyzes how drugs might interact and provides information about the potential severity and mechanisms of these interactions.
            </p>
            <p>
              <strong>Key features:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interactive visual network showing drug relationships</li>
              <li>Detailed analysis of each potential drug interaction</li>
              <li>Severity ratings to highlight potentially dangerous combinations</li>
              <li>Recommendations for patients taking multiple medications</li>
            </ul>
            <p className="text-red-600 dark:text-red-400 font-medium">
              Note: This tool is for educational purposes only. Always consult your healthcare provider before making any decisions about medication use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 