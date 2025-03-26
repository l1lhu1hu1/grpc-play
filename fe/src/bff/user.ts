import { credentials } from "@grpc/grpc-js";
import { UserServiceClient, GetUserRequest, GetUserResponse } from "../generated/user";

const client = new UserServiceClient("localhost:50051", credentials.createInsecure());

export async function fetchUser(): Promise<GetUserResponse> {
  return new Promise((resolve, reject) => {
    const request: GetUserRequest = {
      id: '123'
    }

    client.getUser(request, (err, response) => {
      if (err) {
        console.error("gRPC error:", err);
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
