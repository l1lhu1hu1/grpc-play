import { loadPackageDefinition } from "@grpc/grpc-js";
import { credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const questionDef = loadSync(path.join(process.cwd(), "../proto/question.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});


const questionProto = loadPackageDefinition(questionDef) as any;

const questionClient = new questionProto.question.QuestionService(
  "localhost:50051",
  credentials.createInsecure()
);

export async function fetchQuestion() {
  return new Promise<{ id: string; title: string; author: string }>((resolve, reject) => {
    questionClient.GetQuestion({ id: "123" }, (err: any, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
