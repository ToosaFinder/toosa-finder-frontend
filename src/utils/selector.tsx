import { Form } from "react-bootstrap";
import React from "react";

export function Selector(props): JSX.Element {
  return (
    <Form.Control as="select" size="sm" onChange={props.onpick}>
      <option value="state" selected={true} disabled={true} hidden={true}>
        {props.defaultOptionText}
      </option>
      {props.list.map((val, index) => {
        return <option value={val}>{val}</option>;
      })}
    </Form.Control>
  );
}
