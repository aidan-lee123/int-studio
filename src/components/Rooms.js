import React from "react";
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
                <ListSubheader component="div">List of rooms</ListSubheader>
              }
              dense
            >
              {data?.listRooms?.items.map(room => (
                <ListItem key={room.id} divider >
                  <Button
                    style={{ flex: 1, color:'white' }}
                    component={Link}
                    to={`/messages/${room.id}`}
                  >
                    <ListItemText
                      style={{color:'white'}}
                      primary={room.id}
                      secondary={`Created at ${room.createdAt}`}
                    />
                  </Button>
                </ListItem>
              ))}
            </List>
          );
        }}
      </Query>
      <Mutation mutation={CREATE_ROOM}>
        {mutate => (
          <Fab
            color="primary"
            aria-label="Add"
            style={{ position: "absolute", bottom: 10, right: 10 }}
            onClick={() => {
              const id = uuid();
              mutate({
                variables: {
                  id
                },
                optimisticResponse: () => ({
                  createRoom: {
                    __typename: "Room",
                    id,
                    createdAt: new Date()
                  }
                }),
                update: (cache, { data: { createRoom } }) => {
                  const data = cache.readQuery({ query: LIST_ROOMS });

                  data.listRooms.items = [
                    createRoom,
                    ...data.listRooms.items.filter(
                      item => item.id !== createRoom.id
                    )
                  ];

                  cache.writeQuery({ query: LIST_ROOMS, data });
                }
              });
            }}
          >
          <FaPlus />
          </Fab>
        )}
      </Mutation>
    </>
  );
};
