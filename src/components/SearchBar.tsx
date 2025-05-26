'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  isSearching?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search by drug name (e.g., Aspirin, Ibuprofen)",
  initialValue = "",
  isSearching = false
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative flex rounded-md shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-l-md border border-r-0 border-border focus:ring-2 focus:ring-primary focus:outline-none
                    bg-themed_card-contrast dark:bg-themed_card-dark_contrast text-foreground placeholder:text-muted-foreground"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 rounded-r-md bg-primary text-primary-foreground hover:bg-primary/90 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors
                    disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
