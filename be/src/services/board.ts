import { sendUnaryData, ServerUnaryCall, ServerWritableStream } from "@grpc/grpc-js";
import {
  BoardServiceServer,
  CreateMessageRequest,
  CreateMessageResponse,
  MessageResponse,
  StreamMessagesRequest
} from "../generated/board";

const boardMessages = [
    {
      id: "m-1",
      content: "Welcome to the message board!",
      author: "Admin",
      timestamp: new Date().toISOString()
    },
    {
      id: "m-2",
      content: "Feel free to post your messages here.",
      author: "Admin",
      timestamp: new Date().toISOString()
    }
  ];

const activeStreams: ServerWritableStream<StreamMessagesRequest, MessageResponse>[] = [];

function createMessageResponse(message: MessageResponse): MessageResponse {
  const response: MessageResponse = {
    id: message.id,
    content: message.content,
    author: message.author,
    timestamp: message.timestamp
  }
  return response;
}

function broadcastMessage(message: MessageResponse): void {
  const closedStreamIndexes: number[] = [];

  activeStreams.forEach((stream, index) => {
    try {
      stream.write(message);
    } catch (error) {
      console.error("Error writing to stream:", error);
      closedStreamIndexes.push(index);
    }
  });

  closedStreamIndexes.reverse().forEach(index => {
    activeStreams.splice(index, 1);
  });
}

export const boardService: BoardServiceServer = {
  createMessage(call: ServerUnaryCall<CreateMessageRequest, CreateMessageResponse>, callback: sendUnaryData<CreateMessageResponse>) {
    try {
      const content = call.request.content
      const author = call.request.author

      const newMessage = {
        id: `m-${boardMessages.length + 1}`,
        content,
        author,
        timestamp: new Date().toISOString()
      };

      boardMessages.push(newMessage);

      const messageResponse = createMessageResponse(newMessage);
      const response: CreateMessageResponse = {
        success: true,
        message: messageResponse
      }
      broadcastMessage(messageResponse);

      callback(null, response);
    } catch (error) {
      console.error("Error creating message:", error);
      const response: CreateMessageResponse = {
        success: false,
        message: undefined
      }
      callback(null, response);
    }
  },

  streamMessages(call: ServerWritableStream<StreamMessagesRequest, MessageResponse>) {
    try {
      const limit = call.request.limit || 10;

      const recentMessages = boardMessages.slice(-limit);

      recentMessages.forEach(message => {
        call.write(createMessageResponse(message));
      });

      activeStreams.push(call);

      call.on('cancelled', () => {
        const index = activeStreams.indexOf(call);
        if (index !== -1) {
          activeStreams.splice(index, 1);
        }
      });

    } catch (error) {
      console.error("Error streaming messages:", error);
      call.destroy(new Error("Failed to stream messages"));
    }
  }
};
