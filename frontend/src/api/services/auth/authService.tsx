import { LoginRequest } from "../../interfaces/loginRequest";
import { UserData } from "../../interfaces/userData";
import ApiService from "../apiService";

export const login = async (request: LoginRequest) => {
  const token = await ApiService.createData<LoginRequest>(
    "/auth/login",
    { email: request.email, password: request.password }
  );

  return token;
}


export const getUserData = async () => {
  const userData = await ApiService.fetchData<UserData>(
    "/user/userData"
  );

  return userData;
}