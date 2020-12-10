import React from "react";
import { Link, Switch, useHistory, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../utils/private_route";
import Dima from "../devs/dima";
import Olya from "../devs/olya";
import Grisha from "../devs/grisha";
import { Button, Container, Row } from "react-bootstrap";
import styles from "../css/home.module.css";
import { logout } from "../utils/auth";
import Image from "react-bootstrap/Image";
import eventCreationIcon from "./roundedcircle.png";
import EventCreation from "./event_creation/event_creation";
import ManagedEventsForAdmin from "./managed_events_admin/managed_events_admin";
import ParticipatedEvents from "./participated_events/participated_events";

export default function Home(): JSX.Element {
  const { url } = useRouteMatch();
  const history = useHistory();

  const onLogoutClick = (event): void => {
    logout();
    history.push("/");
    event.preventDefault();
  };

  return (
    <Row>
      <Switch>
        <PrivateRoute path={`${url}/dima`} component={Dima} />
        <PrivateRoute path={`${url}/olya`} component={Olya} />
        <PrivateRoute path={`${url}/grisha`} component={Grisha} />
        <PrivateRoute path={`${url}`} exact>
          <Container fluid className={styles.container}>
            <Row className={styles.formRow}>
              <h1 className="title, text-lg-center">
                Welcome to Toosa Finder!
              </h1>
            </Row>
            <Row className={styles.formRow}>
              <h4 className="text-lg-center">Developers:</h4>
            </Row>
            <Row className={styles.formRow}>
              {" "}
              <h5 className="text-md-center">
                <Link to={`${url}/dima`}> Дима </Link>
                <Link to={`${url}/olya`}> Оля </Link>
                <Link to={`${url}/grisha`}> Гриша </Link>
              </h5>
            </Row>

            {/*temporary raw*/}
            <Row className={styles.formRow}>
              <Link to={`${url}/managedEvents`}>
                <Button variant="success">Managed events</Button>
              </Link>
            </Row>

            {/*temporary raw*/}
            <Row className={styles.formRow}>
              <Link to={`${url}/participatedEvents`}>
                <Button variant="success">Participated events</Button>
              </Link>
            </Row>

            <Row className={styles.formRow}>
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
          </Container>
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
    </Row>
  );
}
