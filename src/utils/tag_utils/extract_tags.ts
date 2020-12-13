import { SingleEventDto } from "../interfaces";

export function extractTags(events: SingleEventDto[]): string[] {
  let tags: string[] = [];
  events.forEach((event: SingleEventDto) => {
    event.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  return tags;
}
