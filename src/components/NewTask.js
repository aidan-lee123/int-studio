import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./NewTask.css";
import { API } from "aws-amplify";
import { Slider, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';


export default function NewTask() {
  const history = useHistory();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(Date.now());

  function validateForm() {
    return (
      content.length > 0 &&
      title.length > 0 
      );
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
  
      await createTask({ content, title, points, selectedDate });
      history.push("/tasks");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createTask(task) {
    return API.post("tasks", "/tasks", {
      body: task
    });
  }

  const handleSliderChange = (event, newValue) => {
    setPoints(newValue);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="NewTask">
      <form onSubmit={handleSubmit}>
      <Typography variant='h4' style={{color: 'white'}}>
        Task Header
      </Typography>
      <FormGroup controlId="title">
          <FormControl
            placeholder="Enter Title"
            value={title}
            componentClass="textarea"
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>

        <Typography variant='h4' style={{color: 'white'}}>
          Task Description
        </Typography>
        <FormGroup controlId="content">
          <FormControl
            placeholder="Enter Description"
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        {/*
        <Grid container spacing={100}>

          <div className="date">
              <Typography id="range-slider" gutterBottom variant='h4' style={{color: 'white'}}>
                Availability
              </Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <DateTimePicker
                  autoOk
                  disablePast
                  variant="static"
                  openTo="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  
                  />
                </MuiPickersUtilsProvider>
            </div>
            
            <div className="points">
              <Typography id="range-slider" gutterBottom variant='h4' style={{color: 'white'}}>
                Points 
              </Typography>
              <Slider
              defaultValue={0}
              value={points}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              min={1}
              max={30}
              valueLabelDisplay="auto"
              onChange={handleSliderChange}
              />
            </div>


          </Grid> */}
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Post Task
        </LoaderButton>
      </form>
    </div>
  );
}