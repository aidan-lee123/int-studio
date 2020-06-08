import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import Logo from "../images/logo.png";
import "./Home.css";



export default function Home() {
  const { isAuthenticated } = useAppContext();


  function renderLogin() {
    return (
      <div className="lander">
        <img src={Logo} alt="Teach Other"/>
        <div>
          <Link to="/signup" className="btn btn-info btn-lg viewTasks">
            Signup
          </Link>
          <Link to="/login" className="btn btn-success btn-lg newTask">
            Login
          </Link>
        </div>
      </div>
    );
  }
  

  function renderLander() {
    return (
      <div className="lander">
        <img src={Logo} alt="Teach Other"/>
        <div>
          <Link to="/tasks/new" className="btn btn-info btn-lg viewTasks">
            <b>POST A TASK</b>
          </Link>
          <Link to="/tasks" className="btn btn-success btn-lg newTask">
            <b>SEARCH TASKS</b>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderLander() : renderLogin()}
    </div>
  );
}