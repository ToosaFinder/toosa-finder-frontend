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
    return Promise.resolve({
      code: 200,
      response: {
        accessToken: this.JWT,
        refreshToken: this.REFRESH_TOKEN,
      },
    });
  }
}

export default function api(): ApiClient {
  return DummyApiClient.getInstance();
}
