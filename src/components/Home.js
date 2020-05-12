import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import "./Home.css";
import { makeStyles } from '@material-ui/core/styles';


export default function Home() {
  const { isAuthenticated } = useAppContext();


  function renderLogin() {
    return (
      <div className="lander">
        <h1>Teachother</h1>
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
  

  function renderLander() {
    return (
      <div className="lander">
        <h1>Teachother</h1>
        <div>
          <Link to="/tasks" className="btn btn-info btn-lg">
            Search Tasks
          </Link>
          <Link to="/tasks/new" className="btn btn-success btn-lg">
            Create new Task
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