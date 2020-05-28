import React from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

export const withUser = WrappedComponent => {
  class HOC extends React.Component {
    state = {
      username: null
    };
    async componentDidMount() {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user.username);
      this.setState({
        username: user.username
      });
    }
    render() {
      const { username } = this.state;
      if (!username) return "Loading...";
      return <WrappedComponent {...this.props} username={username} />;
    }
  }

  return HOC;
};