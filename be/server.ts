import { Server, ServerCredentials } from "@grpc/grpc-js";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const packageDef = loadSync(path.join(__dirname, "../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = loadPackageDefinition(packageDef) as any;

function getUser(call: any, callback: any) {
  callback(null, { id: call.request.id, name: "Taro" });
}

const server = new Server();
server.addService(proto.user.UserService.service, { GetUser: getUser });
server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC Server running on 50051");
});
