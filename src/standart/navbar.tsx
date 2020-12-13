import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import styles from "../css/navbar.module.css";
import { useHistory } from "react-router";
import { whoAmI } from "../utils/event_utils/eventCommunicator";
import { UserRes } from "../utils/interfaces";
import { logout } from "../utils/auth";

export default function AppNavbar(): JSX.Element {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<UserRes | undefined>();

  const handleLinkClick = useCallback(
    (route: string) => {
      history.push(route);
    },
    [history]
  );

  useEffect(() => {
    whoAmI().then((res) => {
      setUserInfo(res);
    });
  }, []);

  const onLogoutClick = useCallback(
    (event): void => {
      logout();
      history.push("/");
      event.preventDefault();
    },
    [history]
  );

  return (
    <Navbar bg="danger" className={styles.AppNavbar}>
      <Navbar.Brand>
        <h6 className={styles.Brand}>Toosa-finder</h6>
      </Navbar.Brand>
      <Nav.Link onClick={() => handleLinkClick("/home")}>
        <h6 className={styles.WhiteText}>Home</h6>
      </Nav.Link>
      <Nav.Link onClick={() => handleLinkClick("/event-creation")}>
        <h6 className={styles.WhiteText}>Event creation</h6>
      </Nav.Link>
      <Nav.Link onClick={() => handleLinkClick("/participated-events")}>
        <h6 className={styles.WhiteText}>Participated events</h6>
      </Nav.Link>
      <Nav.Link onClick={() => handleLinkClick("/administrated-events")}>
        <h6 className={styles.WhiteText}>Administrated events</h6>
      </Nav.Link>
      <Navbar.Collapse className="justify-content-end">
        <h6 className={styles.WhiteText}>
          {userInfo && `Signed in as: ${userInfo.login} (${userInfo.email})`}
        </h6>
      </Navbar.Collapse>
      <Form inline>
        <Button
          variant="outline-light"
          onClick={onLogoutClick}
          className={`${styles.Logout} justify-content-end`}
        >
          Logout
        </Button>
      </Form>
    </Navbar>
  );
}
