import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify, { Auth } from "aws-amplify";
import config from './config';
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
import AppSyncConfig from "./aws-exports";
import AWSAppSyncClient from "aws-appsync";

Amplify.configure(AppSyncConfig);

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "tasks",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  },
});

const client = new AWSAppSyncClient({
  url: "https://s2gy3jxkqfhehmewutajksjcam.appsync-api.ap-southeast-2.amazonaws.com/graphql",
  region: "ap-southeast-2",
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    credentials: () => Auth.currentCredentials(),
    jwtToken: async () =>
      (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  complexObjectsCredentials: () => Auth.currentCredentials()
});


ReactDOM.render(
    <Router>
      <ApolloProvider client={client}>
        <Rehydrated> 
          <App />
        </Rehydrated>
      </ApolloProvider>
    </Router>,
    document.getElementById('root')
  );
  


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
