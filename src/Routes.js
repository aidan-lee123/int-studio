import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";


import Signup from './components/Signup';
import Login from './components/Login';

import NewTask from './components/NewTask';
import Tasks from "./components/Tasks";
import ViewTask from './components/ViewTask';

import Profile from "./components/Profile";
import AllTasks from "./components/TaskList";

import Chat from "./components/ChatWithData";
import Rooms from './components/Rooms';

import ViewUser from "./components/ViewUser";


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

        <Route exact path="/tasks">
          <AllTasks />
        </Route>

        <Route exact path="/profile">
          <Profile />
        </Route>

        <Route exact path="/tasks/new">
          <NewTask />
        </Route>

        <Route exact path="/tasks/:id/view">
          <ViewTask />
        </Route>

        <Route exact path="/tasks/:id/edit">
          <Tasks />
        </Route>

        <Route exact path="/tasks/:userId/user">
            <ViewUser />
        </Route>

        <Route path="/messages/:roomId" component={Chat} />

        <Route exact path="/messages">
          <Rooms />
        </Route>


        {/* Finally, catch all unmatched routes */}
        <Route>
          <NotFound />
        </Route>

      </Switch>

  );
}
