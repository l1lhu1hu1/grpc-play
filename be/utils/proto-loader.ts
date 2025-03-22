import path from "path";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync, Options } from "@grpc/proto-loader";

const defaultOptions: Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

export function loadProto(fileName: string, options: Options = {}) {
  const filePath = path.join(__dirname, "../../proto", fileName);
  const definition = loadSync(filePath, { ...defaultOptions, ...options });
  return loadPackageDefinition(definition);
}
