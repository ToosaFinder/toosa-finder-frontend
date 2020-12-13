import React, { useEffect, useState } from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../utils/private_route";
import { Button, Card, Container, Row } from "react-bootstrap";
import styles from "../css/home.module.css";
import { Coordinates, EventDto, SingleEventDto } from "../utils/interfaces";
import Marker from "../utils/marker";
import { getEvent, getEvents, joinEvent, leaveEvent } from "../utils/event_api";
import Map from "./event_creation/map";
import { whoAmI } from "../utils/event_utils/eventCommunicator";
import Alert from "react-bootstrap/Alert";
import AppNavbar from "../standart/navbar";

interface AlertMessage {
  variant: string;
  message: string;
}

export default function Home(): JSX.Element {
  const { url } = useRouteMatch();

  // academcity
  const defaultPosition = {
    lat: 54.852,
    lng: 83.106,
  };

  const [myLocation, setMyLocation] = useState<Coordinates>({
    lat: 54.852,
    lng: 83.106,
  });

  const [center, setCenter] = useState<Coordinates>(defaultPosition);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEvent, isShowEvent] = useState<boolean>(false);
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
  const [activeEvents, setActiveEvents] = useState<EventDto>({ events: [] });
  const [user, setUser] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");

  const getActiveEvents = () => {
    getEvents().then((result) => {
      if (typeof result !== "string") {
        console.log(result);
        setActiveEvents(result as EventDto);
      }
    });
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      navigator.geolocation.getCurrentPosition((success) => {
        const { latitude, longitude } = success.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        setCenter({ lat: latitude, lng: longitude });
      });
      getActiveEvents();
    }
  }, [loading]);

  const onEventMarkerClick = (event): void => {
    const id = event.currentTarget.id;
    const cachedEvent = activeEvents.events.find(
      (event) => event.id.toString() === id
    );
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

  useEffect(() => {
    whoAmI().then((result) => {
      setUser(result.login);
    });
  }, []);

  const enableAlert = (alert: AlertMessage): void => {
    if (alert !== undefined && alert.message !== undefined) {
      setAlertMsg(alert.message);
      setShowAlert(true);
      setAlertVariant(alert.variant);
    }
  };

  const isParticipant = () => {
    return selectedEvent.participants.includes(user);
  };

  const leaveEventClick = () => {
    leaveEvent(selectedEvent.id).then((success) => {
      if (success === true) {
        isShowEvent(false);
        const successAlert = {
          variant: "warning",
          message: "Вы покинули мероприятие " + selectedEvent.name,
        };
        enableAlert(successAlert);
      } else {
        const failAlert = {
          variant: "danger",
          message: success as string,
        };
        enableAlert(failAlert);
      }
      getActiveEvents();
    });
  };

  const joinEventClick = () => {
    joinEvent(selectedEvent.id).then((success) => {
      if (success === true) {
        isShowEvent(false);
        const successAlert = {
          variant: "success",
          message: "Вы присоединились к мероприятию " + selectedEvent.name,
        };
        enableAlert(successAlert);
      } else {
        const failAlert = {
          variant: "danger",
          message: success as string,
        };
        enableAlert(failAlert);
      }
      getActiveEvents();
    });
  };

  return (
    <>
      <AppNavbar />
      <Alert
        variant={alertVariant}
        show={showAlert}
        onClose={(): void => setShowAlert(false)}
        dismissible
      >
        <div className="p-1">{alertMsg}</div>
      </Alert>
      <Container className={styles.container}>
        <Switch>
          <PrivateRoute path={`${url}`} exact>
            <Row className={styles.formRow}>
              <h1 className="title, text-lg-center">
                Welcome to Toosa Finder!
              </h1>
            </Row>
            <span className={`${styles.mainContainer} mt-2`}>
              <Map
                show
                defaultLocation={defaultPosition}
                className={`${styles.map} mr-2`}
                centerState={[center, setCenter]}
              >
                <Marker lat={myLocation.lat} lng={myLocation.lng}>
                  Я
                </Marker>
                {activeEvents.events.map((event) => {
                  return (
                    <Marker
                      id={event.id}
                      key={event.id}
                      lat={event.latitude}
                      lng={event.longitude}
                      hoverable
                      onClick={onEventMarkerClick}
                    >
                      i
                    </Marker>
                  );
                })}
              </Map>
              <Card className={`${styles.card} ${showEvent ? "" : "d-none"}`}>
                <Card.Body>
                  <Card.Title>{`${selectedEvent.name} by ${selectedEvent.creator}`}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {`${
                      selectedEvent.tags.length > 0
                        ? `Tags: ${selectedEvent.tags.join(", ")}`
                        : ""
                    }`}
                  </Card.Subtitle>
                  <Card.Text>
                    <p>{`Max guests: ${selectedEvent.participantsLimit}`}</p>
                    <p>{selectedEvent.description}</p>
                    <p>{selectedEvent.address}</p>
                    <p>{new Date(selectedEvent.startTime).toDateString()}</p>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    onClick={(): void => isShowEvent(false)}
                    className="mr-2"
                  >
                    Close
                  </Button>
                  {isParticipant() ? (
                    <Button onClick={leaveEventClick} variant="warning">
                      Leave
                    </Button>
                  ) : (
                    <Button onClick={joinEventClick} variant="success">
                      Join
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </span>
          </PrivateRoute>
        </Switch>
      </Container>
    </>
  );
}
