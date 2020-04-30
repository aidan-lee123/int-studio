import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";


import Signup from './components/Signup';
import Login from './components/Login';

import NewTask from './components/NewTask';
import Tasks from "./components/Tasks";



export default function Routes() {
  return (


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

        <Route exact path="/tasks/new">
          <NewTask />
        </Route>

        <Route exact path="/tasks/:id">
          <Tasks />
        </Route>


        {/* Finally, catch all unmatched routes */}
        <Route>
          <NotFound />
        </Route>

      </Switch>

  );
}
