import React, {RefObject, useRef, useState} from "react";
import {Alert, Card, Form, FormControl, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import styles from "../../css/eventCreation.module.css";
import locationIcon from "../locationicon.png";
import "react-datetime/css/react-datetime.css";
import ValidDateTimePicker from "../../utils/ValidDateTimePicker";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import api from "../../utils/api";
import {ErrorBody, PopularTags} from "../../utils/interfaces";
import { useHistory } from "react-router-dom";
import Map from "./map";

export default function EventCreation(): JSX.Element {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number>(3);
  const [date, setDate] = useState<Date>();
  const [listOfPickedTags, setListOfPickedTags] = useState<string[]>([]);
  const [listOfTags, setListOfTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [isTagEditVisible, setTagEditVisibility] = useState<boolean>(false);
  const [tagNameToEdit, setTagToEdit] = useState<string>("");
  const [isTagAddingVisible, setTagAddingVisibility] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisibility] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("danger");

  const [isEventCancelAlertVisible, setEventCancelAlertVisibility] = useState<boolean>(false);

  const [isMapVisible, setMapVisibility] = useState<boolean>(false);

  const history = useHistory();

  const onSwitchAction = () => {
    setIsPublic(!isPublic);
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

  const onSliderChange = (event) => {
    setSize(event.target.value);
  }

  const onDateChange = (moment) => {
    setDate(moment.toDate());
  }

  const enableAlert = (message: string, alertVarinat: string) => {
    setAlertMsg(message);
    setAlertVariant(alertVarinat);
    setAlertVisibility(true);
  }



  const onTagAddingButton = (e) => {
    api()
        .getPopularTags()
        .then((resp) => {
          const {response, code} = resp;
          if (code === 200){
            let {tags} = response as PopularTags;
            tags = tags.filter((tag, index, arr) => !listOfTags.includes(tag) && !listOfPickedTags.includes(tag));
            setListOfTags(listOfTags.concat(tags));
          } else {
            const {error} = response as ErrorBody;
            setListOfTags([]);
            enableAlert("Unable to download popular tags: " + error,"danger");
          }
        });
    setTagAddingVisibility(!isTagAddingVisible);
  }

  const onLocationClick = (event) => {
    setMapVisibility(!isMapVisible);
  }

  const pickTag = (e) => {
    console.log("pickTag");
    let str = e.target.value;
    if (!listOfPickedTags.includes(str))
      setListOfPickedTags(listOfPickedTags => [...listOfPickedTags, str]);
    console.log(listOfPickedTags.join(", "));
    setListOfTags(listOfTags.filter(e => e !== str));
    console.log(listOfTags.join(", "));
  }

  const onTagClose = (event, tagname) => {
    event.stopPropagation();
    setListOfPickedTags(listOfPickedTags.filter(e => e !== tagname));
    setListOfTags(listOfTags => [...listOfTags, tagname]);
  }

  const editTag = (event, tagName) => {
    event.preventDefault();
    setTagEditVisibility(true);
    setTagToEdit(tagName);
  }

  const showTags = () => {
    return <div>
      {listOfPickedTags.map((val) =>
            {return <>
                <Button className={styles.tagButton} size={"sm"} variant={"success"} onClick={(event) => editTag(event, val)}>
                  {val}
                  <Button className={styles.tagCloseButton} variant={"danger"} size={"sm"} onClick={(event) =>{onTagClose(event, val);}}>X</Button>
                </Button>
                {' '}
            </>
            }
        )
      }
    </div>
  }

  const createNewTag = (e) => {
    e.preventDefault();
    if (newTag.length===0){
      enableAlert("It is impossible to create empty tag ;d", "warning");
    }
    else if(newTag.length>30)
      enableAlert("Tag name shouldn't contain more than 30 symbols!", "warning");
    else if(!listOfTags.includes(newTag) && !listOfPickedTags.includes(newTag))
      setListOfTags([...listOfTags, newTag]);
    else
      enableAlert("This tag already exists. Type in unique tag!", "warning");

    refToTagInputField.current.value = '';
    setNewTag("");
  }

  let refToTagInputField:RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const onChangeTest = (event) => {
    setTagToEdit(event.target.value);
  }

  const onTagEditCancelButton = (event) => {
    setTagEditVisibility(false);
  }

  const onEventCreationCancel = (event) => {
    setEventCancelAlertVisibility(true);
  }

  return (
      <Container className={styles.mainContainer}>
        <Alert
            variant={alertVariant}
            show={isAlertVisible}
            onClose={() => {setAlertVisibility(false); setAlertMsg("");}}
            dismissible
        >
          <p>{alertMsg}</p>
        </Alert>

        <Alert
            variant={"secondary"}
            show={isEventCancelAlertVisible}
            onClose={() => setEventCancelAlertVisibility(false)}
            dismissible={false}
        >
          <p>Are you sure you want to cancel?</p>
          <Button variant="info" onClick={() => {setEventCancelAlertVisibility(false); history.goBack();}}>Yes</Button>{' '}
          <Button variant="info" onClick={() => setEventCancelAlertVisibility(false)}>No</Button>{' '}
        </Alert>

        <h2 className={styles.pageHeader}>Event creation</h2>
        <Container className={styles.eventCreationContainer}>
          {isTagEditVisible?
              <Form className={styles.tagEditForm}>
                <Form.Label>Edit tag name here:</Form.Label>
                <Form.Control as={"input"} value={tagNameToEdit} onChange={onChangeTest}/>
                <div className={styles.tagEditButtonsContainer}>
                  <Button variant={"success"}>Save</Button>
                  <Button variant={"danger"} className={styles.cb} onClick={onTagEditCancelButton}>Cancel</Button>
                </div>
              </Form>
              :
              null
          }

          {/*<Col className={styles.col} md={isTagEditVisible? {span:4, offset:0} : {span: 4,offset: 4}}>*/}
          <Col className={styles.eventCreationForm} md={{span: 4}}>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                  placeholder="Your awesome event"
                  onChange={onNameChange}
              />
            </Form.Group>

            <Form.Group  controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                  as={"textarea"}
                  placeholder="Tell us interesting information about your event"
                  onChange={onDescriptionChange}
              />
            </Form.Group>

            <Form.Group controlId="Tags">
              <Form.Label>Tags</Form.Label>
              {
                listOfPickedTags.length>0?
                    <>
                      {showTags()}
                      <Col lg={{span: 1, offset: 10}}>
                        {/*<OverlayTrigger trigger={"click"} placement={"right"} overlay={addTagPopover}>*/}
                          <Button className={[styles.tagCrossButton, styles.enlargingEffect].join(' ')} onClick={onTagAddingButton}>&#43;</Button>
                        {/*</OverlayTrigger>*/}
                      </Col>
                    </>
                  :
                  <>
                    <Row>
                      <Col lg={{span:6}}>
                        <span className={styles.tagPromptText}>Click <strong>+</strong> to add tag</span>
                      </Col>
                      <Col lg={{span:1, offset: 4}}>
                        {/*<OverlayTrigger trigger={"click"} placement={"right"} overlay={addTagPopover}>*/}
                            <Button className={[styles.tagCrossButton, styles.enlargingEffect].join(' ')} onClick={onTagAddingButton}>&#43;</Button>
                        {/*</OverlayTrigger>*/}
                      </Col>
                    </Row>
                  </>
              }
            </Form.Group>

            <Form.Group controlId="slider">
              <input
                  id="myinput"
                  type="range"
                  className={styles.inputrange}
                  min="0"
                  max="3"
                  step="1"
                  list="ticks"
                  onChange={onSliderChange}
              />
              <datalist id="ticks" className={styles.datalist}>
                <option className={styles.option} value="S" label="S">S
                </option>
                <option className={styles.option} value="M" label="M">M
                </option>
                <option className={styles.option} value="L" label="L">L
                </option>
                <option className={styles.option} value="XL+" label="XL+">XL+
                </option>
              </datalist>
            </Form.Group>

            <Row>
              <Col md={{span: 10}}>
                <Form.Control placeholder={"Where?"}></Form.Control>
              </Col>
              <Col md={{span: 1}}>
                <Image
                    className={styles.enlargingEffect}
                    src={locationIcon}
                    alt="locationIcon"
                    onClick={onLocationClick}
                    style={{cursor: "pointer"}}
                />
              </Col>
            </Row>

            <Row style={{marginTop: 10}}>
              <Col md={{span: 10}}>
                <ValidDateTimePicker
                onChangeFunc={onDateChange}
                />
              </Col>
            </Row>

            <Row style={{marginTop: 10}}>
              <Col md={{span: 10}}>
                {/*<Form.Check type={"switch"} id={"custom-switch"} label={"Public"}/>*/}
                <Form.Switch
                onChange={onSwitchAction}
                id={"custom-switch"}
                label={"Public"}
                checked={isPublic}
                lg
                />
              </Col>
            </Row>

            <Row style={{marginTop: 10}}>
              <Col md={{span: 3}}>
                <Button variant="success">Create</Button>
              </Col>
              <Col md={{span: 3}}>
                <Button variant="danger" onClick={onEventCreationCancel}>Cancel</Button>
              </Col>
            </Row>

          </Form>
        </Col>
          {
            isTagAddingVisible &&
                <Col>
                  <Popover id={"addTagPopover-basic"}>

                    <Popover.Content>
                      <Popover.Title as={"h3"}>Pick some tag</Popover.Title>
                      <Form.Group className={styles.createTagForm}>
                        {listOfTags.length > 0 ?
                            <Form.Control as={"select"} size={"sm"} onClick={pickTag}>
                              {listOfTags.map((val, index) => {
                                return <option>{val}</option>
                              })}
                            </Form.Control>
                            :
                            <Card body>List of available tags is empty</Card>
                        }
                      </Form.Group>
                    </Popover.Content>

                    <Popover.Content>
                      <Popover.Title as={"h3"}>Create new tag</Popover.Title>
                      <Form.Group controlId={"tagCreation"} className={styles.pickTagForm}>
                        <FormControl placeholder={"Type tag name"} onChange={(event => {setNewTag(event.target.value);})} ref={refToTagInputField}/>
                        <Form.Text className={"text-muted"}>Tag name must be unique</Form.Text>
                        <Button className={styles.createTagButton} variant={"primary"} onClick={createNewTag}>Create tag</Button>
                      </Form.Group>
                    </Popover.Content>

                  </Popover>
                </Col>
          }

          <Map show={isMapVisible}/>

      </Container>
        </Container>
  );

}
