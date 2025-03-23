import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UserServiceService } from "./generated/user_grpc_pb";
import { QuestionServiceService } from "./generated/question_grpc_pb";
import { BoardServiceService } from "./generated/board_grpc_pb";
import { userService } from './services/user'
import { questionService } from './services/question'
import { boardService } from './services/board'

const server = new Server();

server.addService(UserServiceService, userService);
server.addService(QuestionServiceService, questionService);
server.addService(BoardServiceService, boardService);

server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC Server running on 50051");
});
