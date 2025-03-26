import { credentials } from "@grpc/grpc-js";
import { QuestionServiceClient, CreateQuestionRequest, GetQuestionRequest, GetQuestionResponse, GetQuestionsRequest } from "../generated/question";

const client = new QuestionServiceClient("localhost:50051", credentials.createInsecure());

export async function fetchQuestion(): Promise<GetQuestionResponse> {
  return new Promise((resolve, reject) => {
    const request: GetQuestionRequest = {
      id: 'q-1'
    }

    client.getQuestion(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

export async function fetchQuestions(limit: number = 10): Promise<Array<GetQuestionResponse>> {
  return new Promise((resolve, reject) => {
    const request: GetQuestionsRequest = { limit };
    client.getQuestions(request, (err, response) => {
      if (err || !response) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.questions);
      }
    });
  });
}

export async function createQuestion(title: string, author: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request: CreateQuestionRequest = {
      title,
      author
    }

    client.createQuestion(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.success);
      }
    });
  });
}
