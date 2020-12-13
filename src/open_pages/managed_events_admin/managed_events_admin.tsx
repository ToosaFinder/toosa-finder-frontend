import React, { useEffect, useState } from "react";
import styles from "../../css/managed_events_admin.module.css";
import { Alert, Button, Container, Row, Table } from "react-bootstrap";
import { getEventsForAdmin } from "../../utils/event_utils/eventCommunicator";
import { SingleEventDto } from "../../utils/interfaces";
import EventFilter from "../../utils/event_utils/event_filter";
import { sortEventsByDate } from "../../utils/event_utils/event_sorter_by_date";
import { extractTags } from "../../utils/tag_utils/extract_tags";
import AppNavbar from "../../standart/navbar";

export default function ManagedEventsForAdmin(): JSX.Element {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [allEvents, setAllEvents] = useState<SingleEventDto[]>([]);
  const [curEvents, setCurEvents] = useState<SingleEventDto[]>([]);
  const [allTags, setTags] = useState<string[]>([]);
  const [isAlertVisible, setAlertVisibility] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("danger");

  const enableAlert = (message: string, alertVariant: string): void => {
    setAlertMsg(message);
    setAlertVariant(alertVariant);
    setAlertVisibility(true);
  };

  useEffect(() => {
    if (isLoaded) {
      getEventsForAdmin().then((res: string | SingleEventDto[]) => {
        if (typeof res === "string") {
          enableAlert(
            ("Unable to load your administrated events: " + res) as string,
            "danger"
          );
        } else {
          let events: SingleEventDto[] = res as SingleEventDto[];
          if (events === undefined) {
            enableAlert("Unable to load your administrated events", "danger");
          } else if (events.length === 0) {
            enableAlert("You don't administrate any events", "warning");
          } else {
            events = sortEventsByDate(events);
            setAllEvents(events.slice());
            setCurEvents(events.slice());
            setTags(extractTags(events));
          }
        }
      });
      setLoading(false);
    }
  }, [isLoaded]);

  return (
    <>
      <AppNavbar />
      <Container className={styles.mainContainer}>
        <Alert
          variant={alertVariant}
          show={isAlertVisible}
          onClose={() => {
            setAlertVisibility(false);
            setAlertMsg("");
          }}
          dismissible
        >
          <p>{alertMsg}</p>
        </Alert>

        <h1 className={styles.pageHeader}>Your administrated events</h1>
        <Row>
          <EventFilter
            allEvents={allEvents}
            eventsSetter={setCurEvents}
            alltags={allTags}
          />
        </Row>

        <Row>
          <Table
            bordered
            hover
            variant="dark"
            size="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>Event name</th>
                <th>Event date</th>
              </tr>
            </thead>
            <tbody>
              {curEvents.map((event, index, arr) => {
                return (
                  <tr key={index}>
                    <td>{event.name}</td>
                    <td>{event.startTime.toLocaleString()}</td>
                    <td style={{ width: `30px` }}>
                      <Button size="sm" className={styles.infoButton}>
                        i
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
}
