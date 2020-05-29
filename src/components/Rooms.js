import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import {
  Button,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  CircularProgress,
  Fab
} from "@material-ui/core";

import { Link } from "react-router-dom";
import gql from "graphql-tag";
import uuid from "uuid/v4";
import { Query, Mutation } from "react-apollo";
import { FaPlus } from 'react-icons/fa';
import { onError } from "../libs/errorLib";

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



export default () => {
  const [currentUser, setCurrentUser] = useState();
  const [otherUserName, setOtherUserName] = useState("");

  var chats = [];
  var chatsIndex = 0;
  const userName = '1d5eeb7f-52cf-4f47-a251-20344600f2f1';

  useEffect(() => {

    async function onLoad() {
    const user = await Auth.currentAuthenticatedUser();

    setCurrentUser(user.username);

    }
    onLoad();

  }, []);


  async function getUser(id){

      const otherUser = await API.get("tasks",  `/tasks/${id}/user`)
      console.log(otherUser);

      var i;
      for(i=0; i < 7; i++){
        if(otherUser[i].Name == "name")
          setOtherUserName(otherUser[i].Value);
      }
    

  }


  function displayRoom(room){
    var res = room.id.split("+");
    var i = 0;
    var usernameIndex;
    var otherUserIndex;

    for(i = 0; i < 2; i++){
      if(res[i] == currentUser)
      {
        usernameIndex = i;
      }
    }

    switch(usernameIndex){
      case 0:
        otherUserIndex = 1;
        break;
      case 1:
        otherUserIndex = 0;
        break;
    }
    
    getUser(res[otherUserIndex]);
    console.log(otherUserName)
    var x = 0;

    console.log(res[otherUserIndex])
    console.log(chats);

    return(
      <ListItem key={res[otherUserIndex]}>
        <Button
        style={{ flex: 1, color:'white' }}
        component={Link}
        to={`/messages/${room.id}`}
        >
        <ListItemText
        style={{color:'white'}}
        primary={otherUserName}
        />
    </Button>
      </ListItem>
    )
  }
  /* THIS IS FOR TOMORROW AIDAN
    Maybe make it so that you split the name and then just display the room if it matches, after that grab the other id and fetch the user with the api, 
    dispaly the user's name as the room header and bam its essentially the same as having a databse but way worse
    
  */
  return (
    <>
      <Query query={LIST_ROOMS} fetchPolicy="cache-and-network">
        {({ data, loading, error }) => {
          if (error) return <div>{error.message}</div>;
          if (loading && !data) return <CircularProgress />;

          return (
            <List
              subheader={
                <ListSubheader component="div" style={{ flex: 1, color:'white' }}>Messages</ListSubheader>
              }
              dense
            >
              {data?.listRooms?.items.map(room => (
                 displayRoom(room)
              ))}
            </List>
          );

        }}
      </Query>
    </>
  );
};
