import React from "react";
import {Form} from "react-bootstrap";
import styles from "../../css/error_page.module.css";

export default function ErrorPage(): JSX.Element {
  return (
    <Form.Group
      className={`${styles.form} card card-body text-white bg-danger`}
    >
      <h4 className="card-title">Oops</h4>
      <p className="card-text">We are sorry, but something went wrong :(</p>
    </Form.Group>
  );
}
