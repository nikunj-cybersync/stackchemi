import { NextRequest, NextResponse } from 'next/server';
import { analyzeDrugInteraction } from '@/lib/models';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const drugNamesParam = searchParams.get('drugs');
  
  if (!drugNamesParam) {
    return NextResponse.json({ 
      error: 'Missing drugs parameter. Please provide a comma-separated list of drug names.' 
    }, { status: 400 });
  }

  const drugNames = drugNamesParam.split(',').map(name => name.trim()).filter(Boolean);
  
  if (drugNames.length < 2) {
    return NextResponse.json({ 
      error: 'Please provide at least two drugs to analyze interactions.' 
    }, { status: 400 });
  }

  try {
    const analysis = await analyzeDrugInteraction(drugNames);
    console.log(analysis);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing drug interactions:', error);
    return NextResponse.json(
      { error: 'Failed to analyze drug interactions' }, 
      { status: 500 }
    );
  }
} 