import React, { useState, useContext} from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { AccountContext } from './Accounts';
import "./Login.css";

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { authenticate } = useContext(AccountContext);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }


  const onSubmit = event => {
    event.preventDefault();

    authenticate(email, password)
        .then(data => {
            console.log('Logged in!', data);
        })
        .catch(err => {
            console.error('Failed to login!', err);
        })
  };

  return (
    <div className="Login">
      <form onSubmit={onSubmit}>
      <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
        </form>
    </div>
  );
};