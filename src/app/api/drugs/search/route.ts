// app/api/drugs/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    // Search PubChem for compounds by name
    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`
    );
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`PubChem API error: ${text}`);
    }
    
    const data = await response.json();
    
    if (!data.IdentifierList?.CID || data.IdentifierList.CID.length === 0) {
      return NextResponse.json({ results: [] });
    }
    
    // For each CID, get the compound name
    const results = await Promise.all(
      data.IdentifierList.CID.slice(0, 15).map(async (cid: number) => {
        try {
          const detailResponse = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`
          );
          
          if (!detailResponse.ok) {
            return { cid, name: `Compound ${cid}` };
          }
          
          const detailData = await detailResponse.json();
          const synonyms = detailData.InformationList?.Information[0]?.Synonym || [];
          
          return {
            cid,
            name: synonyms[0] || `Compound ${cid}`
          };
        } catch (error) {
          console.error(`Error fetching details for CID ${cid}:`, error);
          return { cid, name: `Compound ${cid}` };
        }
      })
    );
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search for compounds' }, 
      { status: 500 }
    );
  }
}