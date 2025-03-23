import { credentials } from "@grpc/grpc-js";
import { BoardServiceClient } from "../generated/board_grpc_pb";
import {
  CreateMessageRequest,
  GetMessagesRequest,
  MessageResponse,
  StreamMessagesRequest
} from "../generated/board_pb";

const client = new BoardServiceClient("localhost:50051", credentials.createInsecure());

export async function fetchMessages(limit: number = 100): Promise<MessageResponse.AsObject[]> {
  return new Promise((resolve, reject) => {
    const request = new GetMessagesRequest();
    request.setLimit(limit);

    client.getMessages(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.getMessagesList().map(message => message.toObject()));
      }
    });
  });
}

export async function createMessage(content: string, author: string): Promise<{ success: boolean, message?: MessageResponse.AsObject }> {
  return new Promise((resolve, reject) => {
    const request = new CreateMessageRequest();
    request.setContent(content);
    request.setAuthor(author);

    client.createMessage(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        const success = response.getSuccess();
        const message = response.getMessage()?.toObject();
        resolve({ success, message });
      }
    });
  });
}

export function streamMessages(
  limit: number = 10,
  onMessage: (message: MessageResponse.AsObject) => void,
  onError: (error: Error) => void
): () => void {
  const request = new StreamMessagesRequest();
  request.setLimit(limit);

  const stream = client.streamMessages(request);

  stream.on('data', (response: MessageResponse) => {
    onMessage(response.toObject());
  });

  stream.on('error', (err: Error) => {
    console.error("Stream error:", err);
    onError(err);
  });

  return () => {
    stream.cancel();
  };
}
