import React, { useEffect, useState } from "react";
import styles from "../../css/managed_events_admin.module.css";
import { Button, Col, Container, Form, ListGroup, Row, Table } from "react-bootstrap";
import { getEventsForAdmin } from "../../utils/event_utils/eventCommunicator";
import {Event} from "../../utils/interfaces"
import EventFilter from "../../utils/event_utils/event_filter";
import { sortEventsByDate } from "../../utils/event_utils/event_sorter_by_date";
import { extractTags } from "../../utils/tag_utils/extract_tags";

export default function ManagedEventsForAdminTest(): JSX.Element {


  let createEvent = (
    id: number,
    namee: string,
    description: string,
    creator: string,
    address: string,
    latitude: number,
    longitude: number,
    participantsLimit: number,
    startTime: Date,
    isPublic: boolean,
    tags: string[],
    participants: string[],
  ): Event => {
    return {
      id: id,
      name: namee,
      description: description,
      creator: creator,
      address: address,
      latitude: latitude,
      longitude: longitude,
      participantsLimit: participantsLimit,
      startTime: startTime,
      isPublic: isPublic,
      tags: tags,
      participants: participants
    };
  }

  const event1: Event = createEvent(
    0,
    "krendel party",
    "happy funeral",
    "xz",
    "nsu dormitory 3",
    54.3,
    54.4,
    50,
    new Date('November 13, 2021 03:25:00'),
    true,
    ["much fun", "gachi"],
    ["hz, max, nek"]
  );

  const event2: Event = createEvent(
    1,
    "gachi fest",
    "homosexuals are welcome",
    "gregory",
    "nsu dormitory 5",
    54.5,
    54.6,
    30,
    new Date('December 14, 2021 03:25:00'),
    false,
    ["boyNextDoor", "yesSir"],
    ["grisha", "dima", "tigran", "nidzhat", "lilya"]
  );

  const event3: Event = createEvent(
    3,
    "FIT&FIJA nas DOHUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "homosexuals are welcome",
    "gregory",
    "nsu dormitory 5",
    54.5,
    54.6,
    30,
    new Date('May 17, 2021 13:25:00'),
    false,
    ["boyNextDoor", "yesSir"],
    ["grisha", "dima", "tigran", "nidzhat", "lilya"]
  );

  const event4: Event = createEvent(
    3,
    "obskoe",
    "lofi chillify event",
    "gregory",
    "nsu dormitory 5",
    54.5,
    54.6,
    30,
    new Date('May 5, 2021 17:00:00'),
    false,
    ["pivo", "koster"],
    ["grisha", "dima", "tigran", "nidzhat", "lilya"]
  );

  const [isLoaded, setLoading] = useState<boolean>(true);
  let events: Event[] = [event1, event2, event3, event4];
  events = sortEventsByDate(events);
  const [curEvents, setEvents] = useState<Event[]>(events);
  const [allTags, setTags] = useState<string[]>(extractTags(events));

  useEffect(
    () => {
      if (isLoaded){
        getEventsForAdmin().then(
          (res) => {
            if (typeof res === "string"){
              console.log("res as string: ", res as string);
            } else {
              /*
              events = res as Event[];
              events = sortEventsByDate(events);
              setEvents(events.slice());
              */
              console.log("res as Event[]: ", res as Event[]);
            }
          }
        );
        setLoading(false);
      }
    }
  );

  return (
    <>
      {
        /*
      <Container style={{borderStyle: `solid`, borderColor: `black`}}>
        <Button style={{marginLeft: `20px`, marginTop: `20px`}}>back</Button>
      </Container>
      */
      }
      <Container className={styles.mainContainer}>
        <h1 className={styles.pageHeader}>Your administrated events</h1>
        <Container>
          <Button style={{marginLeft: `70px`, marginTop: `20px`}}>back</Button>
        </Container>
        <Row>
          <EventFilter
            allEvents={events}
            eventsSetter={setEvents}
            alltags={allTags}
          />
        </Row>

        <Row>
          <Table bordered hover variant="dark" size="sm" style={{width: `750px`}}>
            <thead>
            <tr>
              <th>Event name</th>
              <th>Event date</th>
            </tr>
            </thead>
            <tbody>
            {
              curEvents.map(
                (event, index, arr) => {
                  return<>
                    <tr key={index}>
                      <td>{event.name}</td>
                      <td>{event.startTime.toLocaleString()}</td>
                      <td style={{width: `30px`}}>
                        <Button size="sm" className={styles.infoButton}>i</Button>
                      </td>
                    </tr>
                  </>
                }
              )
            }
            </tbody>
          </Table>
        </Row>

      </Container>
    </>
  );
}
