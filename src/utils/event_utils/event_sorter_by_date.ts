import { Event } from "../interfaces";

export function sortEventsByDate(events: Event[]): Event[] {
  return events.sort((a, b) => {
    if (a.startTime > b.startTime) return 1;
    if (a.startTime < b.startTime) return -1;
    return 0;
  });
}
