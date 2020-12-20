import React, { useEffect, useState } from "react";
import styles from "../../css/managed_events_admin.module.css";
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  Table,
  Modal,
} from "react-bootstrap";
import { getParticipatedEvents } from "../../utils/event_utils/eventCommunicator";
import { SingleEventDto } from "../../utils/interfaces";
import EventFilter from "../../utils/event_utils/event_filter";
import { sortEventsByDate } from "../../utils/event_utils/event_sorter_by_date";
import { extractTags } from "../../utils/tag_utils/extract_tags";
import AppNavbar from "../../standart/navbar";
import EventInfo from "../event_info";
import { getEvent } from "../../utils/event_api";

interface AlertMessage {
  variant: string;
  message: string;
}

export default function ParticipatedEvents(): JSX.Element {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [allEvents, setAllEvents] = useState<SingleEventDto[]>([]);
  const [curEvents, setCurEvents] = useState<SingleEventDto[]>([]);
  const [showEvent, isShowEvent] = useState<boolean>(false);
  const [allTags, setTags] = useState<string[]>([]);
  const [isAlertVisible, setAlertVisibility] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("danger");
  const [selectedEvent, setSelectedEvent] = useState<SingleEventDto>({
    address: "",
    creator: "",
    description: "",
    id: 0,
    isClosed: false,
    isPublic: false,
    latitude: 0,
    longitude: 0,
    name: "",
    participants: [],
    participantsLimit: 0,
    startTime: "",
    tags: [],
  });

  const enableAlert = (alert: AlertMessage): void => {
    setAlertMsg(alert.message);
    setAlertVariant(alert.variant);
    setAlertVisibility(true);
  };

  const onEventMarkerClick = (event): void => {
    const id = event.currentTarget.id;
    const cachedEvent = allEvents.find((event) => event.id.toString() === id);
    if (cachedEvent) {
      setSelectedEvent(cachedEvent);
      isShowEvent(true);
    } else {
      getEvent(parseInt(id)).then((event) => {
        if (typeof event !== "string") {
          setSelectedEvent(event as SingleEventDto);
          isShowEvent(true);
        } else {
          isShowEvent(false);
        }
      });
    }
  };

  const getActiveEvents = () => {
    getParticipatedEvents().then((res: string | SingleEventDto[]) => {
      if (typeof res === "string") {
        enableAlert({
          message: `Unable to load your participated events: ${res}`,
          variant: "danger",
        });
      } else {
        let events: SingleEventDto[] = res as SingleEventDto[];
        if (events === undefined) {
          enableAlert({
            message: "Unable to load your participated events",
            variant: "danger",
          });
        } else if (events.length === 0) {
          enableAlert({
            message: "You don't participate any events",
            variant: "warning",
          });
          setCurEvents([]);
        } else {
          events = sortEventsByDate(events);
          setAllEvents(events.slice());
          setCurEvents(events.slice());
          setTags(extractTags(events));
        }
      }
    });
  };

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      getParticipatedEvents().then((res: string | SingleEventDto[]) => {
        if (typeof res === "string") {
          enableAlert({
            message: `Unable to load your participated events: ${res}`,
            variant: "danger",
          });
        } else {
          let events: SingleEventDto[] = res as SingleEventDto[];
          if (events === undefined) {
            enableAlert({
              message: "Unable to load your participated events",
              variant: "danger",
            });
          } else if (events.length === 0) {
            enableAlert({
              message: "You don't participate any events",
              variant: "warning",
            });
            setCurEvents([]);
          } else {
            events = sortEventsByDate(events);
            setAllEvents(events.slice());
            setCurEvents(events.slice());
            setTags(extractTags(events));
          }
        }
      });
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

        <h1 className={styles.pageHeader}>Your participated events</h1>
        <Row>
          <EventFilter
            allEvents={allEvents}
            eventsSetter={setCurEvents}
            alltags={allTags}
          />
        </Row>

        <Row>
          <Col>
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
                {curEvents.map(
                  (
                    event: SingleEventDto,
                    index: number,
                    arr: SingleEventDto[]
                  ) => {
                    return (
                      <tr key={index}>
                        <td>{event.name}</td>
                        <td>{event.startTime.toLocaleString()}</td>
                        <td style={{ width: `30px` }}>
                          <Button
                            id={event.id.toString()}
                            onClick={onEventMarkerClick}
                            size="sm"
                            className={styles.infoButton}
                          >
                            i
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Modal show={showEvent} onHide={isShowEvent}>
          <Modal.Body>
            <EventInfo
              selectedEvent={selectedEvent}
              enableAlert={enableAlert}
              showEventState={[showEvent, isShowEvent]}
              getActiveEvents={getActiveEvents}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
