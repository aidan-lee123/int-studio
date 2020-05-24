import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import "./Profile.css";
import { API, Auth } from "aws-amplify";

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
    height: '100%',
    maxWidth: 350,
    minWidth: 300,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 0,
    height: 400,
    position: 'relative',
    marginTop: 50,
  },
  card: {
    padding: theme.spacing(2),
    backgroundColor: '#7fc4fd',
    height: '100%',
    maxWidth: 350,
    minWidth: 300,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 0,
    height: 400,
    position: 'relative',
    marginTop: 10,
  },
  task: {
    width: 800,
    height: 400,
  },
  avatar: {
    marginTop: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  name: {
    marginTop: 10,
  },
  degree: {
    marginTop: 10,
  },
  bio: {
    marginTop: 30,
  },
  title: {

    top: 10,
    color: '#2699fb',
  },
  content: {
    color: '#2699fb',

    top: 100,
  },
  points: {
    margin: '10px',
    fontSize: 12,

    bottom: 10,
    left: '45%',
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export default function Profile() {
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
        getUserInfo();
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

    return API.get("tasks", "/tasks");
    
    
  }

  //This is the current user name lol
  async function getUserInfo() {
    const currentUserInfo = await Auth.currentUserInfo()
    const name = currentUserInfo.attributes['name'];
    const degree = currentUserInfo.attributes['custom:degree'];
    const points = currentUserInfo.attributes['custom:points'];
    const bio = currentUserInfo.attributes['custom:bio'];
    setUserName(name);
    setUserDegree(degree);
    setUserBio(bio);
    setUserPoints(points);
  }

  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (

          <Card className={classes.card}>

            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar}/> 

              <CardContent>

                <Typography gutterBottom variant="h4" component="h2">
                  {task.title}
                </Typography>

                <Typography variant="body1" color="textSecondary" component="p">
                  {"Created: " + new Date(task.createdAt).toLocaleString()} 
                </Typography>

                <Chip className={classes.points} label={"Points: " + task.points} />

                <Link to={`/tasks/${task.taskId}/view`} className="btn btn-info btn-lg viewTask">
                  <b>view task</b>
                </Link>
              </CardContent>

            </Card>
      ) : (
        <LinkContainer key="new" to="/tasks/new" >

            <Card className={classes.card}>
              <CardActionArea>
                <b>{"\uFF0B"}</b> Create a new task
              </CardActionArea>
            </Card>

        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <p> Please Sign In</p>
      </div>
    );
  }

  function renderTasks() {
    return (
      <Grid container className={classes.root} spacing={2} justify="center" alignItems="center" >
        <Grid item xs>
          <Card className={classes.profile}>

            <Avatar alt={userName} src="/static/images/avatar/1.jpg" className={classes.avatar}/> 
            <CardContent>

              <Typography gutterBottom variant="h4" component="h2" className={classes.name}>
                {userName}
              </Typography>

              <Typography variant="body1" color="textSecondary" component="p" className={classes.degree}>
                {userDegree}
              </Typography>

              <Typography variant="h5" color="textSecondary" component="p" className={classes.bio}>
                {userBio}
              </Typography>

            </CardContent>

          </Card>
        </Grid>
        <Grid Item xs >
          <Typography variant="h3" style={{color: "white", padding: 50}}
          >Your Tasks
          </Typography>
          <Grid container className={classes.root} spacing={2}>
            {!isLoading && renderTasksList(tasks)}
          </Grid>
        </Grid>
      </Grid>

    );
  }

  return (
    <div className="Home">

      {isAuthenticated ? renderTasks() : renderLander()}

    </div>
  );
}