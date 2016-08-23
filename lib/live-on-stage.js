'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.measure = measure;
exports.startTrackingElement = startTrackingElement;
exports.stopTrackingElement = stopTrackingElement;

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elements = {};
var elementIdsToCheck = [];
var idCounter = 0;
var numElementsToCheck = 0;
var viewport = void 0;

/**
 * Check an element's bounding box data against the latest
 * known viewport position.
 * Mutate provided object instead of returning new object
 * to prevent excessive garbage collection.
 * @param  {object}
 * @return {void}
 */
function check(elementData) {
  var callback = void 0;

  if (elementData.onEnter || elementData.onLeave) {
    // Check if element is completely off screen
    var isOffTop = viewport.top > elementData.bottom + elementData.buffer;
    var isOffRight = viewport.right < elementData.left - elementData.buffer;
    var isOffBottom = viewport.bottom < elementData.top - elementData.buffer;
    var isOffLeft = viewport.left > elementData.right + elementData.right;
    var isOffScreen = isOffTop || isOffRight || isOffBottom || isOffLeft;

    // If element was off screen and now isn't, enter
    if (elementData.onEnter && elementData.isOffScreen && !isOffScreen) {
      callback = elementData.onEnter;

      // Or if element was on screen and now isn't, leave
    } else if (elementData.onLeave && elementData.isOffScreen === false && isOffScreen) {
      callback = elementData.onLeave;
    }

    // Update element data with latest position
    elementData.isOffTop = isOffTop;
    elementData.isOffRight = isOffRight;
    elementData.isOffBottom = isOffBottom;
    elementData.isOffLeft = isOffLeft;
    elementData.isOffScreen = isOffScreen;
  }

  if (elementData.onBeginLeave || elementData.onCompleteEnter) {
    // Check if element is completely within screen
    var isWithinTop = viewport.top <= elementData.top - elementData.buffer;
    var isWithinRight = viewport.right >= elementData.right + elementData.buffer;
    var isWithinBottom = viewport.bottom >= elementData.bottom + elementData.buffer;
    var isWithinLeft = viewport.left <= elementData.left - elementData.buffer;
    var isWithinScreen = isWithinTop && isWithinRight && isWithinBottom && isWithinLeft;
    // Or if element was within screen and now isn't, begin leave
    if (elementData.onBeginLeave && elementData.isWithinScreen && !isWithinScreen) {
      callback = elementData.onBeginLeave;

      // Or if element was not completely within screen and now is, complete enter
    } else if (elementData.onCompleteEnter && elementData.isWithinScreen === false && isWithinScreen) {
      callback = elementData.onCompleteEnter;
    }

    elementData.isWithinTop = isWithinTop;
    elementData.isWithinRight = isWithinRight;
    elementData.isWithinBottom = isWithinBottom;
    elementData.isWithinLeft = isWithinLeft;
    elementData.isWithinScreen = isWithinScreen;
  }

  if (callback) {
    callback(elementData);
  }
}

/**
 * Check new element
 * @param  {object} Element data
 * @return {void}
 */
function checkNew(elementData) {
  if (elementData.onEnter && elementData.isOffScreen === false) {
    elementData.onEnter(elementData);
  } else if (elementData.onLeave && elementData.isOffScreen === true) {
    elementData.onLeave(elementData);
  } else if (elementData.onBeginLeave && elementData.isWithinScreen === false) {
    elementData.onBeginLeave(elementData);
  } else if (elementData.onCompleteEnter && elementData.isWithinScreen === true) {
    elementData.onCompleteEnter(elementData);
  }
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
 * Measure the `dom` property of provided element data object.
 * Mutate provided argument instead of returning new object
 * to prevent excessive garbage collection.
 *
 * @param  {number}
 * @return {void}
 */
function measure(id) {
  var elementData = elements[id];

  var _elementData$dom$getB = elementData.dom.getBoundingClientRect();

  var top = _elementData$dom$getB.top;
  var right = _elementData$dom$getB.right;
  var bottom = _elementData$dom$getB.bottom;
  var left = _elementData$dom$getB.left;


  elementData.top = top + viewport.top;
  elementData.right = right + viewport.left;
  elementData.bottom = bottom + viewport.top;
  elementData.left = left + viewport.left;

  if (elementData.onMeasure) {
    elementData.onMeasure(elementData);
  }
}

/**
 * Measure all element bounding boxes.
 *
 * @return {void}
 */
function measureAll() {
  viewport.remeasure();

  for (var i = 0; i < numElementsToCheck; i++) {
    measure(elementIdsToCheck[i]);
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
function startTrackingElement(element, opts) {
  var checkNextFrame = void 0;

  // If there's no viewport, we haven't initialised
  if (!viewport) {
    viewport = new _viewport2.default();
    window.addEventListener('scroll', function () {
      if (checkNextFrame) {
        cancelAnimationFrame(checkNextFrame);
      }
      checkNextFrame = requestAnimationFrame(checkAll);
    });
    window.addEventListener('resize', (0, _lodash2.default)(measureAll, 100));
  }

  var elementData = _extends({
    dom: element,
    buffer: 0
  }, opts);

  idCounter++;
  numElementsToCheck++;
  elementIdsToCheck.push(idCounter);
  elements[idCounter] = elementData;

  measure(idCounter);
  check(elementData);
  checkNew(elementData);

  return idCounter;
}

/**
 * Stop tracking visibility of bounding box `id`
 *
 * @param  {number}: ID of tracked bounding box
 * @return {boolean}: `true` if bounding box found and finished
 */
function stopTrackingElement(id) {
  var i = elementIdsToCheck.indexOf(id);

  // If element ID is found
  if (i !== -1) {
    elementIdsToCheck.splice(i, 1);
    numElementsToCheck--;
    delete elements[id];
    return true;
  }

  return false;
}