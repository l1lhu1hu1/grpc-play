import { credentials } from "@grpc/grpc-js";
import {
  BoardServiceClient,
  CreateMessageRequest,
  MessageResponse,
  StreamMessagesRequest
} from "../generated/board";

const client = new BoardServiceClient("localhost:50051", credentials.createInsecure());

export async function createMessage(content: string, author: string): Promise<{ success: boolean, message?: MessageResponse}> {
  return new Promise((resolve, reject) => {
    const request: CreateMessageRequest = {
      content,
      author
    }

    client.createMessage(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve({ success: response.success, message: response.message });
      }
    });
  });
}

export function streamMessages(
  limit: number = 10,
  onMessage: (message: MessageResponse) => void,
  onError: (error: Error) => void
): () => void {
  const request: StreamMessagesRequest = {
    limit
  }

  const stream = client.streamMessages(request);
  stream.on('data', (response: MessageResponse) => {
    onMessage(response);
  });

  stream.on('error', (err: Error) => {
    console.error("Stream error:", err);
    onError(err);
  });

  return () => {
    stream.cancel();
  };
}
