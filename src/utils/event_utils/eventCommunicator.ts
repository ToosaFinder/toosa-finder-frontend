import api from "../api";
import {
  ApiResponse,
  Coordinates,
  ErrorBody,
  EventCreationReq,
  GetEventsResponse,
  PopularTags,
  SingleEventDto,
} from "../interfaces";
import { ReverseGeocodingSuccess } from "../reverseGeocodingResponseInterface";
import parseLocation from "../parseLocation";

export async function getPopularTags(): Promise<string | string[]> {
  return api()
    .getPopularTags()
    .then((resp) => {
      const { response, code } = resp;
      if (code === 200) {
        const { tags } = response as PopularTags;
        return tags as string[];
      } else {
        const { error } = response as ErrorBody;
        return error as string;
      }
    });
}

export async function createEvent(
  data: EventCreationReq
): Promise<boolean | string> {
  return api()
    .createEvent(data)
    .then((resp) => {
      const { code, response } = resp;
      if (code === 200) {
        return true;
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}

export async function whoAmI(): Promise<string> {
  return api()
    .whoAmI()
    .then((resp) => {
      const { code, response } = resp;
      if (code === 200) {
        const { login } = response;
        return login;
      } else {
        console.log(
          "В спецификации wiki не предусмотрено наличие ошибок у метода get /user/me бекенда"
        );
      }
    });
}

export async function getLocationName(
  cords: Coordinates
): Promise<string | ErrorBody> {
  return api()
    .getLocationName(cords)
    .then((res) => {
      const { response, code } = res;
      if (code === 200) {
        const location = response as ReverseGeocodingSuccess;
        return parseLocation(location);
      } else {
        return response as ErrorBody;
      }
    });
}

export async function getEventsForAdmin(): Promise<string | SingleEventDto[]> {
  return api()
    .getEventsForAdmin()
    .then((res: ApiResponse<GetEventsResponse>) => {
      const { response, code } = res;
      if (code === 200) {
        return response as SingleEventDto[];
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}

export async function getParticipatedEvents(): Promise<
  string | SingleEventDto[]
> {
  return api()
    .getParticipatedEvents()
    .then((res: ApiResponse<GetEventsResponse>) => {
      const { response, code } = res;
      if (code === 200) {
        return response as SingleEventDto[];
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}
