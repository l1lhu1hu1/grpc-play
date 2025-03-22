import { loadPackageDefinition } from "@grpc/grpc-js";
import { credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const userDef = loadSync(path.join(process.cwd(), "../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = loadPackageDefinition(userDef) as any;

const userClient = new userProto.user.UserService(
  "localhost:50051",
  credentials.createInsecure()
);

export async function fetchUser() {
  return new Promise<{ id: string; name: string, age: number }>((resolve, reject) => {
    userClient.GetUser({ id: "123" }, (err: any, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
