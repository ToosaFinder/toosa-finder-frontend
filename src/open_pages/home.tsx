import React, { useEffect, useState } from "react";
import { Switch, useHistory, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../utils/private_route";
import { Button, Container, Row } from "react-bootstrap";
import styles from "../css/home.module.css";
import { logout } from "../utils/auth";
import GoogleMapReact from "google-map-react";
import { Coordinates, EventDto, MapProps } from "../utils/interfaces";
import Marker from "../utils/marker";
import { getEvents } from "../utils/event_api";


export default function Home(): JSX.Element {
  const { url } = useRouteMatch();
  const history = useHistory();

  // academcity
  const defaultPosition = {
    lat: 54.852,
    lng: 83.106
  };

  const [myLocation, setMyLocation] = useState<Coordinates>({ lat: 54.852, lng: 83.106 })

  const [mapProps, setMapProps] = useState<MapProps>({
    center: defaultPosition,
    zoom: 15
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeEvents, setActiveEvents] = useState<EventDto>({events: []});


  useEffect(() => {
    if (loading) {
      setLoading(false);
      navigator.geolocation.getCurrentPosition((success => {
        const { latitude, longitude } = success.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        setMapProps({...mapProps, center: {lat: latitude, lng: longitude}});
      }));
      getEvents().then(result => {
        if (typeof result !== "string") {
          console.log(result);
          setActiveEvents(result as EventDto);
        }
      })
    }
  });

  const onLogoutClick = (event): void => {
    logout();
    history.push("/");
    event.preventDefault();
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.formRow}>
        <h1 className="title, text-lg-center">Welcome to Toosa Finder!</h1>
      </Row>
      <Switch>
        <PrivateRoute path={`${url}`} exact>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCmCqa6kM9MtaVWFU0GVBWAdoxJfG24Nfg" }}
            center={mapProps.center}
            zoom={mapProps.zoom}
          >
            <Marker lat={myLocation.lat} lng={myLocation.lng}>
              Я
            </Marker>
            {activeEvents.events.map((event, index) => {
              return <Marker key={index} lat={event.latitude} lng={event.longitude}>{event.name}</Marker>
            })}
          </GoogleMapReact>
        </PrivateRoute>
      </Switch>
      <Row className={`mt-2 ${styles.formRow}`}>
        <Button className="btn-danger" onClick={onLogoutClick}>
          Logout
        </Button>
      </Row>
    </Container>
  );
}
