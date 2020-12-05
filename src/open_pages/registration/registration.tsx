import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import styles from "../../css/registration.module.css";
import { Link, useHistory } from "react-router-dom";
import { validateEmail, validateLogin } from "../../utils/validations";
import Alert from "react-bootstrap/Alert";
import { registration } from "../../utils/auth";

interface Credentials {
  email: string;
  login: string;
  password: string;
  passwordConfirmation: string;
}

interface AlertMessage {
  success: boolean;
  message: string;
}

export default function Registration(): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [credentials, setCredentials] = React.useState<Credentials>({
    email: "",
    login: "",
    password: "",
    passwordConfirmation: "",
  });
  const [checked, setChecked] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const history = useHistory<AlertMessage>();

  const enableAlert = (alert: AlertMessage): void => {
    if (alert !== undefined && alert.message !== undefined) {
      setAlertMsg(alert.message);
      setShow(true);
      alert.success ? setAlertVariant("success") : setAlertVariant("danger");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { email, login, password } = credentials;
    registration({ email, login, password }).then((success) => {
      if (success === true) {
        history.push("/sign-in");
      } else {
        const failAlert = {
          success: false,
          message: success as string,
        };
        enableAlert(failAlert);
      }
    });
  };
  const alert = history.location.state;

  useEffect(() => {
    enableAlert(alert);
  }, [alert]);

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
    event.preventDefault();
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
          <Form
            className={styles.form}
            onSubmit={onSubmit}
            onChange={onFormChange}
          >
            <h3>
              <Form.Label>Sign up</Form.Label>
            </h3>

            <Form.Group className={`${styles.input} mb-1`} controlId="email">
              <Form.Label className={styles.label}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Your email address"
                className={getEmailClassName()}
              />
              <Form.Label className="invalid-feedback">
                Invalid Email
              </Form.Label>
            </Form.Group>

            <Form.Group className={`${styles.input} mb-1`} controlId="login">
              <Form.Label className={styles.label}>Login</Form.Label>
              <Form.Control type="text" className={getLoginClassName()} />
              <Form.Label className="invalid-feedback">
                Invalid Login
              </Form.Label>
            </Form.Group>

            <Form.Group className={`${styles.input} mb-1`} controlId="password">
              <Form.Label className={styles.label}>Password</Form.Label>
              <Form.Control
                type="password"
                className={getPasswordClassName()}
              />
              <Form.Label className="invalid-feedback">
                Password must be at least 8 symbols long
              </Form.Label>
            </Form.Group>

            <Form.Group
              className={`${styles.input} mb-1`}
              controlId="passwordConfirmation"
            >
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
                defaultChecked={checked}
                onChange={(event: any) => {
                  event.stopPropagation();
                  setChecked(event.currentTarget.checked);
                }}
              />
              <Form.Label
                className="custom-control-label"
                htmlFor="customCheck1"
              >
                I agree to the{" "}
                <Link to="/terms-of-services" className={`text-danger`}>
                  Terms of Services
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className={`text-danger`}>
                  Privacy Policy
                </Link>
                .
              </Form.Label>
            </Form.Group>

            <Form.Group>
              <Button
                type="submit"
                className={`${styles.submitButton} btn-danger`}
                disabled={!canSubmit}
              >
                Continue
              </Button>
              <Row className={styles.signIn}>
                <h6 className={styles.secondaryText}>Have an account?</h6>
                <Link
                  to="/sign-in"
                  className={`${styles.link} text-danger float-right`}
                >
                  Sign In
                </Link>
              </Row>
            </Form.Group>
          </Form>
        </Row>
      </Container>
    </>
  );
}
