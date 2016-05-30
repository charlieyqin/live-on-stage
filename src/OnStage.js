import React from 'react';
import ReactDOM from 'react-dom';
import { startTrackingElement, stopTrackingElement } from './live-on-stage';

class OnStage extends React.Component {
  componentDidMount() {
    this.trackId = startTrackingElement(ReactDOM.findDOMNode(this), this.props);
  }

  componentWillUnmount() {
    stopTrackingElement(this.trackId);
  }

  render() {
    return this.props.children;
  }
}

export default OnStage;
