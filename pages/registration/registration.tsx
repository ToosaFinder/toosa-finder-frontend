import React, {useState, useEffect} from "react";
import {Container, Form, Row} from "react-bootstrap";
import styles from "../../shared/css/registration.module.css"
import Link from "next/link";

export default function Registration() {
    const [email, setEmail] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regExpLogin = /^[a-zA-Z](.[a-zA-Z0-9_-]*)$/;

    const validateEmail = (email) => {
        return regExpEmail.test(String(email).toLowerCase());
    };

    const validateLogin = (login) => {
        return regExpLogin.test(String(login));
    };

    const handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;

        switch (name) {
            case 'email':
                setEmail(value);
                setEmailError(
                    validateEmail(value) || value === ''
                        ? ''
                        : 'Email is not valid'
                );
                break;
            case 'login':
                setLogin(value);
                setLoginError(
                    validateLogin(value) || value === ''
                        ? ''
                        : 'Login is not valid'
                );
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        setCanSubmit(
            validateEmail(email) && validateLogin(login)
        );
    });

    return (
        <Container className={styles.container}>
            <Row className={styles.formRow}>
                <Form className={styles.form}>
                    <h3>
                        <Form.Label>Sign up</Form.Label>
                    </h3>

                    <Form.Group controlId='formEmail' className={styles.input}>
                        <Form.Label className={styles.label}>Email</Form.Label>
                        <Form.Control
                            type='email'
                            name='email'
                            placeholder='Your email address'
                            value={email}
                            onChange={handleChange}
                        />
                        {emailError.length > 0 ?
                        <span className={styles.error}>{emailError}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='formLogin' className={styles.input}>
                        <Form.Label className={styles.label}>Login</Form.Label>
                        <Form.Control
                            type='text'
                            name='login'
                            value={login}
                            onChange={handleChange}
                        />
                        {loginError.length > 0 ?
                            <span className={styles.error}>{loginError}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='formCheckbox'>
                        <Form.Check type='checkbox' label='Not finished'/>
                    </Form.Group>

                    <button
                        type='submit'
                        className={styles.submitButton}
                        disabled={!canSubmit}>
                        Continue
                    </button>

                    <div className={styles.rowContainer}>
                        <h6>Have an account?</h6>
                        <h6 className={styles.link}><Link href='/sign-in'>Sign in</Link></h6>
                    </div>

                </Form>
            </Row>
        </Container>
    )
}
