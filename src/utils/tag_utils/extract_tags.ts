import { Event } from "../interfaces";

export  function extractTags (events: Event[]): string[] {
  let tags: string[] = [];
  events.map(
    (event) => {
      event.tags.map(
        tag =>{
          if (!tags.includes(tag)){
            tags.push(tag);
          }
        }
      )
    }
  )
  return tags;
}