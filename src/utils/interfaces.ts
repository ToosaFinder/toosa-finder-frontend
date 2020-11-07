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

export interface Credentials {
  userId: string;
  password: string;
}
