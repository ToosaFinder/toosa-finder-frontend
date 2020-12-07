import api from "./api";
import {
  Coordinates,
  ErrorBody,
  EventCreationReq,
  PopularTags,
} from "./interfaces";
import { ReverseGeocodingSuccess } from "./reverseGeocodingResponseInterface";
import parseLocation from "./parseLocation";

export async function getPopularTags(): Promise<string | string[]> {
  return api()
    .getPopularTags()
    .then((resp) => {
      const { response, code } = resp;
      if (code === 200) {
        let { tags } = response as PopularTags;
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