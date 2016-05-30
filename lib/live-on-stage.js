'use strict';

exports.__esModule = true;
exports.stopTrackingElement = exports.startTrackingElement = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.debounce');

var _lodash4 = _interopRequireDefault(_lodash3);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elements = {};
var elementIdsToCheck = [];
var id = 0;
var numElementsToCheck = 0;
var viewport = void 0;

/**
 * Check an element's bounding box data against the latest
 * known viewport position.
 * Mutate provided object instead of returning new object
 * to prevent excessive garbage collection.
 *
 * @param  {object}
 * @return {void}
 */
function check(elementData) {
  var isOffTop = viewport.top > elementData.bottom;
  var isOffRight = viewport.right < elementData.left;
  var isOffBottom = viewport.bottom < elementData.top;
  var isOffLeft = viewport.left > elementData.right;
  var isOffScreen = isOffTop || isOffRight || isOffBottom || isOffLeft;

  // If element was off screen, and is now on screen
  if (elementData.onEnter && (elementData.isOffScreen || elementData.isOffScreen === undefined) && !isOffScreen) {
    elementData.onEnter(elementData, { isOffTop: isOffTop, isOffRight: isOffRight, isOffBottom: isOffBottom, isOffLeft: isOffLeft });

    // Or element was on screen, and is now off screen
  } else if (elementData.onLeave && !elementData.isOffScreen && isOffScreen) {
      elementData.onLeave(elementData, { isOffTop: isOffTop, isOffRight: isOffRight, isOffBottom: isOffBottom, isOffLeft: isOffLeft });
    }

  // Update element data with latest position
  elementData.isOffTop = isOffTop;
  elementData.isOffRight = isOffRight;
  elementData.isOffBottom = isOffBottom;
  elementData.isOffLeft = isOffLeft;
  elementData.isOffScreen = isOffScreen;
}

/**
 * Measure the `dom` property of provided element data object.
 * Mutate provided argument instead of returning new object
 * to prevent excessive garbage collection.
 *
 * @param  {object}
 * @return {void}
 */
function measure(elementData) {
  var _elementData$dom$getB = elementData.dom.getBoundingClientRect();

  var top = _elementData$dom$getB.top;
  var right = _elementData$dom$getB.right;
  var bottom = _elementData$dom$getB.bottom;
  var left = _elementData$dom$getB.left;
  var buffer = elementData.buffer;


  elementData.top = top + viewport.top - buffer;
  elementData.right = right + viewport.left + buffer;
  elementData.bottom = bottom + viewport.top + buffer;
  elementData.left = left + viewport.left - buffer;
}

/**
 * Check all element bounding boxes for viewport collision.
 *
 * @return {void}
 */
function checkAll() {
  viewport.update();

  for (var i = 0; i < numElementsToCheck; i++) {
    check(elements[elementIdsToCheck[i]]);
  }
}

/**
 * Measure all element bounding boxes.
 *
 * @return {void}
 */
function measureAll() {
  for (var i = 0; i < numElementsToCheck; i++) {
    measure(elements[elementIdsToCheck[i]]);
  }

  checkAll();
}

/**
 * Start tracking viewport visibility of `element`.
 * Initialise viewport and events if first call.
 *
 * @param {HTMLElement} DOM element to measure and track
 * @return {number}: ID of tracked bounding box
 */
var startTrackingElement = exports.startTrackingElement = function (element, opts) {
  // If there's no viewport, we haven't initialised
  if (!viewport) {
    viewport = new _viewport2.default();
    window.addEventListener('scroll', (0, _lodash2.default)(checkAll, 1000 / 30));
    window.addEventListener('resize', (0, _lodash4.default)(measureAll, 100));
  }

  var elementData = _extends({
    dom: element,
    buffer: 0
  }, opts);

  id++;
  numElementsToCheck++;
  elementIdsToCheck.push(id);
  elements[id] = elementData;

  measure(elementData);
  check(elementData);

  return id;
};

/**
 * Stop tracking visibility of bounding box `id`
 *
 * @param  {number}: ID of tracked bounding box
 * @return {boolean}: `true` if bounding box found and finished
 */
var stopTrackingElement = exports.stopTrackingElement = function (dataId) {
  var i = elementIdsToCheck.indexOf(dataId);

  // If element ID is found
  if (i !== -1) {
    elementIdsToCheck.splice(i, 1);
    numElementsToCheck++;
    delete elements[dataId];
    return true;
  }

  return false;
};