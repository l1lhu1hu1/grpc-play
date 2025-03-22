import { Server, ServerCredentials } from "@grpc/grpc-js";
import { getUser } from './handlers/user'
import { getQuestion } from './handlers/question'
import { userProto } from './protos/user'
import { questionProto } from './protos/question'

const server = new Server();
server.addService(userProto.user.UserService.service, { GetUser: getUser });
server.addService(questionProto.question.QuestionService.service, { GetQuestion: getQuestion });
server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC Server running on 50051");
});
