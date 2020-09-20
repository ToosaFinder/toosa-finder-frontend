import React from 'react'
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Link from "next/link";
import styles from "../shared/css/login.module.css"

interface ApiResponse<T> {
    code: number
    response: T
}

interface LoginResponseBody {
    jwt: string
    refreshToken: string
}

interface ApiClient {
    login(credentials: Credentials): ApiResponse<LoginResponseBody>
}

interface Credentials {
    login: string,
    password: string
}

class DummyApiClient implements ApiClient {
    JWT: string = "DUMMY_JWT";
    REFRESH_TOKEN: string = "DUMMY_REFRESH_TOKEN";

    login(credentials: Credentials): ApiResponse<LoginResponseBody> {
        return {
            code: 200,
            response: {
                jwt: this.JWT,
                refreshToken: this.REFRESH_TOKEN
            }
        }
    }
}

export default function SignIn() {
    const [credentials, setCredentials] = React.useState<Credentials>();
    // Simply to check that it works
    const apiClient: ApiClient = new DummyApiClient();
    const onSubmit = (event) => {
        console.log(`Login "${credentials?.login}" \nPassword "${credentials?.password}"`);
        const tokens = apiClient.login(credentials)?.response;
        console.log(`JWT "${tokens?.jwt}" \nRefresh "${tokens?.refreshToken}"`);
        event.preventDefault()
    };

    const onFormChange = (event) => {
        setCredentials({...credentials, [event.target.id]: event.target.value})
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
                            <Form.Control placeholder="Enter your login"/>
                            <Form.Text className="text-muted">
                                Your nickname or email
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password"/>
                        </Form.Group>
                        <Form.Group>
                            <Button className="float-right" variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                        <Form.Group>
                            <Button size='sm' variant="light">
                                    <Link href='/sign-up'>
                                    Don't have an account yet?
                                </Link>
                            </Button>
                            <Button size='sm' variant="light">
                                <Link href='/restore'>
                                    Forgot your password?
                                </Link>
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}