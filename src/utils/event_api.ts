import api from "./api";
import { ErrorBody, EventDto, Event } from "./interfaces";

export async function getEvents(): Promise<Event> {
  return api().getEvents().then(result => {
    if (result.code === 200) {
      return result.response as EventDto;
    } else {
      return (result.response as ErrorBody).error as string;
    }
  })
}
