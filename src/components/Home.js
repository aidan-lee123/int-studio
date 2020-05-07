import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API, Auth } from "aws-amplify";




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
        console.log("LOADED TASKS");
        setTasks(tasks);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadTasks() {

    return API.get("tasks", "/tasks/all");
    
    
  }

  function loadUser(task){
    return API.get("tasks", `/users/${task.userName}`)
  }


  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}/view`}>
          <ListGroupItem header={task.title.trim().split("\n")[0]}>
            {"Created: " + new Date(task.createdAt).toLocaleString()} 
            <br />
            {"User: " + task.userName}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/tasks/new">
          <ListGroupItem>
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
        <h1>Learn Together</h1>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }
  

  function renderTasks() {
    return (
      <div className="tasks">
        <PageHeader>All Tasks</PageHeader>
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