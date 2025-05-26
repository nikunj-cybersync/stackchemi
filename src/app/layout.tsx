import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackChemi | Molecular Medicine Explorer",
  description: "Explore pharmaceuticals in 3D, understand drug mechanisms, and check medication interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-border dark:border-gray-800">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              StackChemi
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/drugs" className="text-foreground hover:text-primary transition-colors">
                Drug Database
              </Link>
              <Link href="/interactions" className="text-foreground hover:text-primary transition-colors">
                Interaction Checker
              </Link>
              <Link 
                href="https://github.com/navdiya-nikunj/stackchemi" 
                target="_blank"
                className="text-foreground hover:text-primary transition-colors"
              >
                GitHub
              </Link>
            </nav>

            <div className="md:hidden">
              <button className="text-foreground p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-border dark:border-gray-800">
          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="text-xl font-bold text-primary">
                  StackChemi
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  Explore molecular structures and drug interactions
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <Link href="/drugs" className="text-sm text-foreground hover:text-primary transition-colors">
                  Drug Database
                </Link>
                <Link href="/interactions" className="text-sm text-foreground hover:text-primary transition-colors">
                  Interaction Checker
                </Link>
                <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border dark:border-gray-800 text-sm text-muted-foreground text-center">
              <p>© {new Date().getFullYear()} StackChemi. All rights reserved.</p>
              <p className="mt-1">This application is for educational purposes only. Always consult healthcare professionals for medical advice.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
