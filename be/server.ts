import { Server, ServerCredentials, sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  UserServiceService,
  IUserServiceServer,
} from "./generated/user_grpc_pb";
import {
  GetUserRequest,
  GetUserResponse,
} from "./generated/user_pb";
import {
  QuestionServiceService,
  IQuestionServiceServer,
} from "./generated/question_grpc_pb";
import {
  GetQuestionRequest,
  GetQuestionResponse,
} from "./generated/question_pb";

const userServiceImpl: IUserServiceServer = {
  getUser(call: ServerUnaryCall<GetUserRequest, GetUserResponse>, callback: sendUnaryData<GetUserResponse>) {
    const response = new GetUserResponse();
    response.setId(call.request.getId());
    response.setName("Taro");
    response.setAge(40);
    callback(null, response);
  },
};

const questionServiceImpl: IQuestionServiceServer = {
  getQuestion(call: ServerUnaryCall<GetQuestionRequest, GetQuestionResponse>, callback: sendUnaryData<GetQuestionResponse>) {
    const response = new GetQuestionResponse();
    response.setId(call.request.getId());
    response.setTitle("l1lhu1hu1さんについての質問です。");
    response.setAuthor("Jiro");
    callback(null, response);
  },
};

const server = new Server();
server.addService(UserServiceService, userServiceImpl);
server.addService(QuestionServiceService, questionServiceImpl);
server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC Server running on 50051");
});
