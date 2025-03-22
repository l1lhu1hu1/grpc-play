import { credentials } from "@grpc/grpc-js";
import { QuestionServiceClient } from "../generated/question_grpc_pb";
import { GetQuestionRequest, GetQuestionResponse } from "../generated/question_pb";

export async function fetchQuestion(): Promise<GetQuestionResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetQuestionRequest();
    request.setId("q-1");

    const client = new QuestionServiceClient("localhost:50051", credentials.createInsecure());
    client.getQuestion(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.toObject());
      }
    });
  });
}
