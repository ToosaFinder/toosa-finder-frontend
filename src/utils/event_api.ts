import api from "./api";
import {
  ErrorBody,
  EventDto,
  Event,
  SingleEvent,
  SingleEventDto,
} from "./interfaces";

export async function getEvents(): Promise<Event> {
  return api()
    .getEvents()
    .then((result) => {
      if (result.code === 200) {
        return result.response as EventDto;
      } else {
        return (result.response as ErrorBody).error as string;
      }
    });
}

export async function getEvent(id: number): Promise<SingleEvent> {
  return api()
    .getEvent(id)
    .then((result) => {
      if (result.code === 200) {
        return result.response as SingleEventDto;
      } else {
        return (result.response as ErrorBody).error as string;
      }
    });
}

export async function joinEvent(id: number): Promise<true | string> {
  return api()
    .joinEvent(id)
    .then((result) => {
      if (result.code === 200) {
        return true;
      } else {
        return (result.response as ErrorBody).error as string;
      }
    });
}

export async function leaveEvent(id: number): Promise<true | string> {
  return api()
    .leaveEvent(id)
    .then((result) => {
      if (result.code === 200) {
        return true;
      } else {
        return (result.response as ErrorBody).error as string;
      }
    });
}
