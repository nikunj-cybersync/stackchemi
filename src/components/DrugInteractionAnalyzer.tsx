/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// components/DrugInteractionAnalyzer.tsx
import { useState, useEffect, useRef } from 'react';
import { DrugInteractionAnalysis } from '@/lib/types';
import * as d3 from 'd3';

interface DrugInteractionAnalyzerProps {
  initialDrugs?: string[];
}

export default function DrugInteractionAnalyzer({ initialDrugs = [] }: DrugInteractionAnalyzerProps) {
  const [drugList, setDrugList] = useState<string[]>(initialDrugs);
  const [newDrug, setNewDrug] = useState<string>('');
  const [analysis, setAnalysis] = useState<DrugInteractionAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const suggestionsList = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Warfarin', 'Lisinopril', 
    'Metformin', 'Atorvastatin', 'Amoxicillin', 'Prednisone', 'Metoprolol',
    'Levothyroxine', 'Omeprazole', 'Simvastatin', 'Losartan', 'Gabapentin',
    'Amlodipine', 'Hydrochlorothiazide', 'Sertraline', 'Albuterol', 'Furosemide'
  ];
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (newDrug.trim().length > 1) {
      const filtered = suggestionsList
        .filter(drug => drug.toLowerCase().includes(newDrug.toLowerCase()))
        .filter(drug => !drugList.includes(drug));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [newDrug, drugList, suggestionsList]);

  const addDrug = (drug: string) => {
    if (drug && !drugList.includes(drug)) {
      setDrugList([...drugList, drug]);
      setNewDrug('');
      setSuggestions([]);
    }
  };

  const removeDrug = (index: number) => {
    const newList = [...drugList];
    newList.splice(index, 1);
    setDrugList(newList);
  };

  const analyzeInteractions = async () => {
    if (drugList.length < 2) {
      setError('Please add at least two drugs to analyze interactions.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/drugs/interaction?drugs=${encodeURIComponent(drugList.join(','))}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to analyze drug interactions:', error);
      setError('Failed to analyze interactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderInteractionGraph = () => {
    if (!analysis || !svgRef.current || !tooltipRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data for the graph
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Create a map of normalized drug names
    const drugNameMap = new Map<string, string>();
    drugList.forEach(drug => {
      const normalizedName = drug.toLowerCase().trim();
      drugNameMap.set(normalizedName, drug);
      nodes.push({
        id: drug,
        name: drug,
        type: 'drug',
        group: 1
      });
    });

    // Add interactions as links, but only if both drugs exist in our nodes
    analysis.interactions.forEach((interaction) => {
      const [source, target] = interaction.drugs;
      const sourceNorm = source.toLowerCase().trim();
      const targetNorm = target.toLowerCase().trim();
      
      // Only add the link if both drugs exist in our nodes
      if (drugNameMap.has(sourceNorm) && drugNameMap.has(targetNorm)) {
        links.push({
          source: drugNameMap.get(sourceNorm),
          target: drugNameMap.get(targetNorm),
          value: getSeverityValue(interaction.severity),
          severity: interaction.severity,
          effect: interaction.effect,
          interaction
        });
      }
    });

    // Set up SVG container
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    const width = svgRef.current.clientWidth;
    const height = 500;

    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Define color scales based on severity
    const severityColor = (severity: string) => {
      switch (severity) {
        case 'Severe': return 'rgb(220, 38, 38)'; // red-600
        case 'Moderate': return 'rgb(234, 179, 8)'; // yellow-500
        case 'Mild': return 'rgb(34, 197, 94)'; // green-500
        default: return 'rgb(156, 163, 175)'; // gray-400
      }
    };

    // Draw links
    const link = svg.append('g')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => severityColor(d.severity))
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    // Draw nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 25)
      .attr('fill', 'rgb(59, 130, 246)') // blue-500
      .call(drag(simulation) as any);

    // Add drug names to nodes
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .text(d => d.name)
      .style('font-size', '10px')
      .style('pointer-events', 'none');

    // Add interaction tooltips
    node.on('mouseover', function(event, d) {
      tooltip
        .style('opacity', 1)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .html(`<div class="font-medium">${d.name}</div>`);
    })
    .on('mouseout', function() {
      tooltip.style('opacity', 0);
    });

    link.on('mouseover', function(event, d) {
      tooltip
        .style('opacity', 1)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .html(`
          <div class="font-medium">${d.interaction.drugs.join(' + ')}</div>
          <div class="text-sm mt-1">${d.interaction.effect}</div>
          <div class="text-xs mt-1 ${getSeverityClass(d.interaction.severity)}">
            ${d.interaction.severity} Interaction
          </div>
        `);
    })
    .on('mouseout', function() {
      tooltip.style('opacity', 0);
    });

    // Update the simulation tick function
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Drag behavior
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  };

  useEffect(() => {
    if (analysis && svgRef.current && tooltipRef.current) {
      renderInteractionGraph();
    }
  }, [analysis]);

  // Helper functions
  const getSeverityValue = (severity: string): number => {
    switch (severity) {
      case 'Severe': return 3;
      case 'Moderate': return 2;
      case 'Mild': return 1;
      default: return 1;
    }
  };

  const getSeverityClass = (severity: string): string => {
    switch (severity) {
      case 'Severe': return 'text-red-600 font-bold';
      case 'Moderate': return 'text-yellow-600 font-bold';
      case 'Mild': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBgClass = (severity: string): string => {
    switch (severity) {
      case 'Severe': return 'bg-red-100 text-red-800 border-red-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Mild': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Drug Interaction Analyzer</h2>
      <p className="text-muted-foreground mb-6">
        Add medications to check for potential interactions, contraindications, and safety information.
      </p>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {drugList.map((drug, index) => (
            <div 
              key={index} 
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full flex items-center"
            >
              <span>{drug}</span>
              <button 
                onClick={() => removeDrug(index)}
                className="ml-2 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100"
                aria-label={`Remove ${drug}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 relative">
          <input
            type="text"
            value={newDrug}
            onChange={(e) => setNewDrug(e.target.value)}
            placeholder="Add medication (e.g., Aspirin)"
            className="flex-1 px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none 
                     bg-themed_card-contrast dark:bg-themed_card-dark_contrast text-foreground"
          />
          <button
            onClick={() => addDrug(newDrug)}
            disabled={!newDrug.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
          
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
              {suggestions.map((drug, index) => (
                <button
                  key={index}
                  onClick={() => addDrug(drug)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground"
                >
                  {drug}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={analyzeInteractions}
          disabled={drugList.length < 2 || loading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            'Analyze Interactions'
          )}
        </button>
      </div>
      
      {error && (
        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {analysis && (
        <div className="space-y-8">
          <div className="border border-border dark:border-gray-700 rounded-md overflow-hidden">
            <div className={`p-4 ${getSeverityBgClass(analysis.severity)}`}>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold">Interaction Summary</h3>
              </div>
              <p>{analysis.summary}</p>
              <p className="mt-2 font-medium">{analysis.recommendation}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Interaction Network</h3>
            <div className="relative border border-border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <svg 
                ref={svgRef} 
                width="100%" 
                height="500"
                className="interaction-graph"
              ></svg>
              <div 
                ref={tooltipRef}
                className="absolute opacity-0 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none transition-opacity duration-200 z-10 text-foreground"
                style={{ maxWidth: '250px' }}
              ></div>
            </div>
          </div>
          
          {analysis.interactions.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">Detailed Interactions</h3>
              <div className="space-y-4">
                {analysis.interactions.map((interaction, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-md overflow-hidden ${getSeverityBgClass(interaction.severity)}`}
                  >
                    <div className="p-4">
                      <h4 className="text-lg font-bold mb-2">{interaction.drugs.join(' + ')}</h4>
                      <p className="mb-2">{interaction.effect}</p>
                      <p className="text-sm mb-2"><span className="font-medium">Mechanism:</span> {interaction.mechanism}</p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Severity:</span> 
                        <span className={getSeverityClass(interaction.severity)}> {interaction.severity}</span>
                      </p>
                      <p className="text-sm font-medium">
                        <span className="font-medium">Recommendation:</span> {interaction.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">No Interactions Found</h3>
              <p className="text-green-700 dark:text-green-400">
                No known interactions were found between these medications. However, always consult your healthcare provider before combining medications.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 