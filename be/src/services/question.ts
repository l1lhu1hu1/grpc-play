import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IQuestionServiceServer } from "../generated/question_grpc_pb";
import { GetQuestionRequest, GetQuestionResponse } from "../generated/question_pb";

export const questionService: IQuestionServiceServer = {
  getQuestion(call: ServerUnaryCall<GetQuestionRequest, GetQuestionResponse>, callback: sendUnaryData<GetQuestionResponse>) {
    const response = new GetQuestionResponse();
    response.setId(call.request.getId());
    response.setTitle("l1lhu1hu1さんについての質問です。");
    response.setAuthor("Jiro");
    callback(null, response);
  },
};
