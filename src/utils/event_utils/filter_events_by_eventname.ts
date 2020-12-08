import {Event} from "../interfaces";

export function filterEventsByEventname(events: Event[], eventname:string): Event[]{
  return events.filter(
    (event, index, array) => {
      return event.name.toLocaleLowerCase().includes(eventname.toLocaleLowerCase());
    }
  )
}