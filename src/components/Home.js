import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";



export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const tasks = await loadTasks();

        setTasks(tasks);

        console.log("LOADED TASKS");
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadTasks() {

    return API.get("tasks", "/tasks");
    
  }

  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}`}>
          <ListGroupItem header={task.content.trim().split("\n")[0]}>
            {"Created: " + new Date(task.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/tasks/new">

          <ListGroupItem>
          {console.log("here")}
            <h4>
              <b>{"\uFF0B"}</b> Create a new task
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )

      
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderTasks() {
    return (
      <div className="tasks">
        <PageHeader>Your Tasks</PageHeader>
        <ListGroup>
          {!isLoading && renderTasksList(tasks)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderTasks() : renderLander()}
    </div>
  );
}