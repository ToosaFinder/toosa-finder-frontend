import styles from "../css/home.module.css";
import { Button, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { deleteEvent, joinEvent, leaveEvent } from "../utils/event_api";
import { SingleEventDto } from "../utils/interfaces";
import { whoAmI } from "../utils/event_utils/eventCommunicator";

interface EventInfoProps {
  selectedEvent: SingleEventDto;
  enableAlert: any;
  showEventState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  getActiveEvents: any;
}

export default function EventInfo(props: EventInfoProps) {
  const [showEvent, isShowEvent] = props.showEventState;
  const [me, setMe] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (loading) {
      setLoading(false);
      whoAmI().then((res) => {
        setMe(res.login);
      });
    }
  }, [loading]);

  const onDeleteClick = (): void => {
    const selectedEventId = props.selectedEvent.id;
    deleteEvent(selectedEventId).then((res) => {
      if (typeof res !== "string") {
        isShowEvent(false);
        props.getActiveEvents();
      }
    });
  };

  const leaveEventClick = (): void => {
    leaveEvent(props.selectedEvent.id).then((success) => {
      if (success === true) {
        isShowEvent(false);
        const successAlert = {
          variant: "warning",
          message: "Вы покинули мероприятие " + props.selectedEvent.name,
        };
        props.enableAlert(successAlert);
      } else {
        const failAlert = {
          variant: "danger",
          message: success as string,
        };
        props.enableAlert(failAlert);
      }
      props.getActiveEvents();
    });
  };

  const isHost = (): boolean => {
    return props.selectedEvent.creator === me;
  };

  const isParticipant = (): boolean => {
    return props.selectedEvent.participants.includes(me);
  };

  const joinEventClick = () => {
    joinEvent(props.selectedEvent.id).then((success) => {
      if (success === true) {
        isShowEvent(false);
        const successAlert = {
          variant: "success",
          message:
            "Вы присоединились к мероприятию " + props.selectedEvent.name,
        };
        props.enableAlert(successAlert);
      } else {
        const failAlert = {
          variant: "danger",
          message: success as string,
        };
        props.enableAlert(failAlert);
      }
      props.getActiveEvents();
    });
  };
  return (
    <Card className={`${styles.card} ${showEvent ? "" : "d-none"}`}>
      <Card.Body>
        <Card.Title>{`${props.selectedEvent.name} by ${props.selectedEvent.creator}`}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {`${
            props.selectedEvent.tags.length > 0
              ? `Tags: ${props.selectedEvent.tags.join(", ")}`
              : ""
          }`}
        </Card.Subtitle>
        <Card.Text>
          <p>{`Max guests: ${props.selectedEvent.participantsLimit}`}</p>
          <p>{props.selectedEvent.description}</p>
          <p>{props.selectedEvent.address}</p>
          <p>{new Date(props.selectedEvent.startTime).toDateString()}</p>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button onClick={(): void => isShowEvent(false)} className="mr-2">
          Close
        </Button>
        {isHost() ? (
          <Button onClick={onDeleteClick} variant="danger">
            Delete
          </Button>
        ) : isParticipant() ? (
          <Button onClick={leaveEventClick} variant="warning">
            Leave
          </Button>
        ) : (
          <Button onClick={joinEventClick} variant="success">
            Join
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}
