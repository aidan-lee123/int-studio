import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";
import { makeStyles } from '@material-ui/core/styles';
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea } from "@material-ui/core";

import Grid from '@material-ui/core/Grid';

import Skeleton from '@material-ui/lab/Skeleton';

import "./ViewTask.css";

export default function ViewTask() {
    const classes = useStyles();
    const { userId } = useParams();
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState(null);



    const [name, setName] = useState("");
    const [degree, setDegree] = useState("");
    

useEffect(() => {
    async function onLoad() {
        if (!isAuthenticated) {
        return;
        }
    
        try {
        const user = await API.get("tasks",  `/tasks/${userId}/user`)
        const tasks = await loadTasks();
        console.log("LOADED TASKS");
        console.log(user);
        setTasks(tasks);

        var i;
        for(i=0; i < 5; i++){
          if(user[i].Name === "name")
            setName(user[i].Value);
          else if(user[i].Name === "custom:degree")
            setDegree(user[i].Value)
        }

        } catch (e) {
        onError(e);
        }
    
        setIsLoading(false);
    }
    
    onLoad();
    }, [isAuthenticated]);

  function loadTasks() {
      return API.get("tasks", `/tasks/${userId}/user/tasks`);
    }

    function renderTasksList(tasks) {
      return [{}].concat(tasks).map((task, i) =>
        i !== 0 ? (
  
            <Card className={classes.card}>
  
                <CardContent>
  
  
                  <Typography gutterBottom variant="h4" component="h2">
                    {task.title}
                  </Typography>
  
                  <Typography variant="body1" color="textSecondary" component="p">
                    {"Created: " + new Date(task.createdAt).toLocaleString()} 
                  </Typography>
  
                  {/*<Chip className={classes.points} label={"Points: " + task.points} /> */}
  
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

  function renderSkeleton() {
    return (  
    <>
    <Card className={classes.card}>
      <CardContent>
        <React.Fragment>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
  
        <React.Fragment>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
  
        <React.Fragment>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>

      </CardContent>
    </Card>
    </>
    )
  }

  function renderTasks() {
    return (
      <Grid container className={classes.root} spacing={2} justify="center" alignItems="center" >
        <Grid item xs>
          <Card className={classes.profile}>

            {isLoading ? (
              <Skeleton animation="wave" variant="circle" width={40} height={40} className={classes.avatar}/> 
            ) : (
              <Avatar alt={name} src="/static/images/avatar/1.jpg" className={classes.avatar}/> 
            )}
            <CardContent>

              {isLoading ? (
              <React.Fragment className={classes.name}>
                <Skeleton height={10} />
                <Skeleton height={10} style={{ marginBottom: 30 }} />
              </React.Fragment>
              ) : (
              <Typography gutterBottom variant="h4" component="h2" className={classes.name}>
                {name}
              </Typography>
              )}

              {isLoading ? (
              <React.Fragment className={classes.degree}>
                <Skeleton height={10} />
                <Skeleton height={10} style={{ marginBottom: 6 }} />
              </React.Fragment>
              ) : (
              <Typography variant="body1" color="textSecondary" component="p" className={classes.degree}>
                {degree}
              </Typography>
              )}

            </CardContent>

          </Card>
        </Grid>
        <Grid Item xs >
          <Typography variant="h3" style={{color: "white", padding: 50}}
          >Your Tasks
          </Typography>
          <Grid container className={classes.root} spacing={2}>
          {isLoading ? renderSkeleton() :(!isLoading && renderTasksList(tasks))}
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,

  },
  profile: {
    padding: theme.spacing(2),

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

    maxWidth: 320,
    minWidth: 250,
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
