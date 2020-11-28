export interface MapProps {
  center: Coordinates;
  zoom: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface EventDto {
  events: SingleEvent[];
}

export interface SingleEvent {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  creator: string;
  description: string;
  address: string;
  isClosed: boolean;
  isPublic: boolean;
  participants: string[];
  participantsLimit: number;
  startTime: string;
  tags: string[];
}

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

export interface RestorePasswordCredentials {
  email: string;
}

export interface Credentials {
  userId: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  login: string;
  password: string;
}

export interface SetPasswordCredentials {
  emailToken: string;
  password: string;
}

export type EventResponse = EventDto | ErrorBody;
export type Event = EventDto | string;
export type LoginResponse = LoginResponseBody | ErrorBody;
export type ConfirmEmailResponse = string | ErrorBody;
export type RegistrationResponse = string | ErrorBody;
export type SetPasswordResponse = string | ErrorBody;
export type ForgotPasswordResponse = string | ErrorBody;
