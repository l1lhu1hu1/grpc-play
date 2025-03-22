import { loadPackageDefinition } from "@grpc/grpc-js";
import { credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const packageDef = loadSync(path.join(process.cwd(), "../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = loadPackageDefinition(packageDef) as any;

const client = new proto.user.UserService(
  "localhost:50051",
  credentials.createInsecure()
);

export async function fetchUser() {
  return new Promise<{ id: string; name: string }>((resolve, reject) => {
    client.GetUser({ id: "123" }, (err: any, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
