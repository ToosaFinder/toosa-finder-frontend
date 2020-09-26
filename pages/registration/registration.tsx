import React, {useState, useEffect} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import styles from "../../shared/css/registration.module.css"
import Link from "next/link";

export default function Registration() {
    const [email, setEmail] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regExpLogin = /^[a-zA-Z](.[a-zA-Z0-9_-]*)$/;

    const validateEmail = (email) => {
        return regExpEmail.test(String(email).toLowerCase());
    };

    const validateLogin = (login) => {
        return regExpLogin.test(String(login));
    };

    useEffect(() => {
        setCanSubmit(
            validateEmail(email) && validateLogin(login) && checked
        );
    });

    const getLoginClassName = () => {
        if (validateLogin(login) || login === '') {
           return '';
        } else return 'is-invalid'
    };

    const getEmailClassName = () => {
        if (validateEmail(email) || email === '') {
            return '';
        } else return 'is-invalid'
    };

    return (
        <Container className={styles.container}>
            <Row className={styles.formRow}>
                <Form className={styles.form}>
                    <h3>
                        <Form.Label>Sign up</Form.Label>
                    </h3>

                    <Form.Group className={styles.input}>
                        <Form.Label className={styles.label}>Email</Form.Label>
                        <Form.Control
                            type='email'
                            name='email'
                            placeholder='Your email address'
                            value={email}
                            className={getEmailClassName()}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Label className='invalid-feedback'>Invalid Email</Form.Label>
                    </Form.Group>

                    <Form.Group className={styles.input}>
                        <Form.Label className={styles.label}>Login</Form.Label>
                        <Form.Control
                            type='text'
                            name='login'
                            value={login}
                            className={getLoginClassName()}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <Form.Label className='invalid-feedback'>Invalid Login</Form.Label>
                    </Form.Group>

                    <Form.Group className='custom-control custom-checkbox'>
                        <Form.Control
                            type='checkbox'
                            className='custom-control-input'
                            id='customCheck1'
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                        />
                        <Form.Label className='custom-control-label' htmlFor='customCheck1'>
                            I agree to the <Link href='/terms-of-services'> Terms of Services </Link>
                            and <Link href='/privacy-policy'> Privacy Policy</Link>.
                        </Form.Label>
                    </Form.Group>

                    <Form.Group>
                        <Button
                            type='submit'
                            className={styles.submitButton}
                            disabled={!canSubmit}>
                            Continue
                        </Button>
                        <Row className={styles.signIn}>
                            <h6 className={styles.secondaryText}>Have an account?</h6>
                            <h6 className={styles.link}><Link href='/sign-in'>Sign in</Link></h6>
                        </Row>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
    )
}
