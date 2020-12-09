import { Event } from "../interfaces";

export function extractTags(events: Event[]): string[] {
  let tags: string[] = [];
  events.forEach((event: Event) => {
    event.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  return tags;
}
