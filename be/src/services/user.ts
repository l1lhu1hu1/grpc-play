import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { UserServiceServer, GetUserRequest, GetUserResponse } from "../generated/user";

export const userService: UserServiceServer = {
  getUser(call: ServerUnaryCall<GetUserRequest, GetUserResponse>, callback: sendUnaryData<GetUserResponse>) {
    const response: GetUserResponse = {
      id: call.request.id,
      name: 'Taro',
      age: 40
    }
    callback(null, response);
  },
};
