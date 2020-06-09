import { GiftedChat, InputToolbar, Send} from "react-web-gifted-chat";
import React, { useEffect, useState }from "react";
import {Auth} from 'aws-amplify'
import "./Chat.css";
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {FiHelpCircle} from 'react-icons/fi'
import {IoMdArrowRoundBack} from 'react-icons/io'
import {GoFileMedia} from 'react-icons/go'
import {GoDeviceCameraVideo} from 'react-icons/go'
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton';

const customInputToolbar = props => {
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

const customSend = props => {
  return (
    <Send 
      {...props}
      containerStyle={{
        marginTop: 20,
      }}
    />
  )
}



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


  const skeleton = (

    <div style={styles.container}>
      <Link style={styles.backContainer}>
        <IoMdArrowRoundBack style={styles.back} />
      </Link>

      <div style={styles.header}>

        <Skeleton animation="wave" variant="circle" width={40} height={40} style={styles.avatar}/> 
        <Skeleton animation="wave" />
      </div>
    </div>
  )

  const { loading, error, data, user } = props;
  if (error) return <div>{error.message}</div>;
  if (loading) return <skeleton />;

  console.log(props.user);

  function getContent(str){
    const content = str.split("+");
    return content[0];
  }

  
  function getUser(str){
    const content = str.split("+");
    if(content[0] === props.user){
      return content[0];
    }
    else if(content[1] === props.user){
      return content[1];
    }

    return 'error';
  }

  const toggleDrawer = (open) => (event) => {
    setDrawerState(open)
  }

  const drawerInfo = (
    <div style={styles.drawer}>
      <Grid 
        container 
        direction="column"
        justify="center"
        alignItems="center"
        style={styles.grid}>
        <Grid item style={styles.gridItem}>
            Grid 1
        </Grid>
        <Grid item style={styles.gridItem}>
            Grid 2
        </Grid>
      </Grid>
    </div>
  )

  const messages = data.getRoom.messages.items;
  return (
    <div style={styles.container}>
      <Link to="/messages" style={styles.backContainer}>
        <IoMdArrowRoundBack style={styles.back} />
      </Link>

      <div style={styles.header}>

        <Avatar alt={'Nathan Palma'} src="/static/images/avatar/1.jpg" className={styles.avatar}/> 
        <Typography variant={'h4'} style={styles.name}>
          Nathan Palma
        </Typography>
      </div>
      <GiftedChat
        style={styles.chat}
        messages={messages.map(m => ({
          id: m.id,
          text: getContent(m.content),
          createdAt: new Date(m.when),
          user: {
            id: getUser(m.content),
            name: "Nathan"
          }
        }))}
        onSend={messages => onSend(messages)}
        renderInputToolbar={props => customInputToolbar(props)}
        renderSend={props => customSend(props)}

        user={{
          id: user
        }}
      />
      <FiHelpCircle 
        style={styles.help}
        onClick={toggleDrawer(true)}
      />
      <GoFileMedia 
        style={styles.media}
      />
      <GoDeviceCameraVideo 
        style={styles.video}
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
    height: "80vh",
    backgroundColor:"#04082e",
  },
  chat: {
    overflow: 'auto'
  },
  backContainer: {
    position: 'absolute',
    left: '15%',
    top: '10%',
  },
  back: {
    color: 'white',
    fontSize: '40px',
    cursor: 'pointer'
  },
  grid: {

  },
  gridItem: {
    minWidth: "100%",
    borderBottom: "2px solid #f0f0f0",
    boxShadow: '0px 6px 3px -1px rgba(0,0,0,0.1)',
    marginBottom: 10,
    paddingTop: 50,
    minHeight: "200px",
  },
  help: {
    position: 'absolute',
    color: 'white',
    right: '29%',
    bottom: '6%',
    fontSize: '40px',
    cursor: 'pointer'
  },
  media: {
    position: 'absolute',
    color: 'white',
    right: '26%',
    bottom: '6%',
    fontSize: '40px',
    cursor: 'pointer'
  },
  video: {
    position: 'absolute',
    color: 'white',
    right: '23%',
    bottom: '6%',
    fontSize: '40px',
    cursor: 'pointer'
  },
  drawer: {
    width: '400px'
  },
  header: {
    width: '100%',
    maxHeight: '70px',
    backgroundColor: 'white',
    padding: '10px',
    display: 'flex',
  },
  avatar: {
    scale: '1.3'
  },
  name: {
    padding: '10px 0',
    textAlign: 'center',
    marginLeft: 50,
    width: '20%'
  }
};
