import { SingleEventDto } from "../interfaces";

export function filterEventsByEventname(
  events: SingleEventDto[],
  eventname: string
): SingleEventDto[] {
  return events.filter((event, index, array) => {
    return event.name
      .toLocaleLowerCase()
      .includes(eventname.toLocaleLowerCase());
  });
}
