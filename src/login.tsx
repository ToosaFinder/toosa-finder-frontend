import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styles from "./css/login.module.css";
import { Credentials } from "./utils/api";
import { login } from "./utils/auth";
import { Link } from "react-router-dom";

export default function SignIn(): JSX.Element {
  const [credentials, setCredentials] = React.useState<Credentials>();
  const onSubmit = async (event): Promise<void> => {
    console.log(
      `Login "${credentials?.login}" \nPassword "${credentials?.password}"`
    );
    await login(credentials);
    event.preventDefault();
  };

  const onFormChange = (event): void => {
    setCredentials({ ...credentials, [event.target.id]: event.target.value });
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.formRow}>
        <Col md="auto">
          <Form onSubmit={onSubmit} onChange={onFormChange}>
            <h3 className="mb-4">Sign in</h3>
            <Form.Group className={styles.input} controlId="login">
              <Form.Label className={styles.label}>Email or login</Form.Label>
              <Form.Control placeholder="Enter your login" />
            </Form.Group>

            <Form.Group className={styles.input} controlId="password">
              <Form.Label className={styles.label}>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>

            <Form.Group controlId="submit-btn">
              <Button className={styles.submitButton} type="submit">
                Sign In
              </Button>
            </Form.Group>

            <Form.Group className={styles.signUp} controlId="help-btns">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Link
                to="/restore"
                className={styles.link + " " + styles.secondaryText}
              >
                <label>Forgot Password?</label>
              </Link>
              <Link to="/sign-up" className={styles.link + " float-right"}>
                <label>Forgot Password?</label>
              </Link>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
