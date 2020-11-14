import React from "react";
import { Form, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import styles from "../../css/eventCreation.module.css";

export default function EventCreation(): JSX.Element {
  return (
    <Container>
      <Row>
        <Col md={{ span: 4, offset: 8 }}>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder="Your awesome event" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control placeholder="Tell us interesting information about your event" />
            </Form.Group>
            <Form.Group controlId="size range">
              <input type="range" list="sizemarks" />
              <datalist className={styles.datalist} id="sizemarks">
                <option className={styles.option} value="S" label="S">
                  s
                </option>
                <option className={styles.option} value="M" label="M">
                  m
                </option>
                <option className={styles.option} value="L" label="L">
                  l
                </option>
                <option className={styles.option} value="XL+" label="XL+">
                  xl
                </option>
              </datalist>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
