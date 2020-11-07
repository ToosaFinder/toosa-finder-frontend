import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styles from "../../css/login.module.css";
import { login } from "../../utils/auth";
import { Link, useHistory } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { Credentials } from "../../utils/interfaces";

interface AlertMessage {
  success: boolean;
  message: string;
}

export default function SignIn(): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [credentials, setCredentials] = React.useState<Credentials>();
  const history = useHistory<AlertMessage>();

  const enableAlert = (alert: AlertMessage): void => {
    if (alert !== undefined && alert.message !== undefined) {
      setAlertMsg(alert.message);
      setShow(true);
      alert.success ? setAlertVariant("success") : setAlertVariant("danger");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    login(credentials).then(success => {
      if (success === true) {
        history.push("/");
      } else {
        const failAlert = {
          success: false,
          message: success as string
        };
        enableAlert(failAlert);
      }
    })
  };
  const alert = history.location.state;

  useEffect(() => {
    enableAlert(alert);
  }, [alert]);

  const onFormChange = (event): void => {
    setCredentials({ ...credentials, [event.target.id]: event.target.value });
  };

  return (
    <>
      <Alert
        variant={alertVariant}
        show={show}
        onClose={(): void => setShow(false)}
        dismissible
      >
        <div className="p-1">{alertMsg}</div>
      </Alert>
      <Container className={styles.container}>
        <Row className={styles.formRow}>
          <Col md="auto">
            <Form
              className={styles.form}
              onSubmit={onSubmit}
              onChange={onFormChange}
            >
              <h3 className="mb-4">Sign in</h3>
              <Form.Group className={styles.input} controlId="userId">
                <Form.Label className={styles.label}>Email or login</Form.Label>
                <Form.Control placeholder="Enter your login"/>
              </Form.Group>

              <Form.Group className={styles.input} controlId="password">
                <Form.Label className={styles.label}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                />
              </Form.Group>

              <Form.Group controlId="submit-btn">
                <Button
                  className={`${styles.submitButton} btn-danger`}
                  type="submit"
                >
                  Sign In
                </Button>
              </Form.Group>

              <Form.Group className={styles.signUp} controlId="help-btns">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Link
                  to="/restore"
                  className={`${styles.secondaryText} ${styles.link}`}
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/sign-up"
                  className={`${styles.link} text-danger float-right`}
                >
                  Sign Up
                </Link>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
