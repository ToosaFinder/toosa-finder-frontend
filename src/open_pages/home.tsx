import React, { useEffect, useState } from "react";
import { Link, Switch, useHistory, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../utils/private_route";
import { Button, Card, Container, Row } from "react-bootstrap";
import styles from "../css/home.module.css";
import { logout } from "../utils/auth";
import { Coordinates, EventDto, SingleEventDto } from "../utils/interfaces";
import Marker from "../utils/marker";
import { deleteEvent, getEvent, getEvents } from "../utils/event_api";

import Image from "react-bootstrap/Image";
import eventCreationIcon from "./roundedcircle.png";
import EventCreation from "./event_creation/event_creation";
import Map from "./event_creation/map";
import ManagedEventsForAdmin from "./managed_events_admin/managed_events_admin";
import ParticipatedEvents from "./participated_events/participated_events";
import { whoAmI } from "../utils/event_utils/eventCommunicator";

export default function Home(): JSX.Element {
  const { url } = useRouteMatch();
  const history = useHistory();

  // academcity
  const defaultPosition = {
    lat: 54.852,
    lng: 83.106,
  };

  const [myLocation, setMyLocation] = useState<Coordinates>({
    lat: 54.852,
    lng: 83.106,
  });

  const [me, setMe] = useState<string>("");
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

  useEffect(() => {
    if (loading) {
      setLoading(false);
      navigator.geolocation.getCurrentPosition((success) => {
        const { latitude, longitude } = success.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        setCenter({ lat: latitude, lng: longitude });
      });
      getEvents().then((result) => {
        if (typeof result !== "string") {
          console.log(result);
          setActiveEvents(result as EventDto);
        }
      });
      whoAmI().then((res) => {
        setMe(res);
      });
    }
  }, [loading]);

  const onLogoutClick = (event): void => {
    logout();
    history.push("/");
    event.preventDefault();
  };

  const onDeleteClick = (): void => {
    const selectedEventId = selectedEvent.id;
    deleteEvent(selectedEventId).then((res) => {
      if (typeof res !== "string") {
        isShowEvent(false);
        setActiveEvents({
          events: activeEvents.events.filter(
            (event) => event.id !== selectedEventId
          ),
        });
      }
    });
  };

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

  return (
    <Container className={styles.container}>
      <Switch>
        <PrivateRoute path={`${url}`} exact>
          <Row className={styles.formRow}>
            <h1 className="title, text-lg-center">Welcome to Toosa Finder!</h1>
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
                <Button onClick={(): void => isShowEvent(false)}>Close</Button>
                <Button
                  hidden={selectedEvent.creator !== me}
                  className="ml-2"
                  variant="danger"
                  onClick={onDeleteClick}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </span>
          <Row className={`mt-2 ${styles.formRow}`}>
            <Button className="btn-danger" onClick={onLogoutClick}>
              Logout
            </Button>
          </Row>
          <Row className={styles.eventCreation}>
            <Link to={`${url}/eventCreation`}>
              <Image
                className={styles.enlargingEffect}
                src={eventCreationIcon}
                alt="logo"
              />
            </Link>
          </Row>
        </PrivateRoute>
        <PrivateRoute path={`${url}/eventCreation`} component={EventCreation} />
        <PrivateRoute
          path={`${url}/managedEvents`}
          component={ManagedEventsForAdmin}
        />
        <PrivateRoute
          path={`${url}/participatedEvents`}
          component={ParticipatedEvents}
        />
      </Switch>
    </Container>
  );
}
