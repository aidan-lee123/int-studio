import { GiftedChat, InputToolbar, Composer, Send} from "react-web-gifted-chat";
import React, { useEffect, useState }from "react";
import {Auth} from 'aws-amplify'
import "./Chat.css";
import Drawer from '@material-ui/core/Drawer';

import {FiHelpCircle} from 'react-icons/fi'

const customtInputToolbar = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: 'white',
        minHeight: 70,
        padding: 5,
        borderRadius: 20,
        maxWidth: '80%'
      }}
      primaryStyle={{
        margin: 5,
        maxHeight: 50,
        marginLeft: 0,
      }}
      accessoryStyle={{

      }}
    />
  );
};



export default function Chat(props) {
  const [currentUser, setCurrentUser] = useState();
  const [drawerState, setDrawerState] = useState();

  useEffect(() => { 
    props.subscribeToNewMessages();

    async function onLoad(){
      const user = await Auth.currentAuthenticatedUser();

      setCurrentUser(user);
      console.log(currentUser);
    }

    onLoad();
  }, []);


  function onSend(messages = []) {
    messages.map(m => props.onSend(m.text));
  }



  const { loading, error, data, user } = props;
  if (error) return <div>{error.message}</div>;
  if (loading) return <div>Loading</div>;

  console.log(props.user);

  function getContent(str){
    const content = str.split("+");
    return content[0];
  }

  
  function getUser(str){
    const content = str.split("+");
    if(content[0] == props.user){
      return content[0];
    }
    else if(content[1] == props.user){
      return content[1];
    }

    return 'error';
  }

  const toggleDrawer = (open) => (event) => {
    setDrawerState(open)
  }

  const drawerInfo = (
    <div style={styles.drawer}>
      HEY
    </div>
  )

  const messages = data.getRoom.messages.items;
  return (
    <div style={styles.container}>
      <GiftedChat
        messages={messages.map(m => ({
          id: m.id,
          text: getContent(m.content),
          createdAt: new Date(m.when),
          user: {
            id: getUser(m.content),
            name: getUser(m.content)
          }
        }))}
        onSend={messages => onSend(messages)}
        renderInputToolbar={props => customtInputToolbar(props)}

        user={{
          id: user
        }}
      />
      <FiHelpCircle 
        style={styles.help}
        onClick={toggleDrawer(true)}
      />

      <Drawer 
        anchor={'right'}
        open={drawerState}
        onClose={toggleDrawer(false)}
      >
        {drawerInfo}
      </Drawer>

    </div>
  );
  
}

const styles = {
  container: {
    flex: 1,
    height: "85vh",
    backgroundColor:"#04082e",
  },
  help: {
    position: 'absolute',
    color: 'white',
    right: '27%',
    bottom: '8%',
    fontSize: '40px'
  },
  drawer: {
    width: '400px'
  }
};
