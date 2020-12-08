import Button from "react-bootstrap/Button";
import styles from "../../css/eventCreation.module.css";
import React from "react";

export function ShowTags (props): JSX.Element {
  return (
    <div>
      {
        props.listOfPickedTags &&
        props.listOfPickedTags.map((val: string) => {
        return (
          <>
            <Button
              className={styles.tagButton}
              size="sm"
              variant="success"
              onClick={
                () =>
                {
                  if (props.onTextualButtonClick)
                    props.onTextualButtonClick(val)
                }
              }
            >
              {val}
              <Button
                className={styles.tagCloseButton}
                variant="danger"
                size="sm"
                onClick={(
                  event: React.MouseEvent<HTMLElement, MouseEvent>
                ) => {
                  if (props.onCloseButtonClick)
                    props.onCloseButtonClick(event, val);
                }}
              >
                X
              </Button>
            </Button>{" "}
          </>
        );
      })}
    </div>
  );
};