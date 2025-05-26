// app/api/drugs/explanation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateDrugExplanation } from '@/lib/models';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const drugName = searchParams.get('name');
  const cid = searchParams.get('cid');
  
  if (!drugName || !cid) {
    return NextResponse.json({ error: 'Missing drug name or CID' }, { status: 400 });
  }

  try {
    // You could add caching logic here to avoid unnecessary API calls
    const explanation = await generateDrugExplanation(drugName);
    
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' }, 
      { status: 500 }
    );
  }
}