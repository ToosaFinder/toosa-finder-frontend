import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import {Event} from "../interfaces";
import { ShowTags } from "../tag_utils/show_tag";
import { Selector } from "../selector";
import { filterEventsByTag } from "./filter_events_by_tags";
import { filterEventsByEventname } from "./filter_events_by_eventname";

export default function EventFilter(props):JSX.Element {

  const events: Event[] = props.allEvents.slice();
  const [listOfAllTags, setListOfAllTags] = useState<string[]>(props.alltags);
  console.log("listOfAllTags: ",listOfAllTags.join(", "));
  const [listOfPickedTags, setListOfPickedTags] = useState<string[]>([]);
  const [eventNameFilter, setEventNameFilter] = useState<string>("");

  const onEventName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const eventName: string = event.target.value;
    setEventNameFilter(eventName);
    if (eventName === ""){
      props.eventsSetter(filterEventsByTag(events, listOfPickedTags));
    } else {
      const curEvents = filterEventsByEventname(events, eventName);
      props.eventsSetter(filterEventsByTag(curEvents, listOfPickedTags));
    }
  }


  const onTagPick = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    let str: string = event.target.value;

    if (str === "state") {
      return;
    }

    const newPickedTagsList: string[] = [...listOfPickedTags, str];
    setListOfPickedTags(newPickedTagsList);
    setListOfAllTags(listOfAllTags.filter((el) => el !== str));

    if (eventNameFilter===""){
      props.eventsSetter(filterEventsByTag(events, newPickedTagsList));
    } else {
      const curEvents = filterEventsByEventname(events, eventNameFilter);
      props.eventsSetter(filterEventsByTag(curEvents, newPickedTagsList));
    }

    event.target.selectedIndex = 0;
  };

  const onTagCloseButton = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tagname: string
  ) : void => {
    event.stopPropagation();
    const curListOfPickedTags = listOfPickedTags.filter((e) => e !== tagname);
    setListOfPickedTags(curListOfPickedTags);
    setListOfAllTags((listOfAllTags) => [...listOfAllTags, tagname]);

    if (eventNameFilter===""){
      props.eventsSetter(filterEventsByTag(events, curListOfPickedTags));
    } else {
      let curEvents = filterEventsByEventname(events, eventNameFilter);
      props.eventsSetter(filterEventsByTag(curEvents, curListOfPickedTags));
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Search event by name:</Form.Label>
            <Form.Control
              as="input"
              size="sm"
              placeholder="eventname"
              onChange={onEventName}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Filter events by tags:</Form.Label>
            {listOfAllTags.length > 0 ? (
              <Selector
                onpick={onTagPick}
                list={listOfAllTags}
                defaultOptionText="Pick a tag you like"
              />
            ) : (
              <Form.Control
                as="input"
                size="sm"
                readOnly={true}
                value="List of available tags is empty"
              />
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <ShowTags
          listOfPickedTags={listOfPickedTags}
          onCloseButtonClick={onTagCloseButton}
        />
      </Row>

    </Container>
  )
}