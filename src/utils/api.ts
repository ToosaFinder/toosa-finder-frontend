import axios, { AxiosError, AxiosResponse } from "axios";
import { getURL } from "./utils";
import {
  ApiResponse,
  Credentials,
  ErrorBody,
  ForgotPasswordResponse,
  LoginResponse,
  RestorePasswordCredentials,
  RegistrationCredentials,
  RegistrationResponse,
  SetPasswordCredentials,
  SetPasswordResponse, PopularTagsResponse,
  Coordinates, ReverseGeocodingResponse, EventCreationReq, EventCreationResponse, UserRes
} from "./interfaces";
import Cookies from "js-cookie";
import Axios from "axios";
import { ReverseGeocodingSuccess } from "./reverseGeocodingResponseInterface";

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
  getPopularTags(): Promise<ApiResponse<PopularTagsResponse>>;
  getLocationName(cords: Coordinates): Promise<ApiResponse<ReverseGeocodingSuccess | ErrorBody>>
  createEvent(data: EventCreationReq): Promise<ApiResponse<EventCreationResponse>>;
  whoAmI(): Promise<ApiResponse<UserRes>>;
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

  async getPopularTags(): Promise<ApiResponse<PopularTagsResponse>>{
    return await axios
        .get<PopularTagsResponse>(`http://${getURL()}/event/tag/popular`,
            {headers: {Authorization: `Bearer ${Cookies.get("token")}`}})
        .then(confirmationHandler)
        .catch(errorHandler);
  }

  async getLocationName(cords: Coordinates): Promise<ApiResponse<ReverseGeocodingResponse>>{
    return await axios
      .get<ReverseGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${cords.lat},${cords.lng}&key=${process.env.REACT_APP_GOOGLE_KEY}`)
      .then(confirmationHandler)
      .catch(
        (error: AxiosError) => {
          return {
            code: error.response.status,
            response:{
              error: error.message+": "+error.response.data.error_message
            }
          } as ApiResponse<ErrorBody>;
        }
      );
  }

  async createEvent(data: EventCreationReq): Promise<ApiResponse<EventCreationResponse>>{
    return await axios
      .post<EventCreationResponse>(`http://${getURL()}/event/`,
        data,
        {headers: {Authorization: `Bearer ${Cookies.get("token")}`}})
      .then(confirmationHandler)
      .catch(errorHandler);
  }

  async whoAmI(): Promise<ApiResponse<UserRes>>{
    return await axios
      .get<UserRes>(`http://${getURL()}/user/me`,
        {headers: {Authorization: `Bearer ${Cookies.get("token")}`}})
      .then(confirmationHandler);
  }
}



export default function api(): ApiClient {
  return ApiClientImpl.getInstance();
}
