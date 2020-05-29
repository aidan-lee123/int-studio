import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import gql from "graphql-tag";

import { graphql, compose } from 'react-apollo'
import { listUsers, onCreateUser as OnCreateUser } from '../graphql'
import Overlay from './Overlay'

import "./ViewTask.css";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
    paddingTop: 200,
  },
  profile: {
    padding: theme.spacing(2),
    height: '100%',
    maxWidth: 350,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 0,
    height: 400,
    
  },
  task: {
    textAlign: 'left',
    position: 'relative',
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
    position: 'absolute',
    top: 10,
    color: '#2699fb',
  },
  content: {
    color: '#2699fb',
    position: 'absolute',
    top: 100,
  },
  chat: {
    margin: '10px',
    fontSize: 12,
    position: 'absolute',
    bottom: 10,
    left: '45%',
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const LIST_ROOMS = gql`
  query ListRooms {
    listRooms {
      items {
        __typename
        id
        createdAt
      }
    }
  }
`;


const CREATE_ROOM = gql`
  mutation CreateRoom($id: ID!) {
    createRoom(input: { id: $id }) {
      __typename
      id
      createdAt
    }
  }
`;

export default function ViewTask() {
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [userForConvo, setUserForConvo] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState();
  const [userId, setUserId] = useState("");

  const [degree, setDegree] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [currentUserId, setCurrentUserId] = useState();
  const [currentUser, setCurrentUser] = useState();
  
  function toggleOverlay (visible, userForConvo){
    setShowOverlay(visible);
    setUserForConvo(userForConvo);
  }

  
  function goChat (id){
    history.push(`/messages/${id}`);
  }

  useEffect(() => {
    function loadTask() {
      return API.get("tasks", `/tasks/${id}/view`);
    }

    async function onLoad() {
      try {
        const task = await loadTask();

        const { content, title, points, userName } = task;

        setContent(content);
        setTitle(title);
        setPoints(points);
        setUserId(userName);
        console.log(userName)

        const currentUser = await Auth.currentAuthenticatedUser();
        setCurrentUser(currentUser);

        const user = await API.get("tasks",  `/tasks/${userName}/user`)
        
        //const {name, degree} = user;
        console.log(user);
        setUser(user);
        setTask(task);
        
        var i;
        for(i=0; i < 7; i++){
          if(user[i].Name == "name")
            setName(user[i].Value);
          else if(user[i].Name == "custom:degree")
            setDegree(user[i].Value)
          else if(user[i].Name == "custom:bio")
            setBio(user[i].Value)
        }


      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);
  

  return (
    <div>
      {showOverlay && (
                    <Overlay
                    user={currentUser}
                    toggleOverlay={toggleOverlay}
                    goChat={goChat}
                    username={name}
                    userId={userId}

                  />
      )}
      {task && (
      <Grid container className={classes.root} spacing={2} justify="center" alignItems="center" >
        <Grid item xs>
          <Card className={classes.profile}>

            <Avatar alt={name} src="/static/images/avatar/1.jpg" className={classes.avatar}/> 
            <CardContent>

              <Typography gutterBottom variant="h4" component="h2" className={classes.name}>
                {name}
              </Typography>

              <Typography variant="body1" color="textSecondary" component="p" className={classes.degree}>
                {degree}
              </Typography>

              <Typography variant="h5" color="textSecondary" component="p" className={classes.bio}>
                {bio}
              </Typography>

            </CardContent>

            <CardActions>
            <Button
                    style={{ flex: 1 }}
                    component={Link}
                    to={`/tasks/${userId}/user`}
                  >
                    Profle
                  </Button>
            </CardActions>
          </Card>
        </Grid>

        
        <Grid item xs>
          <Container className={classes.task}>

            <Typography gutterBottom variant="h2" component="h2" className={classes.title}>
              {title}
            </Typography>

            <Typography variant="body" color="textSecondary" component="p" className={classes.content}>
              {content}
            </Typography>


            <Button 
            variant="contained" 
            color="primary" 
            className={classes.chat} 
            disableElevation
            onClick={() => toggleOverlay(true, user)}
            >
              Chat
            </Button>
          </Container>
        </Grid>

      </Grid>
      )}
    </div>
  );
}

const UsersWithData = compose(
  graphql(listUsers, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => {
      return {
        users: props.data.listUsers ? props.data.listUsers.items : [],
        subscribeToNewMessages: () => {
          props.data.subscribeToMore({
            document: OnCreateUser,
            updateQuery: (prev, { subscriptionData: { data : { onCreateUser } } }) => {
    
              let userArray = prev.listUsers.items.filter(u => u.id !== onCreateUser.id)
              userArray = [
                ...userArray,
                onCreateUser,
              ]
              console.log('userArray:' , userArray)

              return {
                ...prev,
                listUsers: {
                  ...prev.listUsers,
                  items: userArray
                }
              }
            }
          })
        },
      }
    }
  })
)(ViewTask)