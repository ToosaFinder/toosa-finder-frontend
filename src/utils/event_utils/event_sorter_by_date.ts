import { SingleEventDto } from "../interfaces";

export function sortEventsByDate(events: SingleEventDto[]): SingleEventDto[] {
  return events.sort((a, b) => {
    if (a.startTime > b.startTime) return 1;
    if (a.startTime < b.startTime) return -1;
    return 0;
  });
}
