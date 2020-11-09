import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styles from "../../css/restorePassword.module.css";
import { forgotPassword } from "../../utils/auth";
import { Link, useHistory } from "react-router-dom";
import { validateEmail } from "../../utils/validations";
import { RestorePasswordCredentials } from "../../utils/interfaces";

export default function ForgotPassword(): JSX.Element {
  const [passwordRestore, setPasswordRestore] = React.useState<RestorePasswordCredentials>(
    { email: "" }
  );
  const history = useHistory();
  const onSubmit = async (event): Promise<void> => {
    event.preventDefault();
    const success = await forgotPassword(passwordRestore);
    let state;
    if (success) {
      state = {
        success: true,
        message: "Password restore link set to your email!",
      };
    } else {
      state = {
        success: false,
        message: "Failed to create password link :(",
      };
    }
    history.push("/sign-in", state);
  };

  const onFormChange = (event): void => {
    /*setEmail(event.target.value);*/
    setPasswordRestore({
      ...passwordRestore,
      [event.target.id]: event.target.value,
    });
  };

  const getEmailClassName = (): string => {
    return validateEmail(passwordRestore.email) || passwordRestore.email === ""
      ? ""
      : "is-invalid";
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.formRow}>
        <Col md="auto">
          <Form
            className={styles.form}
            onSubmit={onSubmit}
            onChange={onFormChange}
          >
            <h3 className="mb-4">Restore Password</h3>

            <Form.Group className={styles.input} controlId="email">
              <Form.Label className={styles.label}>Email</Form.Label>
              <Form.Control
                placeholder="Enter your email"
                className={getEmailClassName()}
              />
              <Form.Label className="invalid-feedback">
                Invalid Email
              </Form.Label>
            </Form.Group>

            <Form.Group controlId="submit-btn">
              <Button
                disabled={!validateEmail(passwordRestore.email)}
                className={`${styles.submitButton} btn-danger`}
                type="submit"
              >
                Restore Password
              </Button>
            </Form.Group>
            <Row className={styles.signIn}>
              <Link to="/sign-in" className={styles.link}>
                Back to login
              </Link>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
