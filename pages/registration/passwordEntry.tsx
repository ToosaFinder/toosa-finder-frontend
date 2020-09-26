import React, {useEffect, useState} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import styles from "../../shared/css/registration.module.css"

export default function PasswordEntry() {
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const getPasswordConfirmationClassName = () => {
        if (passwordConfirmation === password || password.length < 8
            || passwordConfirmation === '') {
            return '';
        } else return 'is-invalid'
    };

    const getPasswordClassName = () => {
        if (password.length >= 8 || password === '') {
            return '';
        } else return 'is-invalid'
    };

    useEffect(() => {
        setCanSubmit(
            password.length >= 8 &&
            password === passwordConfirmation
        )
    });

    return (
        <Container className={styles.container}>
            <Row className={styles.formRow}>
                <Form className={styles.form}>
                    <h3>
                        <Form.Label>Sign up</Form.Label>
                    </h3>

                    <Form.Group className={styles.input}>
                        <Form.Label className={styles.label}>Password</Form.Label>
                        <Form.Control
                            type='password'
                            name='password'
                            value={password}
                            className={getPasswordClassName()}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Label className='invalid-feedback'>Password must be at least 8 symbols long</Form.Label>
                    </Form.Group>

                    <Form.Group className={styles.input}>
                        <Form.Label className={styles.label}>Password confirmation</Form.Label>
                        <Form.Control
                            type='password'
                            name='passwordConfirmation'
                            value={passwordConfirmation}
                            className={getPasswordConfirmationClassName()}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <Form.Label className='invalid-feedback'>Does not match password</Form.Label>
                    </Form.Group>

                    <Form.Group>
                        <Button
                            type='submit'
                            className={styles.submitButton}
                            disabled={!canSubmit}>
                            Done!
                        </Button>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
    )
}
