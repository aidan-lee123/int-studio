import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewTask.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import { Slider, Typography } from '@material-ui/core';



export default function NewTask() {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createTask({ content, title, points });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createTask(task) {
    return API.post("tasks", "/tasks", {
      body: task
    });
  }

  const handleSliderChange = (event, newValue) => {
    setPoints(newValue);
  };

  return (
    <div className="NewTask">
      <form onSubmit={handleSubmit}>
      <FormGroup controlId="title">
          <FormControl
            placeholder="Enter Title"
            value={title}
            componentClass="textarea"
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="content">
          <FormControl
            placeholder="Enter Description"
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        
        <Typography id="range-slider" gutterBottom>
          Points 
        </Typography>

        <Slider
        defaultValue={0}
        value={points}
        aria-labelledby="discrete-slider-small-steps"
        step={1}
        min={0}
        max={30}
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        />

        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}