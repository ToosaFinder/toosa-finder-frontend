import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  useParams,
  useLocation,
  matchPath,
  useHistory,
} from "react-router-dom";
import styles from "../../css/restorePassword.module.css";
import { createNewPassword } from "../../utils/auth";
import { validatePassword } from "../../utils/validations";

interface PasswordCheck {
  password: string;
  passwordConfirmation: string;
}

const url = "/restore/:restoreToken";

export default function CreatePassword(): JSX.Element {
  const { restoreToken } = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = matchPath(location.pathname, {
    path: url,
    exact: true,
    strict: true,
  });
  if (match == null) {
    history.push("/sign-in", {
      success: false,
      message: "Invalid link or token!"
    });
  }
  const [passwordCheck, setPasswordCheck] = React.useState<PasswordCheck>({
    password: "",
    passwordConfirmation: "",
  });

  const onSubmit = async (event): Promise<void> => {
    event.preventDefault();
    const success = await createNewPassword(
      passwordCheck.password,
      restoreToken
    );
    let state;
    if (success) {
      state = {
        success: true,
        message: "Password restored successfully!",
      };
    } else {
      state = {
        success: false,
        message: "Failed to restore password: maybe, you got an invalid token?",
      };
    }
    history.push("/sign-in", state);
  };

  const onFormChange = (event): void => {
    setPasswordCheck({
      ...passwordCheck,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.formRow}>
        <Col md="auto">
          <Form onSubmit={onSubmit} onChange={onFormChange}>
            <h3 className="mb-4">Change Password</h3>
            <Form.Group className={styles.input} controlId="password">
              <Form.Label className={styles.label}>Password</Form.Label>
              <Form.Control
                type="password"
                className={
                  validatePassword(passwordCheck.password) ||
                  passwordCheck.password === ""
                    ? ""
                    : "is-invalid"
                }
              />
              <Form.Label className="invalid-feedback">
                Password must be at least 8 symbols long
              </Form.Label>
            </Form.Group>

            <Form.Group
              className={styles.input}
              controlId="passwordConfirmation"
            >
              <Form.Label className={styles.label}>
                Password confirmation
              </Form.Label>
              <Form.Control
                type="password"
                className={
                  passwordCheck.password ===
                    passwordCheck.passwordConfirmation ||
                  passwordCheck.passwordConfirmation === ""
                    ? ""
                    : "is-invalid"
                }
              />
              <Form.Label className="invalid-feedback">
                Does not match password
              </Form.Label>
            </Form.Group>

            <Form.Group controlId="submit-btn">
              <Button
                className={`${styles.submitButton} btn-danger`}
                type="submit"
                disabled={
                  !validatePassword(passwordCheck.password) ||
                  passwordCheck.password !== passwordCheck.passwordConfirmation
                }
              >
                Restore Password
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
