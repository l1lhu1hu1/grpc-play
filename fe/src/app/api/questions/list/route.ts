import { NextRequest, NextResponse } from 'next/server';
import { fetchQuestions } from '../../../../bff/question';

export async function GET(request: NextRequest) {
  try {
    // Get the limit parameter from the URL, default to 10
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const questions = await fetchQuestions(limit);

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
