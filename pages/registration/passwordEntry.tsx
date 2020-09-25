import React, {useEffect, useState} from "react";
import {Container, Form, Row} from "react-bootstrap";
import styles from "../../shared/css/registration.module.css"

export default function PasswordEntry() {
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordConfirmationError, setPasswordConfirmationError] = useState<string>('');
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;

        switch (name) {
            case 'password':
                setPassword(value);
                setPasswordError(
                    value.length >= 8 || value === ''
                        ? ''
                        : 'Password must be at least 8 characters long'
                );
                break;
            case 'passwordConfirmation':
                setPasswordConfirmation(value);
                setPasswordConfirmationError(
                    value === password  || value === ''
                        ? ''
                        : 'Does not match password '
                );
                break;
            default:
                break;
        }
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

                    <Form.Group controlId='formPassword' className={styles.input}>
                        <Form.Label className={styles.label}>Password</Form.Label>
                        <Form.Control
                            type='password'
                            name='password'
                            value={password}
                            onChange={handleChange}
                        />
                        {passwordError.length > 0 ?
                            <span className={styles.error}>{passwordError}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='formPasswordConfirmation' className={styles.input}>
                        <Form.Label className={styles.label}>Password confirmation</Form.Label>
                        <Form.Control
                            type='password'
                            name='passwordConfirmation'
                            value={passwordConfirmation}
                            onChange={handleChange}
                        />
                        {passwordConfirmationError.length > 0 ?
                            <span className={styles.error}>{passwordConfirmationError}</span> : null}
                    </Form.Group>

                    <button
                        type='submit'
                        className={styles.submitButton}
                        disabled={!canSubmit}>
                        Done!
                    </button>
                </Form>
            </Row>
        </Container>
    )
}
