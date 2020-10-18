export interface ApiResponse<T> {
  code: number;
  response: T;
}

export interface User {
  name: string;
}

export interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
}

export interface ApiClient {
  accessToken: string;
  refreshToken: string;
  login(credentials: Credentials): Promise<ApiResponse<LoginResponseBody>>;
  forgotPassword(email: string): Promise<ApiResponse<string>>;
  createNewPassword(
    password: string,
    token: string
  ): Promise<ApiResponse<string>>;
}

export interface Credentials {
  login: string;
  password: string;
}

class DummyApiClient implements ApiClient {
  private static api: ApiClient;
  accessToken: string;
  refreshToken: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): ApiClient {
    if (DummyApiClient.api == null) {
      DummyApiClient.api = new DummyApiClient();
    }
    return DummyApiClient.api;
  }

  JWT = "DUMMY_JWT";
  REFRESH_TOKEN = "DUMMY_REFRESH_TOKEN";

  login(_: Credentials): Promise<ApiResponse<LoginResponseBody>> {
    console.log("Login called!");
    if (_.login === "error") {
      return Promise.resolve({
        code: 404,
        response: {
          accessToken: "fail :(",
          refreshToken: "fail :(",
        },
      });
    }
    return Promise.resolve({
      code: 200,
      response: {
        accessToken: this.JWT,
        refreshToken: this.REFRESH_TOKEN,
      },
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
  return DummyApiClient.getInstance();
}
