import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default function Home() {
  return (
    <div className="Home">
      <div className="lander">
        <h1>Learn Together</h1>
        <p>Lorem ipsum</p>

        <LinkContainer to="/postTask">
          <Button> Post A Task </Button>
        </LinkContainer>
        <Button> Search Tasks</Button>
      </div>
    </div>
  );
}
