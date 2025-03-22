import { credentials } from "@grpc/grpc-js";
import { UserServiceClient } from "../generated/user_grpc_pb";
import { GetUserRequest, GetUserResponse } from "../generated/user_pb";

export async function fetchUser(): Promise<GetUserResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetUserRequest();
    request.setId("123");

    const client = new UserServiceClient("localhost:50051", credentials.createInsecure());
    client.getUser(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response.toObject());
      }
    });
  });
}
