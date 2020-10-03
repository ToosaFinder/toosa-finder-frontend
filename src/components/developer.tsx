import React from "react";
import { Container, Row } from "react-bootstrap";
import styles from "../css/developer.module.css";

type DeveloperProps = {
  name: string;
  surname: string;
  group: string;
};

// Simply to check that css modules work correctly
export default function Developer({ name, surname, group }: DeveloperProps) : JSX.Element {
  return (
    <Container className={styles.container}>
      <Row className={styles.fullname}>
        <h1>{`${name} ${surname}`}</h1>
      </Row>
      <Row className={styles.group}>
        <h4>{group}</h4>
      </Row>
    </Container>
  );
}
