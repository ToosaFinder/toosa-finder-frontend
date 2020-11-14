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
import Col from "react-bootstrap/Col";
import eventCreationIcon from "./roundedcircle.png";
import EventCreation from "./event_creation/event_creation";

export default function Home(): JSX.Element {
  const { url } = useRouteMatch();
  const history = useHistory();

  const onLogoutClick = (event): void => {
    logout();
    history.push("/");
    event.preventDefault();
  };
  const handleClick = (): void => {
    console.log("clicked");
  };
  return (
    <Container fluid className={styles.container}>
      <Row className={styles.formRow}>
        <h1 className="title, text-lg-center">Welcome to Toosa Finder!</h1>
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
      <Row>
        <Switch>
          <PrivateRoute path={`${url}/dima`} component={Dima} />
          <PrivateRoute path={`${url}/olya`} component={Olya} />
          <PrivateRoute path={`${url}/grisha`} component={Grisha} />
          <PrivateRoute
            path={`${url}/eventCreation`}
            component={EventCreation}
          />
        </Switch>
      </Row>
      <Row className={styles.formRow}>
        <Button className="btn-danger" onClick={onLogoutClick}>
          Logout
        </Button>
      </Row>

      <Row className={styles.eventCreation}>
        <Link to={`${url}/eventCreation`}>
          <Button variant="outline-light" onClick={handleClick}>
            <Image
              className={styles.enlargingEffect}
              src={eventCreationIcon}
              alt="logo"
            />
          </Button>
        </Link>
      </Row>
    </Container>
  );
}
