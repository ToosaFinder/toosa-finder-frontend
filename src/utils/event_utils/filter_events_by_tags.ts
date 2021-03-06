import { SingleEventDto } from "../interfaces";

export function filterEventsByTag(
  events: SingleEventDto[],
  pickedTags: string[]
): SingleEventDto[] {
  return events.filter((event, index, arr) => {
    //const res: boolean = event.tags.every((tag, index, array) => {return pickedTags.includes(tag)});
    const res: boolean = pickedTags.every((tag, index, array) => {
      return event.tags.includes(tag);
    });
    return res;
  });
}
