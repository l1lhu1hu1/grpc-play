import { credentials } from "@grpc/grpc-js";
import { QuestionServiceClient } from "../generated/question_grpc_pb";
import { CreateQuestionRequest, CreateQuestionResponse, GetQuestionRequest, GetQuestionResponse, GetQuestionsRequest, GetQuestionsResponse } from "../generated/question_pb";

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

export async function fetchQuestions(limit: number = 10): Promise<GetQuestionResponse.AsObject[]> {
  return new Promise((resolve, reject) => {
    const request = new GetQuestionsRequest();
    request.setLimit(limit);

    const client = new QuestionServiceClient("localhost:50051", credentials.createInsecure());
    client.getQuestions(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.getQuestionsList().map(question => question.toObject()));
      }
    });
  });
}

export async function createQuestion(title: string, author: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = new CreateQuestionRequest();
    request.setTitle(title);
    request.setAuthor(author);

    const client = new QuestionServiceClient("localhost:50051", credentials.createInsecure());
    client.createQuestion(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.getSuccess());
      }
    });
  });
}
