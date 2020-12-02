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
import {
  Coordinates,
  ErrorBody,
  EventCreationReq,
  PopularTags,
} from "../../utils/interfaces";
import { useHistory } from "react-router-dom";
import Map from "./map";
import {
  createEvent,
  getPopularTags,
  whoAmI,
} from "../../utils/eventCreationCommunicator";
import moment, { Moment } from "moment";

export default function EventCreation(): JSX.Element {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number>(3);
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

  const defaultLocation: Coordinates = coordinates;

  const history = useHistory();

  const onSwitchAction = () => {
    setIsPublic(!isPublic);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onSliderChange = (event) => {
    let num: number = event.target.value;
    switch (num) {
      case 1:
        num = 10;
        break;
      case 2:
        num = 20;
        break;
      case 3:
        num = 50;
        break;
      case 4:
        num = 100;
        break;
    }
    setSize(num);
  };

  const onDateClose = (date: Moment | string) => {
    if (typeof date === "string") {
      enableAlert("Invalid date input! Please pick valid date ;)", "warning");
      setDateCorrectness(false);
    } else {
      var today = moment().subtract(0, "day");
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

  const enableAlert = (message: string, alertVarinat: string) => {
    setAlertMsg(message);
    setAlertVariant(alertVarinat);
    setAlertVisibility(true);
  };

  const onTagAddingButton = (e) => {
    if (!isTagAddingVisible) {
      setMapVisibility(false);
      setTagEditVisibility(false);
      getPopularTags().then((resp) => {
        const { response, code } = resp;
        if (code === 200) {
          let { tags } = response as PopularTags;
          setListOfPopularTagsForChecking(tags.slice());
          tags = tags.filter(
            (tag, index, arr) =>
              !listOfPopularTags.includes(tag) &&
              !listOfPickedTags.includes(tag)
          );
          setListOfPopularTags(listOfPopularTags.concat(tags));
        } else {
          const { error } = response as ErrorBody;
          setListOfPopularTags([]);
          setListOfPopularTagsForChecking([]);
          enableAlert("Unable to download popular tags: " + error, "danger");
        }
      });
    }
    setTagAddingVisibility(!isTagAddingVisible);
  };

  const onLocationClick = () => {
    if (!isMapVisible) {
      setTagAddingVisibility(false);
      setTagEditVisibility(false);
    }
    setMapVisibility(!isMapVisible);
  };

  const pickPopularTag = (e) => {
    let str = e.target.value;
    if (!listOfPickedTags.includes(str))
      setListOfPickedTags((listOfPickedTags) => [...listOfPickedTags, str]);
    setListOfPopularTags(listOfPopularTags.filter((e) => e !== str));
  };

  const onTagClose = (event, tagname) => {
    event.stopPropagation();
    setListOfPickedTags(listOfPickedTags.filter((e) => e !== tagname));
    if (listOfPopularTagsForChecking.includes(tagname))
      setListOfPopularTags((listOfTags) => [...listOfTags, tagname]);
  };

  const editTag = (tagName) => {
    if (!isTagEditVisible) {
      setTagAddingVisibility(false);
      setMapVisibility(false);
    }
    setTagEditVisibility(true);
    setTagToEdit(tagName);
    setChosenTagNameToEdit(tagName);
  };

  const showTags = () => {
    return (
      <div>
        {listOfPickedTags.map((val) => {
          return (
            <>
              <Button
                className={styles.tagButton}
                size={"sm"}
                variant={"success"}
                onClick={(event) => editTag(val)}
              >
                {val}
                <Button
                  className={styles.tagCloseButton}
                  variant={"danger"}
                  size={"sm"}
                  onClick={(event) => {
                    onTagClose(event, val);
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

  const createNewTag = () => {
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

  let refToTagInputField: RefObject<HTMLInputElement> = useRef<
    HTMLInputElement
  >(null);

  const onTagEdit = (event) => {
    setTagToEdit(event.target.value);
  };

  const saveTagNameChanges = () => {
    let listOfPickedTagsCopy: string[] = listOfPickedTags.slice();
    let index = listOfPickedTagsCopy.indexOf(chosenTagNameToEdit);
    if (index > -1) {
      listOfPickedTagsCopy.splice(index, 1, tagNameToEdit);
      setListOfPickedTags(listOfPickedTagsCopy);
    }
    setChosenTagNameToEdit("");
    setTagToEdit("");
    setTagEditVisibility(false);
  };

  const onTagEditCancelButton = () => {
    setTagToEdit("");
    setChosenTagNameToEdit("");
    setTagEditVisibility(false);
  };

  const onEventCreationCancel = () => {
    setEventCancelAlertVisibility(true);
  };

  const onEventCreation = () => {
    if (!isDateCorrect) {
      enableAlert("Please pick valid date before create event", "warning");
    } else if (name === "" || description === "" || locationName === "Where?")
      enableAlert(
        "Fields Name, Description, Location(Where?) are mandatory. Please fulfill them all!",
        "warning"
      );
    else {
      let login = "";
      whoAmI().then((res) => {
        login = res;
      });
      let eventData: EventCreationReq = {
        name: name,
        creator: login,
        description: description,
        address: locationName,
        latitude: coordinates.lng,
        longitude: coordinates.lng,
        participantsLimit: size,
        startTime: date,
        isPublic: isPublic,
        tags: listOfPickedTags,
      };

      createEvent(eventData).then((result) => {
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

  const popover = (
    <Popover id={"addTagPopover-basic"} style={{ marginLeft: `10px` }}>
      <Popover.Content>
        <Popover.Title as={"h3"}>Popular tags:</Popover.Title>
        <Form.Group className={styles.createTagForm}>
          {listOfPopularTags.length > 0 ? (
            <Form.Control as={"select"} size={"sm"} onClick={pickPopularTag}>
              {listOfPopularTags.map((val, index) => {
                return <option>{val}</option>;
              })}
            </Form.Control>
          ) : (
            <Card body>List of available tags is empty</Card>
          )}
        </Form.Group>
      </Popover.Content>

      <Popover.Content>
        <Popover.Title as={"h3"}>Create your tag</Popover.Title>
        <Form.Group controlId={"tagCreation"} className={styles.pickTagForm}>
          <FormControl
            placeholder={"Type tag name"}
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
            ref={refToTagInputField}
          />
          <Form.Text className={"text-muted"}>
            Tag name must be unique
          </Form.Text>
          <Button
            className={styles.createTagButton}
            variant={"primary"}
            onClick={createNewTag}
          >
            Create tag
          </Button>
        </Form.Group>
      </Popover.Content>
    </Popover>
  );

  const onEventHasBeenCreated = () => {
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
        variant={"secondary"}
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
        variant={"success"}
        dismissible={false}
        show={isSuccessfulAlertVisible}
      >
        <p>Your event has been succesfully created!</p>
        <Button variant={"dark"} onClick={onEventHasBeenCreated}>
          Cool!
        </Button>
      </Alert>

      <h2 className={styles.pageHeader}>Event creation</h2>
      <Container className={styles.eventCreationContainer}>
        {isTagEditVisible && (
          <Form.Group className={styles.tagEditForm}>
            <Form.Label>Edit tag name here:</Form.Label>
            <Form.Control
              as={"input"}
              value={tagNameToEdit}
              onChange={onTagEdit}
            />
            <div className={styles.tagEditButtonsContainer}>
              <Button variant={"success"} onClick={saveTagNameChanges}>
                Save
              </Button>
              <Button
                variant={"danger"}
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
              as={"textarea"}
              placeholder="Tell us interesting information about your event"
              onChange={onDescriptionChange}
            />
          </Form.Group>

          <Form.Group controlId="Tags">
            <Form.Label>Tags</Form.Label>
            {listOfPickedTags.length > 0 ? (
              <>
                {showTags()}
                <Col lg={{ span: 1, offset: 10 }}>
                  <OverlayTrigger
                    trigger={"click"}
                    placement={"right"}
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
                      trigger={"click"}
                      placement={"right"}
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
              as={"input"}
              id={"myinput"}
              type={"range"}
              min={1}
              max={4}
              step={1}
              list={"ticks"}
              onChange={onSliderChange}
            />
            <datalist id="ticks" className={styles.datalist}>
              <option className={styles.option} value="S" label="S">
                S
              </option>
              <option className={styles.option} value="M" label="M">
                M
              </option>
              <option className={styles.option} value="L" label="L">
                L
              </option>
              <option className={styles.option} value="XL+" label="XL+">
                XL+
              </option>
            </datalist>
          </Form.Group>

          <Row>
            <Col md={{ span: 10 }}>
              <Form.Control
                as={"textarea"}
                value={locationName}
                readOnly={true}
                style={{ height: `120px` }}
              ></Form.Control>
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
                id={"custom-switch"}
                label={"Public"}
                checked={isPublic}
                lg
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={{ span: 3 }}>
              <Button variant="success" onClick={onEventCreation}>
                Create
              </Button>
            </Col>
            <Col md={{ span: 3 }}>
              <Button variant="danger" onClick={onEventCreationCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Col>

        <Map
          show={isMapVisible}
          locationSetter={setLocationName}
          alertSetter={enableAlert}
          coordinatesSetter={setCoordinates}
          defaultLocation={defaultLocation}
        />
      </Container>
    </Container>
  );
}
