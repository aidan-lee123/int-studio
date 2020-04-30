import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API, Auth } from "aws-amplify";



export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();


  async function getUserInfo() {

  }
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
    getUserName();
    return API.get("tasks", "/tasks");
    
    
  }

  //This is the current user name lol
  async function getUserName() {
    const currentUserInfo = await Auth.currentUserInfo()
    const userNameTemp = currentUserInfo.attributes['name']
    setUserInfo(userNameTemp);
  }


  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}`}>
          <ListGroupItem header={task.content.trim().split("\n")[0]}>
            {"Created: " + new Date(task.createdAt).toLocaleString()} 
            <br />
            {"User: " + userInfo}
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