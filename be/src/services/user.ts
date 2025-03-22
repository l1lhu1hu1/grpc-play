import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IUserServiceServer } from "../generated/user_grpc_pb";
import { GetUserRequest, GetUserResponse } from "../generated/user_pb";

export const userService: IUserServiceServer = {
  getUser(call: ServerUnaryCall<GetUserRequest, GetUserResponse>, callback: sendUnaryData<GetUserResponse>) {
    const response = new GetUserResponse();
    response.setId(call.request.getId());
    response.setName("Taro");
    response.setAge(40);
    callback(null, response);
  },
};
