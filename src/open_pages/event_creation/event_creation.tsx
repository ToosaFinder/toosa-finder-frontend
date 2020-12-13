import React, { RefObject, useRef, useState } from "react";
import {
  Alert,
  Card,
  Form,
  FormControl,
  OverlayTrigger,
  Row,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import styles from "../../css/eventCreation.module.css";
import locationIcon from "../locationicon.png";
import "react-datetime/css/react-datetime.css";
import ValidDateTimePicker from "../../utils/ValidDateTimePicker";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import { Coordinates, ErrorBody } from "../../utils/interfaces";
import { useHistory } from "react-router-dom";
import Map from "./map";
import {
  createEvent,
  getLocationName,
  getPopularTags,
  whoAmI,
} from "../../utils/event_utils/eventCommunicator";
import moment, { Moment } from "moment";
import { ShowTags } from "../../utils/tag_utils/show_tag";
import { Selector } from "../../utils/selector";
import Marker from "../../utils/marker";

export default function EventCreation(): JSX.Element {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number>(50);
  const [date, setDate] = useState<Date>(new Date());
  const [isDateCorrect, setDateCorrectness] = useState<boolean>(true);
  const [listOfPickedTags, setListOfPickedTags] = useState<string[]>([]);
  const [listOfPopularTags, setListOfPopularTags] = useState<string[]>([]);
  const [
    listOfPopularTagsForChecking,
    setListOfPopularTagsForChecking,
  ] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [isTagEditVisible, setTagEditVisibility] = useState<boolean>(false);
  const [tagNameToEdit, setTagToEdit] = useState<string>("");
  const [chosenTagNameToEdit, setChosenTagNameToEdit] = useState<string>("");
  const [isTagAddingVisible, setTagAddingVisibility] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisibility] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("danger");

  const [isEventCancelAlertVisible, setEventCancelAlertVisibility] = useState<
    boolean
  >(false);
  const [isSuccessfulAlertVisible, setSuccessfulAlertVisibility] = useState<
    boolean
  >(false);
  const [isMapVisible, setMapVisibility] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("Where?");

  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 54.843417,
    lng: 83.090425,
  });

  const [curLat, setLat] = useState<number>(54.843417);
  const [curLng, setLng] = useState<number>(83.090425);

  const enableAlert = (message: string, alertVariant: string): void => {
    setAlertMsg(message);
    setAlertVariant(alertVariant);
    setAlertVisibility(true);
  };

  const defaultLocation: Coordinates = coordinates;

  const history = useHistory();

  const onSwitchAction = (): void => {
    setIsPublic(!isPublic);
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    console.log(event.target.value);
  };

  const onDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDescription(event.target.value);
  };

  const onSliderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const num: string = event.target.value;
    let numb: number;
    switch (num) {
      case "1":
        numb = 10;
        break;
      case "2":
        numb = 20;
        break;
      case "3":
        numb = 50;
        break;
      case "4":
        numb = 100;
        break;
    }
    setSize(numb);
  };

  const onDateClose = (date: Moment | string): void => {
    if (typeof date === "string") {
      enableAlert("Invalid date input! Please pick valid date ;)", "warning");
      setDateCorrectness(false);
    } else {
      const today = moment().subtract(0, "day");
      if (date.isBefore(today)) {
        enableAlert(
          "This date is from past. Please pick valid date ;)",
          "warning"
        );
        setDateCorrectness(false);
      } else {
        setDate((date as Moment).toDate());
        setDateCorrectness(true);
      }
    }
  };
  const onMapClick = (obj): void => {
    setLat(obj.lat);
    setLng(obj.lng);

    getLocationName({ lat: obj.lat, lng: obj.lng }).then((res) => {
      if (typeof res === "string") {
        setLocationName(res);
      } else {
        const { error } = res as ErrorBody;
        enableAlert(error, "danger");
      }
    });
    setCoordinates({ lat: obj.lat, lng: obj.lng });
  };

  const onTagAddingButton = (): void => {
    if (!isTagAddingVisible) {
      setMapVisibility(false);
      setTagEditVisibility(false);
      getPopularTags().then((resp) => {
        if (typeof resp === "string") {
          setListOfPopularTags([]);
          setListOfPopularTagsForChecking([]);
          enableAlert("Unable to download popular tags: " + resp, "danger");
        } else {
          let tags: string[] = resp as string[];
          setListOfPopularTagsForChecking(tags.slice());
          tags = tags.filter(
            (tag: string) =>
              !listOfPopularTags.includes(tag) &&
              !listOfPickedTags.includes(tag)
          );
          setListOfPopularTags(listOfPopularTags.concat(tags));
        }
      });
    }
    setTagAddingVisibility(!isTagAddingVisible);
  };

  const onLocationClick = (): void => {
    if (!isMapVisible) {
      setTagAddingVisibility(false);
      setTagEditVisibility(false);
    }
    setMapVisibility(!isMapVisible);
  };

  const pickPopularTag = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const str: string = event.target.value;

    if (str === "state") {
      return;
    }
    if (!listOfPickedTags.includes(str))
      setListOfPickedTags((listOfPickedTags) => [...listOfPickedTags, str]);
    setListOfPopularTags(listOfPopularTags.filter((el) => el !== str));

    event.target.selectedIndex = 0;
  };

  const onTagClose = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tagname: string
  ): void => {
    event.stopPropagation();
    setListOfPickedTags(listOfPickedTags.filter((e) => e !== tagname));
    if (listOfPopularTagsForChecking.includes(tagname))
      setListOfPopularTags((listOfTags) => [...listOfTags, tagname]);
  };

  const editTag = (tagName: string): void => {
    if (!isTagEditVisible) {
      setTagAddingVisibility(false);
      setMapVisibility(false);
    }
    setTagEditVisibility(true);
    setTagToEdit(tagName);
    setChosenTagNameToEdit(tagName);
  };

  const createNewTag = (): void => {
    if (newTag.length === 0) {
      enableAlert("It is impossible to create empty tag ;d", "warning");
    } else if (newTag.length > 30) {
      enableAlert(
        "Tag name shouldn't contain more than 30 symbols!",
        "warning"
      );
    } else if (listOfPickedTags.includes(newTag)) {
      enableAlert("You already picked the tag", "warning");
    } else if (listOfPopularTags.includes(newTag)) {
      enableAlert(
        "This tag already exists in popular tags, you can pick it from popular list",
        "warning"
      );
    } else {
      setListOfPickedTags([...listOfPickedTags, newTag]);
    }
    refToTagInputField.current.value = "";
    setNewTag("");
  };

  const refToTagInputField: RefObject<HTMLInputElement> = useRef<
    HTMLInputElement
  >(null);

  const onTagEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTagToEdit(event.target.value);
  };

  const saveTagNameChanges = (): void => {
    const listOfPickedTagsCopy: string[] = listOfPickedTags.slice();
    const index: number = listOfPickedTagsCopy.indexOf(chosenTagNameToEdit);
    if (index > -1) {
      listOfPickedTagsCopy.splice(index, 1, tagNameToEdit);
      setListOfPickedTags(listOfPickedTagsCopy);
    }
    setChosenTagNameToEdit("");
    setTagToEdit("");
    setTagEditVisibility(false);
  };

  const onTagEditCancelButton = (): void => {
    setTagToEdit("");
    setChosenTagNameToEdit("");
    setTagEditVisibility(false);
  };

  const onEventCreationCancel = (): void => {
    setEventCancelAlertVisibility(true);
  };

  const onEventCreation = (): void => {
    if (!isDateCorrect) {
      enableAlert("Please pick valid date before create event", "warning");
    } else if (name === "" || description === "" || locationName === "Where?")
      enableAlert(
        "Fields Name, Description, Location(Where?) are mandatory. Please fulfill them all!",
        "warning"
      );
    else {
      whoAmI()
        .then((res: string) => {
          return {
            name: name,
            creator: res,
            description: description,
            address: locationName,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            participantsLimit: size,
            startTime: date,
            isPublic: isPublic,
            tags: listOfPickedTags,
          };
        })
        .then(createEvent)
        .then((result: boolean | string) => {
          if (result === true) {
            setSuccessfulAlertVisibility(true);
          } else {
            enableAlert(
              ("Event has not been created due to: " + result) as string,
              "danger"
            );
          }
        });
    }
  };

  const popover: JSX.Element = (
    <Popover id="addTagPopover-basic" style={{ marginLeft: `10px` }}>
      <Popover.Content>
        <Popover.Title as="h3">Popular tags:</Popover.Title>
        <Form.Group className={styles.createTagForm}>
          {listOfPopularTags.length > 0 ? (
            <Selector
              onpick={pickPopularTag}
              list={listOfPopularTags}
              defaultOptionText="Pick a tag you like"
            />
          ) : (
            <Card body>List of available tags is empty</Card>
          )}
        </Form.Group>
      </Popover.Content>

      <Popover.Content>
        <Popover.Title as="h3">Create your tag</Popover.Title>
        <Form.Group controlId="tagCreation" className={styles.pickTagForm}>
          <FormControl
            placeholder="Type tag name"
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
            ref={refToTagInputField}
          />
          <Form.Text className="text-muted">Tag name must be unique</Form.Text>
          <Button
            className={styles.createTagButton}
            variant="primary"
            onClick={createNewTag}
          >
            Create tag
          </Button>
        </Form.Group>
      </Popover.Content>
    </Popover>
  );

  const onEventHasBeenCreated = (): void => {
    setSuccessfulAlertVisibility(false);
    history.push("/");
  };

  return (
    <Container className={styles.mainContainer}>
      <Alert
        variant={alertVariant}
        show={isAlertVisible}
        onClose={() => {
          setAlertVisibility(false);
          setAlertMsg("");
        }}
        dismissible
      >
        <p>{alertMsg}</p>
      </Alert>

      <Alert
        variant="secondary"
        show={isEventCancelAlertVisible}
        dismissible={false}
      >
        <p>Are you sure you want to cancel event creation?</p>
        <Button
          variant="info"
          onClick={() => {
            setEventCancelAlertVisibility(false);
            history.goBack();
          }}
        >
          Yes
        </Button>{" "}
        <Button
          variant="info"
          onClick={() => setEventCancelAlertVisibility(false)}
        >
          No
        </Button>{" "}
      </Alert>

      <Alert
        variant="success"
        dismissible={false}
        show={isSuccessfulAlertVisible}
      >
        <p>Your event has been succesfully created!</p>
        <Button variant="dark" onClick={onEventHasBeenCreated}>
          Cool!
        </Button>
      </Alert>

      <h2 className={styles.pageHeader}>Event creation</h2>
      <Container className={styles.eventCreationContainer}>
        {isTagEditVisible && (
          <Form.Group className={styles.tagEditForm}>
            <Form.Label>Edit tag name here:</Form.Label>
            <Form.Control
              as="input"
              value={tagNameToEdit}
              onChange={onTagEdit}
            />
            <div className={styles.tagEditButtonsContainer}>
              <Button variant="success" onClick={saveTagNameChanges}>
                Save
              </Button>
              <Button
                variant="danger"
                className={styles.cb}
                onClick={onTagEditCancelButton}
              >
                Cancel
              </Button>
            </div>
          </Form.Group>
        )}

        <Col className={styles.eventCreationForm} md={{ span: 4 }}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Your awesome event"
              onChange={onNameChange}
              value={name}
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Tell us interesting information about your event"
              onChange={onDescriptionChange}
            />
          </Form.Group>

          <Form.Group controlId="Tags">
            <Form.Label>Tags</Form.Label>
            {listOfPickedTags.length > 0 ? (
              <>
                <ShowTags
                  listOfPickedTags={listOfPickedTags}
                  onTextualButtonClick={editTag}
                  onCloseButtonClick={onTagClose}
                />
                <Col lg={{ span: 1, offset: 10 }}>
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={popover}
                    show={isTagAddingVisible}
                  >
                    <Button
                      className={[
                        styles.tagCrossButton,
                        styles.enlargingEffect,
                      ].join(" ")}
                      onClick={onTagAddingButton}
                    >
                      &#43;
                    </Button>
                  </OverlayTrigger>
                </Col>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={{ span: 6 }}>
                    <span className={styles.tagPromptText}>
                      Click <strong>+</strong> to add tag
                    </span>
                  </Col>
                  <Col lg={{ span: 1, offset: 4 }}>
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      overlay={popover}
                      show={isTagAddingVisible}
                    >
                      <Button
                        className={[
                          styles.tagCrossButton,
                          styles.enlargingEffect,
                        ].join(" ")}
                        onClick={onTagAddingButton}
                      >
                        &#43;
                      </Button>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="slider">
            <Form.Label>Size</Form.Label>
            <Form.Control
              as="input"
              id="myinput"
              type="range"
              min={1}
              max={4}
              step={1}
              list="ticks"
              onChange={onSliderChange}
            />
            <datalist id="ticks" className={styles.datalist}>
              <option className={styles.option} value="1" label="S">
                S
              </option>
              <option className={styles.option} value="2" label="M">
                M
              </option>
              <option className={styles.option} value="3" label="L">
                L
              </option>
              <option className={styles.option} value="4" label="XL+">
                XL+
              </option>
            </datalist>
          </Form.Group>

          <Row>
            <Col md={{ span: 10 }}>
              <Form.Control
                as="textarea"
                value={locationName}
                readOnly={true}
                style={{ height: `120px` }}
              />
            </Col>
            <Col md={{ span: 1 }}>
              <Image
                className={styles.enlargingEffect}
                src={locationIcon}
                alt="locationIcon"
                onClick={onLocationClick}
                style={{ cursor: "pointer" }}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={{ span: 10 }}>
              <Form.Label>Date</Form.Label>
              <ValidDateTimePicker onClose={onDateClose} initDate={date} />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={{ span: 10 }}>
              <Form.Switch
                onChange={onSwitchAction}
                id="custom-switch"
                label="Public"
                checked={isPublic}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={3}>
              <Button variant="success" onClick={onEventCreation}>
                Create
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="danger" onClick={onEventCreationCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Col>

        <Map
          show={isMapVisible}
          defaultLocation={defaultLocation}
          onMapClick={onMapClick}
          style={{ height: `600px`, width: `600px`, marginLeft: `25px` }}
        >
          <Marker lat={curLat} lng={curLng}>
            я
          </Marker>
        </Map>
      </Container>
    </Container>
  );
}
