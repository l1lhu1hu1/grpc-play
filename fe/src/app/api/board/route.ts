import { NextRequest, NextResponse } from 'next/server';
import { createMessage, fetchMessages } from '../../../bff/board';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);

    const messages = await fetchMessages(limit);

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author } = body;

    if (!content || !author) {
      return NextResponse.json(
        { success: false, error: 'Content and author are required' },
        { status: 400 }
      );
    }

    const result = await createMessage(content, author);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
