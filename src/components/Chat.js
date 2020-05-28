import { GiftedChat } from "react-web-gifted-chat";
import React, { useEffect, useState }from "react";
import {Auth} from 'aws-amplify'

export default function Chat(props) {
  const [currentUser, setCurrentUser] = useState();

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
        user={{
          id: user
        }}
      />
    </div>
  );
  
}

const styles = {
  container: {
    flex: 1,
    height: "75vh"
  }
};
