/* eslint-disable @typescript-eslint/no-explicit-any */
// app/drugs/[id]/page.tsx
import { Suspense } from 'react';
import { getMolecule3D, getDrugDetails } from '@/lib/pubchem';
import MoleculeViewer from '@/components/MoleculeViewer';
import AIExplanation from '@/components/AIExplanation';
import { DrugProperty } from '@/lib/types';

interface Props {
  params: any;
  searchParams: any;
}


export default async function DrugPage({ params }: Props) {
  // Fetch data concurrently
  const [moleculeData, drugDetails] = await Promise.all([
    getMolecule3D(params.id),
    getDrugDetails(params.id)
  ]);
  
  const compound = drugDetails?.PC_Compounds[0];
  const name = compound?.props.find(
    (prop: DrugProperty) => prop.urn.label === 'IUPAC Name'
  )?.value?.sval || 'Unknown';
  
  const synonyms = compound?.synonyms || [];
  const commonName = synonyms[0] || name;
  
  return (
    <div className="container mx-auto py-8 px-4 text-foreground">
      <h1 className="text-3xl font-bold mb-6">{commonName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Molecular Structure</h2>
          {/* Use themed card colors with dark mode variant */}
          <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-lg overflow-hidden shadow-lg">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading molecule...</div>}>
              <MoleculeViewer moleculeData={moleculeData} height="400px" />
            </Suspense>
          </div>
          
          {/* Add AIExplanation component */}
          <div className="mt-6">
            <AIExplanation drugName={commonName} drugCID={params.id} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          {/* Use themed card colors with dark mode variant */}
          <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">General Information</h3>
              {/* Ensure table text uses foreground color, borders adjust */}
              <table className="w-full text-sm text-foreground">
                <tbody>
                  {/* Use themed border colors */}
                  <tr className="border-b border-border dark:border-slate-700">
                    <td className="py-2 font-medium">CID</td>
                    <td className="py-2">{params.id}</td>
                  </tr>
                  <tr className="border-b border-border dark:border-slate-700">
                    <td className="py-2 font-medium">IUPAC Name</td>
                    <td className="py-2">{name}</td>
                  </tr>
                  <tr className="border-b border-border dark:border-slate-700">
                    <td className="py-2 font-medium">Formula</td>
                    <td className="py-2">
                      {compound?.props.find(
                        (prop: DrugProperty) => prop.urn.label === 'Molecular Formula'
                      )?.value?.sval || 'N/A'}
                    </td>
                  </tr>
                  {/* No border on last row */}
                  <tr>
                    <td className="py-2 font-medium">Molecular Weight</td>
                    <td className="py-2">
                      {compound?.props.find(
                        (prop: DrugProperty) => prop.urn.label === 'Molecular Weight'
                      )?.value?.fval?.toFixed(2) || 'N/A'} g/mol
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Additional Properties</h3>
              <div className="grid grid-cols-1 gap-2">
                {compound?.props
                  .filter((prop: DrugProperty) => 
                    ['XLogP', 'Hydrogen Bond Donor Count', 'Hydrogen Bond Acceptor Count', 'Rotatable Bond Count']
                    .includes(prop.urn.label))
                  .map((prop: DrugProperty, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b border-border dark:border-slate-700 py-2 last:border-0">
                      <span className="font-medium">{prop.urn.label}</span>
                      <span>{prop.value.fval !== undefined ? prop.value.fval : prop.value.ival}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Alternative Names</h2>
         {/* Use themed card colors with dark mode variant */}
        <div className="bg-themed_card-contrast dark:bg-themed_card-dark_contrast rounded-lg p-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {synonyms.slice(0, 15).map((synonym: string, index: number) => (
              // Use themed tag colors with dark mode variants
              <span key={index} className="bg-themed_tag-DEFAULT text-themed_tag-foreground dark:bg-themed_tag-dark_DEFAULT dark:text-themed_tag-dark_foreground px-2 py-1 rounded-full text-sm">
                {synonym}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}