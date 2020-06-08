import React, { useState } from 'react'
import { css } from 'glamor'
import { primary } from '../theme'
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag";

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



export default function Overlay(props) {
    const user = props.user;
    const currentUserId = user.username;
    const otherUserId = props.userId;
    const id = currentUserId + "+" + otherUserId;

    console.log(id);

    return (
      <div {...css(styles.container)}>
        <div {...css(styles.content)}>
          <p {...css(styles.greetingTitle)}>New Conversation</p>
          <p {...css(styles.greeting)}>Create new conversation with {props.username}?</p>
          <div {...css(styles.divider)} />
          <Mutation mutation={CREATE_ROOM}>
          {mutate => (<div {...css(styles.button)}
            onClick={() => {
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
              props.toggleOverlay(false);
              props.goChat(id);
            }}>
            <p {...css(styles.buttonTextYes)}>Yes</p>
          </div>
          )}
          </Mutation>
          <div {...css([styles.button, styles.cancel])} onClick={() => props.toggleOverlay(false)}>
            <p {...css([styles.buttonText])}>Cancel</p>
          </div>
        </div>
      </div>
    )
  }




const styles = {
  button: {
    backgroundColor: primary,
    padding: 15,
    margin: 10,
    marginTop: 0,
    cursor: 'pointer'
  },
  cancel: {
    backgroundColor: '#ededed'
  },
  divider: {
    width: 200,
    margin: '0 auto',
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, .15)',
    marginBottom: 17,
    borderRadius: 10
  },
  buttonText: {
    margin: 0,
    textAlign: 'center',
    fontWeight: 700
  },
  buttonTextYes: {
    margin: 0,
    textAlign: 'center',
    fontWeight: 700,
    color: 'white'
  },
  greetingTitle: {
    fontSize: 24,
    textAlign: 'center',
    margin: 0,
    fontWeight: 500
  },
  greeting: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: 'rgba(0, 0, 0, .55)'
  },
  container: {
    position: 'absolute',
    borderRadius: 25,
    zIndex: 1000,
    bottom: 180,
    right: 20,
    backgroundColor: 'white',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, .2)',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 300,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 720px)',
    flex: 1,
    justifyContent: 'center',
  }
}