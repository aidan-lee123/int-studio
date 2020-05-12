import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';


import "./ViewTask.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
  },
  profile: {
    padding: theme.spacing(2),
    height: '100%',
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
}));

export default function ViewTask() {
    const classes = useStyles();
    const { userId } = useParams();
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState(null);
    const [user, setUser] = useState(null);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [points, setPoints] = useState();
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
        setUser(user);

        setName(user[2].Value);
        setDegree(user[3].Value);
        setPoints(user[4].Value);

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
  
  return (
    <div>
      {tasks && (
      <Grid container className={classes.root} spacing={2} justify="center" alignItems="center">
        <Grid item xs>
          <Card className={classes.profile}>

            <Avatar alt={name} src="/static/images/avatar/1.jpg" className={classes.avatar}/> 

            <CardContent>

              <Typography gutterBottom variant="h4" component="h2">
                {name}
              </Typography>

              <Typography variant="body1" color="textSecondary" component="p">
                {degree}
              </Typography>

              <Chip className={classes.points} label={"Points: " + points} />

            </CardContent>

          </Card>
        </Grid>

        
        <Grid item xs>
          <Container className={classes.task}>

            <Typography gutterBottom variant="h1" component="h2">
              {title}
            </Typography>

            <Typography variant="body" color="textSecondary" component="p">
              {content}
            </Typography>

            <Chip className={classes.points} label={"Points: " + points} />

          </Container>
        </Grid>

      </Grid>
      )}
    </div>
  );
}