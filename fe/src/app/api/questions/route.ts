import { NextRequest, NextResponse } from 'next/server';
import { createQuestion } from '../../../bff/question';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author } = body;

    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const success = await createQuestion(title, author);

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
