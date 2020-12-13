import axios, { AxiosError, AxiosResponse } from "axios";
import { getURL } from "./utils";
import {
  ApiResponse,
  ConfirmEmailResponse,
  Credentials,
  ErrorBody,
  EventResponse,
  ForgotPasswordResponse,
  LoginResponse,
  RegistrationCredentials,
  RegistrationResponse,
  RestorePasswordCredentials,
  SetPasswordCredentials,
  PopularTagsResponse,
  Coordinates,
  ReverseGeocodingResponse,
  EventCreationReq,
  EventCreationResponse,
  UserRes,
  SetPasswordResponse,
  SingleEventResponse,
  JoinEventResponse,
  LeaveEventResponse,
} from "./interfaces";
import Cookies from "js-cookie";
import { ReverseGeocodingSuccess } from "./reverseGeocodingResponseInterface";
import { isAuthUrl } from "./auth";

const instance = axios.create();

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      if (isAuthUrl(error.response.config.url)) {
        return Promise.reject(error);
      }
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

instance.interceptors.request.use((request) => {
  const jwt = Cookies.get("token");
  if (jwt !== undefined) {
    request.headers.authorization = `Bearer ${jwt}`;
  }
  return request;
});

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
  getPopularTags(): Promise<ApiResponse<PopularTagsResponse>>;
  getLocationName(
    cords: Coordinates
  ): Promise<ApiResponse<ReverseGeocodingSuccess | ErrorBody>>;
  createEvent(
    data: EventCreationReq
  ): Promise<ApiResponse<EventCreationResponse>>;
  whoAmI(): Promise<ApiResponse<UserRes>>;
  getEvents(): Promise<ApiResponse<EventResponse>>;
  getEvent(id: number): Promise<ApiResponse<SingleEventResponse>>;
  joinEvent(id: number): Promise<ApiResponse<JoinEventResponse>>;
  leaveEvent(id: number): Promise<ApiResponse<LeaveEventResponse>>;
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

    return await instance
      .post<LoginResponse>(`http://${getURL()}/user/login`, creds)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async registration(
    creds: RegistrationCredentials
  ): Promise<ApiResponse<RegistrationResponse>> {
    console.log("Registration called!");

    return await instance
      .post<string>(`http://${getURL()}/user/registration`, creds)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async forgotPassword(
    credentials: RestorePasswordCredentials
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    return await instance
      .post<string>(`http://${getURL()}/user/restore-password`, credentials)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async createNewPassword(
    credentials: SetPasswordCredentials
  ): Promise<ApiResponse<SetPasswordResponse>> {
    return await instance
      .post<string>(`http://${getURL()}/user/set-password`, credentials)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async confirmEmail(
    emailToken: string
  ): Promise<ApiResponse<ConfirmEmailResponse>> {
    console.log("confirmEmail called");

    return await instance
      .put<ConfirmEmailResponse>(
        `http://${getURL()}/user/email-confirmed/${emailToken}`
      )
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async getPopularTags(): Promise<ApiResponse<PopularTagsResponse>> {
    return await instance
      .get<PopularTagsResponse>(`http://${getURL()}/event/tag/popular`)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async getLocationName(
    cords: Coordinates
  ): Promise<ApiResponse<ReverseGeocodingResponse>> {
    return await axios
      .get<ReverseGeocodingResponse>(
        // eslint-disable-next-line no-undef
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${cords.lat},${cords.lng}&key=${process.env.REACT_APP_GOOGLE_KEY}`
      )
      .then(confirmationHandler)
      .catch((error: AxiosError) => {
        return {
          code: error.response.status,
          response: {
            error: error.message + ": " + error.response.data.error_message,
          },
        } as ApiResponse<ErrorBody>;
      });
  }

  async createEvent(
    data: EventCreationReq
  ): Promise<ApiResponse<EventCreationResponse>> {
    return await instance
      .post<EventCreationResponse>(`http://${getURL()}/event/`, data)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async whoAmI(): Promise<ApiResponse<UserRes>> {
    return await instance
      .get<UserRes>(`http://${getURL()}/user/me`)
      .then(confirmationHandler);
  }

  async getEvents(): Promise<ApiResponse<EventResponse>> {
    return await instance
      .get<EventResponse>(`http://${getURL()}/event`)
      .then(confirmationHandler)
      .catch(errorHandler);
  }
  async getEvent(id: number): Promise<ApiResponse<SingleEventResponse>> {
    return await instance
      .get<SingleEventResponse>(`http://${getURL()}/event/${id}`)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async joinEvent(id: number): Promise<ApiResponse<JoinEventResponse>> {
    return await instance
      .put<JoinEventResponse>(`http://${getURL()}/event/${id}/participant`)
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async leaveEvent(id: number): Promise<ApiResponse<LeaveEventResponse>> {
    return await instance
      .delete<LeaveEventResponse>(`http://${getURL()}/event/${id}/participant`)
      .then(confirmationHandler)
      .catch(errorHandler);
  }
}

export default function api(): ApiClient {
  return ApiClientImpl.getInstance();
}
