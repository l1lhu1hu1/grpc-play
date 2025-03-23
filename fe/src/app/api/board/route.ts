import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '../../../bff/board';
import { streamMessages } from '../../../bff/board';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);

  const stream = new ReadableStream({
    start(controller) {
      const sendMessage = (message: any) => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(message)}\n\n`));
      };

      const handleError = (error: Error) => {
        console.error('Stream error:', error);
        sendMessage({ error: error.message });
        controller.close();
      };

      try {
        const cancelStream = streamMessages(
          limit,
          (message) => {
            sendMessage(message);
          },
          (error) => {
            handleError(error);
          }
        );

        request.signal.addEventListener('abort', () => {
          cancelStream();
        });
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
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
