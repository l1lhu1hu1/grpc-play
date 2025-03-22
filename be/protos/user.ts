import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const userDef = loadSync(path.join(__dirname, "../../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

export const userProto = loadPackageDefinition(userDef) as any;
