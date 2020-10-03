import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styles from "./css/login.module.css";
import { LinkContainer } from "react-router-bootstrap";

interface ApiResponse<T> {
  code: number;
  response: T;
}

interface LoginResponseBody {
  jwt: string;
  refreshToken: string;
}

interface ApiClient {
  login(credentials: Credentials): ApiResponse<LoginResponseBody>;
}

interface Credentials {
  login: string;
  password: string;
}

class DummyApiClient implements ApiClient {
  JWT = "DUMMY_JWT";
  REFRESH_TOKEN = "DUMMY_REFRESH_TOKEN";

  login(_: Credentials): ApiResponse<LoginResponseBody> {
    return {
      code: 200,
      response: {
        jwt: this.JWT,
        refreshToken: this.REFRESH_TOKEN,
      },
    };
  }
}

export default function SignIn(): JSX.Element {
  const [credentials, setCredentials] = React.useState<Credentials>();
  // Simply to check that it works
  const apiClient: ApiClient = new DummyApiClient();
  const onSubmit = (event): void => {
    console.log(
      `Login "${credentials?.login}" \nPassword "${credentials?.password}"`
    );
    const tokens = apiClient.login(credentials)?.response;
    console.log(`JWT "${tokens?.jwt}" \nRefresh "${tokens?.refreshToken}"`);
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
            <Form.Group controlId="login">
              <h1>
                <Form.Label>Authorization</Form.Label>
              </h1>
              <Form.Label>Your nickname or email</Form.Label>
              <Form.Control placeholder="Enter your login" />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Your password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>
            <Form.Group>
              <Button className="float-right" variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
            <Form.Group>
              <LinkContainer to="/sign-up">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Button size="sm" variant="light">
                  Don't have an account yet?
                </Button>
              </LinkContainer>
              <LinkContainer to="/restore">
                <Button size="sm" variant="light">
                  Forgot your password?
                </Button>
              </LinkContainer>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
