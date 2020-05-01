import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";

import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Tasks.css";
import { s3Upload } from "../libs/awsLib";


export default function ViewTask() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [task, setTask] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    

  useEffect(() => {
    function loadTask() {
      return API.get("tasks", `/tasks/${id}`);
    }

    async function onLoad() {
      try {
        const task = await loadTask();
        const { content, attachment } = task;

        if (attachment) {
          task.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
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
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  function saveTask(task) {
    return API.put("tasks", `/tasks/${id}`, {
      body: task
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveTask({
        content,
        attachment: attachment || task.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
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
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {task.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={task.attachmentURL}
                >
                  {formatFilename(task.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!task.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
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