// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Molecular Medicine Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore pharmaceutical compounds in 3D and understand how they work with our
            AI-powered explanations.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-semibold mb-4">
                NEW FEATURE
              </div>
              <h2 className="text-3xl font-bold mb-4">Drug Interaction Analyzer</h2>
              <p className="mb-6 text-white/90">
                Our advanced AI-powered tool helps identify potential interactions between medications.
                Visualize drug interaction networks and get detailed safety information.
              </p>
              <Link href="/interactions">
                <button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors px-6 py-3 rounded-lg text-lg font-medium">
                  Try It Now
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
          <Link href="/drugs" className="w-full md:w-1/2">
            <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors">
              Explore Drugs Database
            </button>
          </Link>
          
          <Link href="/interactions" className="w-full md:w-1/2">
            <button className="w-full border-2 border-primary bg-transparent text-primary hover:bg-primary/10 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Check Drug Interactions
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">⚛️</div>
            <h2 className="text-xl font-semibold mb-2">Interactive 3D Visualization</h2>
            <p className="text-muted-foreground">
              Explore molecular structures in immersive 3D, rotate and zoom to understand 
              their structure and geometry.
            </p>
          </div>
          
          <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">Comprehensive Database</h2>
            <p className="text-muted-foreground">
              Access thousands of pharmaceutical compounds with detailed information about 
              their properties and applications.
            </p>
          </div>
          
          <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">🧠</div>
            <h2 className="text-xl font-semibold mb-2">AI-Powered Explanations</h2>
            <p className="text-muted-foreground">
              Understand how drugs work with our AI-generated explanations that break down 
              complex molecular mechanisms.
            </p>
          </div>
        </div>
        
        <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Featured Molecules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Aspirin', cid: '2244', desc: 'Pain reliever, anti-inflammatory' },
              { name: 'Ibuprofen', cid: '3672', desc: 'NSAID pain reliever' },
              { name: 'Acetaminophen', cid: '1983', desc: 'Analgesic and antipyretic' },
              { name: 'Caffeine', cid: '2519', desc: 'Central nervous system stimulant' }
            ].map((drug) => (
              <Link href={`/drugs/${drug.cid}`} key={drug.cid}>
                <div className="bg-accent dark:bg-accent/80 p-4 rounded-lg hover:bg-accent/90 dark:hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1 text-accent-foreground">{drug.name}</h3>
                  <p className="text-sm text-muted-foreground">CID: {drug.cid}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}