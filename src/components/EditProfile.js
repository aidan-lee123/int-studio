import React, { useState} from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Profile.css";
import { Auth } from "aws-amplify";



export default function EditProfile() {
  const history = useHistory();
  const [bio, setBio] = useState("");

  function validateForm() {
    return (
      bio.length 
      );
  }
  async function handleSubmit(event) {
    event.preventDefault();
  
  
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        'custom:bio': bio
      })
      history.push('/profile');
    } catch (e) {
      onError(e);
    }
  }
  
  function renderBioForm() {
    return (
      <div className="EditProfile">
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="bio">
            <FormControl
              placeholder="Enter new bio"
              value={bio}
              componentClass="textarea"
              onChange={e => setBio(e.target.value)}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            disabled={!validateForm()}
          >
            Create
          </LoaderButton>
        </form>
      </div>
    );
  }

  return (
    <div className="Home">
      {renderBioForm()}
    </div>
  );
}