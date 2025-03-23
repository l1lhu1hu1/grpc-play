import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IQuestionServiceServer } from "../generated/question_grpc_pb";
import { CreateQuestionRequest, CreateQuestionResponse, GetQuestionRequest, GetQuestionResponse, GetQuestionsRequest, GetQuestionsResponse } from "../generated/question_pb";

// Sample question data
const questionHistories = [
  {
    id: "q-1",
    title: "l1lhu1hu1さんについての質問です。",
    author: "Jiro"
  },
  {
    id: "q-2",
    title: "TypeScriptの型システムについて",
    author: "Taro"
  },
  {
    id: "q-3",
    title: "gRPCとRESTの違いは何ですか？",
    author: "Hanako"
  },
  {
    id: "q-4",
    title: "Next.jsのApp Routerの使い方",
    author: "Yuki"
  },
  {
    id: "q-5",
    title: "マイクロサービスアーキテクチャの利点",
    author: "Kenji"
  },
];

export const questionService: IQuestionServiceServer = {
  getQuestion(call: ServerUnaryCall<GetQuestionRequest, GetQuestionResponse>, callback: sendUnaryData<GetQuestionResponse>) {
    const response = new GetQuestionResponse();
    response.setId(call.request.getId());
    response.setTitle("l1lhu1hu1さんについての質問です。");
    response.setAuthor("Jiro");
    callback(null, response);
  },
  getQuestions(call: ServerUnaryCall<GetQuestionsRequest, GetQuestionsResponse>, callback: sendUnaryData<GetQuestionsResponse>) {
    const response = new GetQuestionsResponse();
    const limit = call.request.getLimit() || 10;

    const questionsToReturn = questionHistories.slice(0, limit);

    questionsToReturn.forEach(q => {
      const question = new GetQuestionResponse();
      question.setId(q.id);
      question.setTitle(q.title);
      question.setAuthor(q.author);
      response.addQuestions(question);
    });

    callback(null, response);
  },
  createQuestion(call: ServerUnaryCall<CreateQuestionRequest, CreateQuestionResponse>, callback: sendUnaryData<CreateQuestionResponse>) {
    try {
      const title = call.request.getTitle();
      const author = call.request.getAuthor();

      // Create a new question ID
      const newId = `q-${questionHistories.length + 1}`;

      // Add to questionHistories
      questionHistories.push({
        id: newId,
        title,
        author
      });

      const response = new CreateQuestionResponse();
      response.setSuccess(true);

      callback(null, response);
    } catch (error) {
      console.error("Error creating question:", error);
      const response = new CreateQuestionResponse();
      response.setSuccess(false);
      callback(null, response);
    }
  }
};
