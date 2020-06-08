import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./NewTask.css";
import { API } from "aws-amplify";
import { Typography } from '@material-ui/core';


export default function NewTask() {
  const history = useHistory();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      content.length > 0 &&
      title.length > 0 
      );
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
  
      await createTask({ content, title });
      history.push("/tasks");
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
  
  return (
    <div className="NewTask">
      <form onSubmit={handleSubmit}>
      <Typography variant='h4' style={{color: 'white'}}>
        Task Header
      </Typography>
      <FormGroup controlId="title">
          <FormControl
            placeholder="Enter Title"
            value={title}
            componentClass="textarea"
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>

        <Typography variant='h4' style={{color: 'white'}}>
          Task Description
        </Typography>
        <FormGroup controlId="content">
          <FormControl
            placeholder="Enter Description"
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Post Task
        </LoaderButton>
      </form>
    </div>
  );
}