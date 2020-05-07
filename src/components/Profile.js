import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import "./Profile.css";
import { API, Auth } from "aws-amplify";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid'
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
  },
  profile: {
    padding: 20,
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
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}/edit`}>
          <GridListTile header={task.content.trim().split("\n")[0]} className={classes.tile}>
          <Card className={classes.profile}>
          <CardActionArea>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar}/> 

              <CardContent>

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

            <br />

          </GridListTile>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/tasks/new" >
          <GridListTile className={classes.tile}>
            <CardActionArea>
            <Card className={classes.profile}>
              <b>{"\uFF0B"}</b> Create a new task
            </Card>
            </CardActionArea>
          </GridListTile>
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
      <Grid container className={classes.root} spacing={2} justify="center" alignItems="center">
        <Grid item xs>
          <Card className={classes.profile}>

            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar}/> 
            <CardContent>

              <Typography gutterBottom variant="h4" component="h2">
                {userName}
              </Typography>

              <Typography gutterBottom variant="h5" component="h2">
                {userDegree}
              </Typography>

              <Typography variant="body1" color="textSecondary" component="p">
                {userBio}
              </Typography>

              <Chip className={classes.points} label={"Points: " + userPoints} />

            </CardContent>

          </Card>
        </Grid> 
        <Grid Item xs >
          <PageHeader>Your Tasks</PageHeader>
          <GridList className={classes.gridList} cols={2.5}>
            {!isLoading && renderTasksList(tasks)}
          </GridList>
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