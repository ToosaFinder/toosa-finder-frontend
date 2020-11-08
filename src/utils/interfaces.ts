export interface ApiResponse<T> {
  code: number;
  response: T;
}

export interface ErrorBody {
  error: string;
}

export interface LoginResponseBody {
  accessToken: string;
}

export type LoginResponse = LoginResponseBody | ErrorBody;
export type ConfirmEmailResponse = string | ErrorBody;

export interface Credentials {
  userId: string;
  password: string;
}
