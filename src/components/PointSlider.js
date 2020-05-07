import React from "react";
import Slider from 'react-toolbox/lib/slider';

export default class SliderTest extends React.Component {
  handleChange = (slider, value) => {
    const newState = {};
    newState[slider] = value;
    this.setState(newState);
  };

  render () {
    return (
      <section>
        <p>Normal slider</p>
        <Slider value={this.state.slider1} onChange={this.handleChange.bind(this, 'slider1')} />
      </section>
    );
  }
}