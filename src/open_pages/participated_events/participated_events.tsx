import React, { useEffect, useState } from "react";
import styles from "../../css/managed_events_admin.module.css";
import { Alert, Button, Container, Row, Table } from "react-bootstrap";
import { getParticipatedEvents } from "../../utils/event_utils/eventCommunicator";
import { Event } from "../../utils/interfaces";
import EventFilter from "../../utils/event_utils/event_filter";
import { sortEventsByDate } from "../../utils/event_utils/event_sorter_by_date";
import { extractTags } from "../../utils/tag_utils/extract_tags";
import { useHistory } from "react-router-dom";

export default function ParticipatedEvents(): JSX.Element {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [curEvents, setCurEvents] = useState<Event[]>([]);
  const [allTags, setTags] = useState<string[]>([]);
  const [isAlertVisible, setAlertVisibility] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("danger");
  const history = useHistory();

  const enableAlert = (message: string, alertVariant: string): void => {
    setAlertMsg(message);
    setAlertVariant(alertVariant);
    setAlertVisibility(true);
  };

  useEffect(() => {
    if (isLoaded) {
      getParticipatedEvents().then((res) => {
        if (typeof res === "string") {
          enableAlert(
            ("Unable to load your participated events: " + res) as string,
            "danger"
          );
        } else {
          let events: Event[] = res as Event[];
          if (events === undefined) {
            enableAlert("Unable to load your participated events", "danger");
          } else if (events.length === 0) {
            enableAlert("You don't participate any events", "warning");
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

  const onBackButton = () => {
    history.goBack();
  };

  return (
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

      <h1 className={styles.pageHeader}>Your participated events</h1>
      <Container>
        <Button className={styles.backButton} onClick={onBackButton}>
          Back
        </Button>
      </Container>
      <Row>
        <EventFilter
          allEvents={allEvents}
          eventsSetter={setCurEvents}
          alltags={allTags}
        />
      </Row>

      <Row>
        <Table bordered hover variant="dark" size="sm" className={styles.table}>
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
  );
}
