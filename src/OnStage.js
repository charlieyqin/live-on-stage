import React from 'react';
import ReactDOM from 'react-dom';
import { startTrackingElement, stopTrackingElement } from './live-on-stage';

class OnStage extends React.Component {
  componentDidMount() {
    if (this.props.isTracking === true || this.props.isTracking === undefined) {
      this.startTrackingPosition();
    }
  }

  componentWillUnmount() {
    this.stopTrackingPosition();
  }

  componentDidReceiveProps(nextProps) {
    // If we're stopping tracking
    if (this.props.isTracking && !nextProps.isTracking) {
      this.stopTrackingPosition();
    } else {
      this.stopTrackingPosition();
      this.startTrackingPosition(nextProps);
    }
  }

  startTrackingPosition(props = this.props) {
    this.trackId = startTrackingElement(ReactDOM.findDOMNode(this), props);
  }

  stopTrackingPosition() {
    if (this.trackId) {
      stopTrackingElement(this.trackId);
    }
  }

  render() {
    return this.props.children;
  }
}

export default OnStage;
