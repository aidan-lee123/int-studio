import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid'
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
  },
  profile: {
    padding: theme.spacing(2),
    margin: 20,
    maxWidth: 350,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    
  },
  task: {
    textAlign: 'center',

  },
  points: {
    margin: '10px',
    fontSize: 12,
  },
  avatar: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },  
  gridList: {
    minHeight: 400,
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  tile: {
    marginTop: 'auto',
    marginBottom: 'auto',
    background:
    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  }
}));

export default function Home() {
  const classes = useStyles();
  const { isAuthenticated } = useAppContext();


  function renderLogin() {
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
  

  function renderLander() {
    return (
      <div className="lander">
        <h1>Learn Together</h1>
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