// app/drugs/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import DrugCard from '@/components/DrugCard';

interface DrugResult {
  cid: number;
  name: string;
}

export default function DrugsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<DrugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSearch(query: string) {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.results);
      
      // If there's only one result, redirect directly to it
      if (data.results.length === 1) {
        router.push(`/drugs/${data.results[0].cid}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search for drugs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Array of popular drugs for quick search
  const popularDrugs = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 
    'Atorvastatin', 'Amoxicillin', 'Lisinopril', 'Levothyroxine'
  ];

  return (
    <div className="container mx-auto py-12 px-4 min-h-[85vh]">
      <h1 className="text-4xl font-bold mb-6 text-center text-foreground">Drug Database</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
        Search for drugs by name to view their molecular structures, properties, and explanations of their mechanisms of action.
      </p>
      
      <div className="mb-12">
        <SearchBar 
          onSearch={handleSearch}
          isSearching={loading}
          initialValue={searchQuery}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((drug) => (
              <DrugCard 
                key={drug.cid}
                cid={drug.cid}
                name={drug.name}
                subtitle={`CID: ${drug.cid}`}
              />
            ))}
          </div>
        </div>
      ) : searchQuery ? (
        <div className="text-center py-16 bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-xl shadow-md">
          <svg className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl text-foreground mb-3">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try searching with a different drug name or check the spelling.
          </p>
        </div>
      ) : (
        <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Popular Drugs</h2>
          <p className="text-muted-foreground mb-6">
            Click on any of these common drugs to view their details, or search for something specific:
          </p>
          <div className="flex flex-wrap gap-3">
            {popularDrugs.map((drug) => (
              <button
                key={drug}
                onClick={() => handleSearch(drug)}
                className="bg-accent/80 hover:bg-accent text-accent-foreground rounded-full px-5 py-2 text-sm 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {drug}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { name: 'Aspirin', cid: '2244', desc: 'Pain reliever, anti-inflammatory' },
              { name: 'Ibuprofen', cid: '3672', desc: 'NSAID pain reliever' },
              { name: 'Acetaminophen', cid: '1983', desc: 'Analgesic and antipyretic' },
              { name: 'Caffeine', cid: '2519', desc: 'Central nervous system stimulant' }
            ].map((drug) => (
              <DrugCard
                key={drug.cid}
                cid={drug.cid}
                name={drug.name}
                subtitle={drug.desc}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}