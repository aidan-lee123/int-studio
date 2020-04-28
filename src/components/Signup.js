import React, {useState } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import UserPool from '../UserPool';


export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const onSubmit = event => {
    event.preventDefault();

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) console.error(err);
      console.log(data);
    });
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
          Signup
        </Button>
        </form>
    </div>
  );
};