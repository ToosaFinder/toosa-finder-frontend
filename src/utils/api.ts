import axios, { AxiosError, AxiosResponse } from "axios";
import { getURL } from "./utils";
import {
  ApiResponse,
  ConfirmEmailResponse,
  Credentials,
  ErrorBody,
  ForgotPasswordResponse,
  LoginResponse,
  RegistrationCredentials,
  RegistrationResponse,
  RestorePasswordCredentials,
  SetPasswordCredentials,
  SetPasswordResponse,
} from "./interfaces";

export interface ApiClient {
  login(credentials: Credentials): Promise<ApiResponse<LoginResponse>>;
  registration(
    credentials: RegistrationCredentials
  ): Promise<ApiResponse<RegistrationResponse>>;
  forgotPassword(
    email: RestorePasswordCredentials
  ): Promise<ApiResponse<ForgotPasswordResponse>>;
  createNewPassword(
    credentials: SetPasswordCredentials
  ): Promise<ApiResponse<SetPasswordResponse>>;
  confirmEmail(emailToken: string): Promise<ApiResponse<ConfirmEmailResponse>>;
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

  async forgotPassword(
    credentials: RestorePasswordCredentials
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    return await axios
      .post<string>(`http://${getURL()}/user/restore-password`, credentials)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async createNewPassword(
    credentials: SetPasswordCredentials
  ): Promise<ApiResponse<SetPasswordResponse>> {
    return await axios
      .post<string>(`http://${getURL()}/user/set-password`, credentials)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async confirmEmail(
    emailToken: string
  ): Promise<ApiResponse<ConfirmEmailResponse>> {
    console.log("confirmEmail called");

    return await axios
      .put<ConfirmEmailResponse>(
        `http://${getURL()}/user/email-confirmed/${emailToken}`
      )
      .then(confirmationHandler)
      .catch(errorHandler);
  }
}

export default function api(): ApiClient {
  return ApiClientImpl.getInstance();
}
