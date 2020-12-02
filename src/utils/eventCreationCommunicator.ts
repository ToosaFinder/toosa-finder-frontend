import api from "./api";
import { ApiResponse, ErrorBody, EventCreationReq, PopularTagsResponse } from "./interfaces";

export async function getPopularTags(): Promise<ApiResponse<PopularTagsResponse>>{
  return api()
    .getPopularTags();
}

export async function createEvent(data: EventCreationReq): Promise<boolean | string>{
  return api()
    .createEvent(data)
    .then((resp) => {
        const {code, response} = resp;
        if(code===200){
          return true;
        } else {
          const {error} = response as ErrorBody;
          return error;
        }
      });
}

export async function whoAmI():Promise<string>{
  return api()
    .whoAmI().then(
      (resp) => {
        const {code, response} = resp;
        if (code===200){
          const {login, email} = response;
          return login;
        } else{
          console.log("В спецификации wiki не предусмотрено наличие ошибок у метода get /user/me бекенда");
        }
      }
    )
}