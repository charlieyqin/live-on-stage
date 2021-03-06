'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _liveOnStage = require('./live-on-stage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OnStage = function (_React$Component) {
  _inherits(OnStage, _React$Component);

  function OnStage() {
    _classCallCheck(this, OnStage);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  OnStage.prototype.componentDidMount = function componentDidMount() {
    if (this.props.isTracking === true || this.props.isTracking === undefined) {
      this.startTrackingPosition();
    }
  };

  OnStage.prototype.componentWillUnmount = function componentWillUnmount() {
    this.stopTrackingPosition();
  };

  OnStage.prototype.componentDidReceiveProps = function componentDidReceiveProps(nextProps) {
    // If we're stopping tracking
    if (this.props.isTracking && !nextProps.isTracking) {
      this.stopTrackingPosition();
    } else {
      this.stopTrackingPosition();
      this.startTrackingPosition(nextProps);
    }
  };

  OnStage.prototype.startTrackingPosition = function startTrackingPosition() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

    this.trackId = (0, _liveOnStage.startTrackingElement)(_reactDom2.default.findDOMNode(this), props);
  };

  OnStage.prototype.stopTrackingPosition = function stopTrackingPosition() {
    if (typeof this.trackId !== 'undefined') {
      (0, _liveOnStage.stopTrackingElement)(this.trackId);
    }
  };

  OnStage.prototype.render = function render() {
    return this.props.children;
  };

  return OnStage;
}(_react2.default.Component);

exports.default = OnStage;