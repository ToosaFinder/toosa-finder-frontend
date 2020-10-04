import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import styles from "../css/registration.module.css";
import { Link } from "react-router-dom";

interface Credentials {
  email: string;
  login: string;
  password: string;
  passwordConfirmation: string;
}

export default function Registration(): JSX.Element {
  const [credentials, setCredentials] = React.useState<Credentials>({
    email: "",
    login: "",
    password: "",
    passwordConfirmation: "",
  });
  const [checked, setChecked] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  // eslint-disable-next-line no-useless-escape
  const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regExpLogin = /^[a-zA-Z](.[a-zA-Z0-9_-]*)$/;

  const validateEmail = (email) => {
    return regExpEmail.test(String(email).toLowerCase());
  };

  const validateLogin = (login) => {
    return regExpLogin.test(String(login));
  };

  // eslint-disable-next-line
  useEffect(() => {
    setCanSubmit(
      validateEmail(credentials.email) &&
        validateLogin(credentials.login) &&
        checked &&
        credentials.password.length >= 8 &&
        credentials.password === credentials.passwordConfirmation
    );
  });

  const getLoginClassName = () => {
    if (validateLogin(credentials.login) || credentials.login === "") {
      return "";
    } else {
      return "is-invalid";
    }
  };

  const getEmailClassName = () => {
    if (validateEmail(credentials.email) || credentials.email === "") {
      return "";
    } else {
      return "is-invalid";
    }
  };

  const getPasswordConfirmationClassName = () => {
    if (
      credentials.passwordConfirmation === credentials.password ||
      credentials.passwordConfirmation.length < 8 ||
      credentials.password.length < 8 ||
      credentials.password === ""
    ) {
      return "";
    } else {
      return "is-invalid";
    }
  };

  const getPasswordClassName = () => {
    if (credentials.password.length >= 8 || credentials.password === "") {
      return "";
    } else {
      return "is-invalid";
    }
  };

  const onFormChange = (event) => {
    setCredentials({ ...credentials, [event.target.id]: event.target.value });
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.formRow}>
        <Form className={styles.form} onChange={onFormChange}>
          <h3>
            <Form.Label>Sign up</Form.Label>
          </h3>

          <Form.Group className={styles.input} controlId="email">
            <Form.Label className={styles.label}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email address"
              className={getEmailClassName()}
            />
            <Form.Label className="invalid-feedback">Invalid Email</Form.Label>
          </Form.Group>

          <Form.Group className={styles.input} controlId="login">
            <Form.Label className={styles.label}>Login</Form.Label>
            <Form.Control type="text" className={getLoginClassName()} />
            <Form.Label className="invalid-feedback">Invalid Login</Form.Label>
          </Form.Group>

          <Form.Group className={styles.input} controlId="password">
            <Form.Label className={styles.label}>Password</Form.Label>
            <Form.Control type="password" className={getPasswordClassName()} />
            <Form.Label className="invalid-feedback">
              Password must be at least 8 symbols long
            </Form.Label>
          </Form.Group>

          <Form.Group className={styles.input} controlId="passwordConfirmation">
            <Form.Label className={styles.label}>
              Password confirmation
            </Form.Label>
            <Form.Control
              type="password"
              className={getPasswordConfirmationClassName()}
            />
            <Form.Label className="invalid-feedback">
              Does not match password
            </Form.Label>
          </Form.Group>

          <Form.Group className="custom-control custom-checkbox">
            <Form.Control
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
            />
            <Form.Label className="custom-control-label" htmlFor="customCheck1">
              I agree to the{" "}
              <Link to="/terms-of-services"> Terms of Services </Link>
              and <Link to="/privacy-policy"> Privacy Policy</Link>.
            </Form.Label>
          </Form.Group>

          <Form.Group>
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={!canSubmit}
            >
              Continue
            </Button>
            <Row className={styles.signIn}>
              <h6 className={styles.secondaryText}>Have an account?</h6>
              <h6 className={styles.link}>
                <Link to="/sign-in">Sign in</Link>
              </h6>
            </Row>
          </Form.Group>
        </Form>
      </Row>
    </Container>
  );
}
