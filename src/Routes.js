import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

import { Account } from './components/Accounts';
import Signup from './components/Signup';
import Login from './components/Login';
import Status from './components/Status';


export default function Routes() {
  return (
    <Account>
      <Status />
      <Switch>
        
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/signup">
          <Signup />
        </Route>

        {/* Finally, catch all unmatched routes */}
        <Route>
          <NotFound />
        </Route>

      </Switch>
    </Account>
  );
}
