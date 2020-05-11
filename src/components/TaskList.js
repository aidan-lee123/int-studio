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
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState();
  const [userDegree, setUserDegree] = useState();
  const [userBio, setUserBio] = useState();
  const [userPoints, setUserPoints] = useState();


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
    const user = API.get("tasks", `/users/${task.userName}`).then((res) => {return res});
    return user;
  }


  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}/view`}>
          <Card className={classes.profile}>
          <CardActionArea>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar}/> 
              <CardContent>
                  {console.log(loadUser(task))}
                <Typography gutterBottom variant="h4" component="h2">
                  {task.title}
                </Typography>

                <Typography variant="body1" color="textSecondary" component="p">
                  {"Created: " + new Date(task.createdAt).toLocaleString()} 
                </Typography>

                <Chip className={classes.points} label={"Points: " + task.points} />

              </CardContent>
            </CardActionArea>
            </Card>

        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/tasks/new">
          <Card className={classes.profile}>
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
      <div className="tasks">
        <PageHeader>All Tasks</PageHeader>
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