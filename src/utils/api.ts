import axios from "axios";
import { getURL } from "./utils";

export interface ApiResponse<T> {
  code: number;
  response: T;
}

export interface ErrorBody {
  error: string;
}

export interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = LoginResponseBody | ErrorBody;

export interface ApiClient {
  login(credentials: Credentials): Promise<ApiResponse<LoginResponse>>;
  forgotPassword(email: string): Promise<ApiResponse<string>>;
  createNewPassword(
    password: string,
    token: string
  ): Promise<ApiResponse<string>>;
}

export interface Credentials {
  userId: string;
  password: string;
}

export interface ApiClient {
  login(credentials: Credentials): Promise<ApiResponse<LoginResponse>>;
}

class ApiClientImpl implements ApiClient {
  private static api: ApiClient;
  private accessToken: string;
  private refreshToken: string;

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

    return await axios.post<LoginResponse>(`http://${getURL()}/user/login`, creds)
      .then(result => {
        const { accessToken, refreshToken } = result.data as LoginResponseBody;
        if (result.status === 200) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          return {
            code: 200,
            response: result.data
          } as ApiResponse<LoginResponseBody>
        }
      })
      .catch(error => {
        const result = error.response;
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        return {
          code: error.status,
          response: {
            error: result.data,
          }
        } as ApiResponse<ErrorBody>;
      });
  }

  forgotPassword(email: string): Promise<ApiResponse<string>> {
    return Promise.resolve({
      code: 200,
      response: email,
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
