import { NextRequest } from 'next/server';
import { streamMessages } from '../../../../bff/board';

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
