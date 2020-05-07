import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API} from "aws-amplify";
import { onError } from "../libs/errorLib";

import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

import "./Tasks.css";
import { Slider, Typography } from '@material-ui/core';


export default function Tasks() {
    const { id } = useParams();
    const history = useHistory();
    const [task, setTask] = useState(null);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [points, setPoints] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    

  useEffect(() => {
    function loadTask() {
      return API.get("tasks", `/tasks/${id}`);
    }

    async function onLoad() {
      try {
        const task = await loadTask();
        const { content, points, title } = task;

        setContent(content);
        setTitle(title);
        setPoints(points);
        setTask(task);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function saveTask(task) {
    return API.put("tasks", `/tasks/${id}`, {
      body: task
    });
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await saveTask({
        content,
        title,
        points
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  const handleSliderChange = (event, newValue) => {
    setPoints(newValue);
  };
  
  function deleteTask() {
    return API.del("tasks", `/tasks/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteTask();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Tasks">
      {task && (
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
        
        <Typography id="range-slider" gutterBottom variant="h3">
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
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}