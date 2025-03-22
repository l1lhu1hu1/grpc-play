import { Server, ServerCredentials } from "@grpc/grpc-js";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const userDef = loadSync(path.join(__dirname, "../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questionDef = loadSync(path.join(__dirname, "../proto/question.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = loadPackageDefinition(userDef) as any;
const questionProto = loadPackageDefinition(questionDef) as any;

function getUser(call: any, callback: any) {
  callback(null, { id: call.request.id, name: "Taro", age: 40 });
}

function getQuestion(call: any, callback: any) {
  callback(null, { id: call.request.id, title: "l1lhu1hu1さんについての質問です。", author: 'Jiro' });
}

const server = new Server();
server.addService(userProto.user.UserService.service, { GetUser: getUser });
server.addService(questionProto.question.QuestionService.service, { GetQuestion: getQuestion });
server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC Server running on 50051");
});
