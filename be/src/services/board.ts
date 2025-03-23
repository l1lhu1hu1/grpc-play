import { sendUnaryData, ServerUnaryCall, ServerWritableStream } from "@grpc/grpc-js";
import { IBoardServiceServer } from "../generated/board_grpc_pb";
import {
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  MessageResponse,
  StreamMessagesRequest
} from "../generated/board_pb";

const boardMessages: {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}[] = [
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

function createMessageResponse(message: typeof boardMessages[0]): MessageResponse {
  const response = new MessageResponse();
  response.setId(message.id);
  response.setContent(message.content);
  response.setAuthor(message.author);
  response.setTimestamp(message.timestamp);
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

export const boardService: IBoardServiceServer = {
  getMessages(call: ServerUnaryCall<GetMessagesRequest, GetMessagesResponse>, callback: sendUnaryData<GetMessagesResponse>) {
    try {
      const limit = call.request.getLimit() || 100;
      const response = new GetMessagesResponse();

      const messages = boardMessages.slice(-limit);

      messages.forEach(message => {
        response.addMessages(createMessageResponse(message));
      });

      callback(null, response);
    } catch (error) {
      console.error("Error getting messages:", error);
      callback(new Error("Failed to get messages"), null);
    }
  },

  createMessage(call: ServerUnaryCall<CreateMessageRequest, CreateMessageResponse>, callback: sendUnaryData<CreateMessageResponse>) {
    try {
      const content = call.request.getContent();
      const author = call.request.getAuthor();

      const newMessage = {
        id: `m-${boardMessages.length + 1}`,
        content,
        author,
        timestamp: new Date().toISOString()
      };

      boardMessages.push(newMessage);

      const response = new CreateMessageResponse();
      const messageResponse = createMessageResponse(newMessage);

      response.setSuccess(true);
      response.setMessage(messageResponse);

      broadcastMessage(messageResponse);

      callback(null, response);
    } catch (error) {
      console.error("Error creating message:", error);
      const response = new CreateMessageResponse();
      response.setSuccess(false);
      callback(null, response);
    }
  },

  streamMessages(call: ServerWritableStream<StreamMessagesRequest, MessageResponse>) {
    try {
      const limit = call.request.getLimit() || 10;

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
