import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { QuestionServiceServer, CreateQuestionRequest, CreateQuestionResponse, GetQuestionRequest, GetQuestionResponse, GetQuestionsRequest, GetQuestionsResponse } from "../generated/question";

const questionHistories: Array<GetQuestionResponse> = [
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

export const questionService: QuestionServiceServer = {
  getQuestion(call: ServerUnaryCall<GetQuestionRequest, GetQuestionResponse>, callback: sendUnaryData<GetQuestionResponse>) {
    const question: GetQuestionResponse = {
      id: call.request.id,
      title: "l1lhu1hu1さんについての質問です。",
      author: "Jiro",
    };
    callback(null, question);
  },

  getQuestions(call: ServerUnaryCall<GetQuestionsRequest, GetQuestionsResponse>, callback: sendUnaryData<GetQuestionsResponse>) {
    const result = questionHistories.slice(-call.request.limit);
    callback(null, { questions: result });
  },

  createQuestion(call: ServerUnaryCall<CreateQuestionRequest, CreateQuestionResponse>, callback: sendUnaryData<CreateQuestionResponse>) {
    const { title, author } = call.request;
    questionHistories.push({ id: `q-${questionHistories.length + 1}`, title, author });
    callback(null, { success: true });
  }
};
