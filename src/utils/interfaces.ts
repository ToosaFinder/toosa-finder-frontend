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
export type RegistrationResponse = string | ErrorBody;

export interface Credentials {
  userId: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  login: string;
  password: string;
}
