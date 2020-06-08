import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";

import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { onError } from "./libs/errorLib";
import { withAuthenticator } from "aws-amplify-react";
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
  },
}))(Badge);

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }
  

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
  
    history.push("/login");
  }
  
  return (
    !isAuthenticating &&
    <div className="container">
      <Navbar inverse fluid collapseOnSelect staticTop bsStyle="default" style={{backgroundColor: "#04082E", borderColor: "#0b0c16", color: "white"}}>
        <Navbar.Header >
          <Navbar.Brand>
            <Link to="/"><p style={{color: "white"}}>Teach Other</p></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
          {isAuthenticated ? (
              <>

                  <LinkContainer to="/messages">
                    
                    <NavItem ><p style={{color: "white"}}>Messages</p></NavItem>
                  </LinkContainer>

                <LinkContainer to="/profile">
                  <NavItem><p style={{color: "white"}}>Profile</p></NavItem>
                </LinkContainer>
                <NavItem onClick={handleLogout}><p style={{color: "white"}}>Logout</p></NavItem>
              </>
            ) : (
              <>
                <LinkContainer to="/signup">
                  <NavItem><p style={{color: "white"}}>Signup</p></NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem><p style={{color: "white"}}>Login</p></NavItem>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated }}
      >
        <Routes />
      </AppContext.Provider>
    </div>
  );
  
};

export default App;