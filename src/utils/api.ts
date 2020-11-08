import axios, { AxiosError, AxiosResponse } from "axios";
import { getURL } from "./utils";
import {
  ApiResponse,
  Credentials,
  ErrorBody,
  LoginResponse,
  PasswordRestore,
  RegistrationCredentials,
  RegistrationResponse,
} from "./interfaces";

export interface ApiClient {
  login(credentials: Credentials): Promise<ApiResponse<LoginResponse>>;
  registration(
    credentials: RegistrationCredentials
  ): Promise<ApiResponse<RegistrationResponse>>;
  forgotPassword(email: PasswordRestore): Promise<ApiResponse<string>>;
  createNewPassword(
    password: string,
    token: string
  ): Promise<ApiResponse<string>>;
}

function confirmationHandler<T>(result: AxiosResponse<T>): ApiResponse<T> {
  const message = result.data as T;
  return {
    code: result.status,
    response: message,
  } as ApiResponse<T>;
}

function errorHandler(error: AxiosError): ApiResponse<ErrorBody> {
  const result = error.response;
  if (error.response !== undefined) {
    return {
      code: parseInt(error.code),
      response: {
        error:
          result.data.message === null ? result.data.code : result.data.message,
      },
    } as ApiResponse<ErrorBody>;
  } else {
    return {
      code: parseInt(error.code),
      response: {
        error: error.message,
      },
    };
  }
}

export interface ApiClient {
  login(credentials: Credentials): Promise<ApiResponse<LoginResponse>>;
}

class ApiClientImpl implements ApiClient {
  private static api: ApiClient;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): ApiClient {
    if (ApiClientImpl.api == null) {
      ApiClientImpl.api = new ApiClientImpl();
    }
    return ApiClientImpl.api;
  }

  async login(creds: Credentials): Promise<ApiResponse<LoginResponse>> {
    console.log("Login called!");

    return await axios
      .post<LoginResponse>(`http://${getURL()}/user/login`, creds)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async registration(
    creds: RegistrationCredentials
  ): Promise<ApiResponse<RegistrationResponse>> {
    console.log("Registration called!");

    return await axios
      .post<string>(`http://${getURL()}/user/registration`, creds)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async forgotPassword(email: PasswordRestore): Promise<ApiResponse<string>> {
    console.log("Recovering password called!");
    console.log("FORGOT PASSWORD url: ", getURL());
    return await axios
      .post<string>(`http://${getURL()}/user/restore-password`, email)
      .then((result) => {
        if (result.status === 200) {
          return {
            code: 200,
            response: "success",
          } as ApiResponse<string>;
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(
            "FORGOTPASSWORD TESTING error.response.data: " + error.response.data
          );
          console.log(
            "FORGOTPASSWORD TESTING error.response.status: " +
              error.response.status
          );
          console.log(
            "FORGOTPASSWORD TESTING error.response.headers: " +
              error.response.headers
          );
        } else if (error.request) {
          console.log("FORGOTPASSWORD TESTING error.request: " + error.request);
        } else {
          console.log("FORGOTPASSWORD TESTING error.request: " + error.message);
        }
        return {
          code: error.status,
          response: error.name,
        } as ApiResponse<string>;
      });
  }

  createNewPassword(
    password: string,
    token: string
  ): Promise<ApiResponse<string>> {
    if (token === "228") {
      return Promise.resolve({
        code: 404,
        response: "error!",
      });
    }
    return Promise.resolve({
      code: 200,
      response: password + " " + token,
    });
  }
}

export default function api(): ApiClient {
  return ApiClientImpl.getInstance();
}
