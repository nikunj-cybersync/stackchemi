import Link from 'next/link';
import { ReactNode } from 'react';

interface DrugCardProps {
  cid: string | number;
  name: string;
  subtitle?: string;
  children?: ReactNode;
  showViewDetails?: boolean;
}

export default function DrugCard({ 
  cid, 
  name, 
  subtitle, 
  children, 
  showViewDetails = true 
}: DrugCardProps) {
  return (
    <Link href={`/drugs/${cid}`} className="block">
      <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-lg p-6 shadow-lg 
                    hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-foreground">{name}</h2>
          
          {subtitle && (
            <p className="text-muted-foreground mb-4 text-sm">{subtitle}</p>
          )}
          
          {children && (
            <div className="mt-1">
              {children}
            </div>
          )}
        </div>
        
        {showViewDetails && (
          <div className="flex justify-end mt-4 pt-3 border-t border-border dark:border-border/50">
            <span className="text-primary dark:text-primary-foreground/90 font-medium text-sm flex items-center">
              View Details
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
