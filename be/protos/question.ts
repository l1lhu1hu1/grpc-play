import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const questionDef = loadSync(path.join(__dirname, "../../proto/question.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

export const questionProto = loadPackageDefinition(questionDef) as any;
