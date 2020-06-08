import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./TaskList.css";
import { API } from "aws-amplify";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  card: {
    padding: theme.spacing(2),
    margin: 10,
    minWidth: 300,
    maxWidth: 350,
    minHeight: 400,
    textAlign: 'center',
    marginLeft: '10',
    marginRight: '10',
    backgroundColor: '#7fc4fd',
    borderRadius: '0',
    position: 'relative',
    
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
  },
  viewButton: {
    position: 'absolute',
    backgroundColor: '#1878da',
    borderColor: '#1878da',
    bottom: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '18px',
    color: 'white',
    borderRadius: '5px',
    padding: '5px',
  },

}));

export default function Home() {
  const classes = useStyles();
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

  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (

          <Card className={classes.card}>

              <CardContent>
                <Typography gutterBottom variant="h4" component="h2" className="title">
                  <b>{task.title}</b>
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  {task.content}
                </Typography>

                <Typography variant="body1" color="textSecondary" component="p">
                  {"Created: " + new Date(task.createdAt).toLocaleString()} 
                </Typography>

                {/*<Chip className={classes.points} label={"Points: " + task.points} />*/}

                <Link to={`/tasks/${task.taskId}/view`} className={classes.viewButton}>
                  <b>view task</b>
                </Link>
              </CardContent>


            </Card>


      ) : (
        <LinkContainer key="new" to="/tasks/new">
          <Card className={classes.card}>
            <CardActionArea>
            <h4>
              <b>{"\uFF0B"}</b> Create a new task
            </h4>
            </CardActionArea>
          </Card>
        </LinkContainer>
      )
    );
  }

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
  

  function renderTasks() {
    return (
      <div className="tasks" style={{width: '100%'}}>
        <PageHeader style={{backgroundColor: "#04082E", borderColor: "#0b0c16", color: 'white', marginLeft: 'auto', marginRight: 'auto'}}>All Tasks</PageHeader>
        <Grid container className={classes.root} spacing={2}>
          {!isLoading && renderTasksList(tasks)}
        </Grid>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderTasks() : renderLogin()}
    </div>
  );
}