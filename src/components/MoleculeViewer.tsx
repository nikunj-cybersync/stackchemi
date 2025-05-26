"use client";
// components/MoleculeViewer.tsx
import { useEffect, useRef } from 'react';

// Define the window interface to include $3Dmol
declare global {
  interface Window {
    $3Dmol: {
      createViewer: (element: HTMLDivElement, options: { backgroundColor: string }) => Viewer;
      SurfaceType: {
        VDW: number;
      };
    };
  }
}

interface Viewer {
  addModel: (data: string, format: string) => Model;
  setStyle: (sel: object, style: { stick: { radius: number } }) => void;
  addSurface: (type: number, options: { opacity: number; color: string }) => void;
  zoomTo: () => void;
  render: () => void;
  spin: (enabled: boolean) => void;
}

// Replace empty interface with a type alias
type Model = object;

interface MoleculeViewerProps {
  moleculeData: string;
  height?: string;
  width?: string;
}

const MoleculeViewer = ({ moleculeData, height = '400px', width = '100%' }: MoleculeViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const moleculeRef = useRef<Model | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.$3Dmol && viewerRef.current && moleculeData) {
      // Clear previous viewer if it exists
      if (viewerRef.current.innerHTML !== '') {
        viewerRef.current.innerHTML = '';
      }

      // Initialize viewer
      const viewer = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      });

      // Add molecule
      moleculeRef.current = viewer.addModel(moleculeData, 'sdf');
      
      // Style the molecule
      viewer.setStyle({}, { stick: { radius: 0.2 } });
      viewer.addSurface(window.$3Dmol.SurfaceType.VDW, {
        opacity: 0.7,
        color: 'spectrum'
      });
      
      // Render the molecule
      viewer.zoomTo();
      viewer.render();
      
      // Enable rotation
      viewer.spin(true);
    }
  }, [moleculeData]);

  return (
    <div 
      ref={viewerRef} 
      style={{ 
        height, 
        width, 
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }} 
    />
  );
};

export default MoleculeViewer;