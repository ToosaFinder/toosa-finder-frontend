import React from "react";
import {Link, Switch, useRouteMatch} from "react-router-dom";
import PrivateRoute from "../utils/private_route";
import Dima from "../devs/dima";
import Olya from "../devs/olya";
import Grisha from "../devs/grisha";
import {Container, Row} from "react-bootstrap";
import styles from "../css/home.module.css";
import EventCreation from "./event_creation/event_creation";
import AppNavbar from "../standart/navbar";

export default function Home(): JSX.Element {
  const { url } = useRouteMatch();

  return (
    <>
      <AppNavbar />
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
          </Container>
        </PrivateRoute>
        <PrivateRoute path={`${url}/eventCreation`} component={EventCreation} />
      </Switch>
    </>
  );
}
