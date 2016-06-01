import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import Viewport from './viewport';

const elements = {};
const elementIdsToCheck = [];
let idCounter = 0;
let numElementsToCheck = 0;
let viewport;

/**
 * Check an element's bounding box data against the latest
 * known viewport position.
 * Mutate provided object instead of returning new object
 * to prevent excessive garbage collection.
 * @param  {object}
 * @return {void}
 */
function check(elementData) {
  // Check if element is completely off screen
  const isOffTop = viewport.top > elementData.bottom;
  const isOffRight = viewport.right < elementData.left;
  const isOffBottom = viewport.bottom < elementData.top;
  const isOffLeft = viewport.left > elementData.right;
  const isOffScreen = (isOffTop || isOffRight || isOffBottom || isOffLeft);

  // Check if element is completely within screen
  const isWithinTop = viewport.top >= elementData.top;
  const isWithinRight = viewport.right >= elementData.right;
  const isWithinBottom = viewport.bottom <= elementData.bottom;
  const isWithinLeft = viewport.left <= elementData.left;
  const isWithinScreen = (isWithinTop && isWithinRight && isWithinBottom & isWithinLeft);

  let callback;

  // If element was off screen and now isn't, enter
  if (elementData.onEnter && elementData.isOffScreen && !isOffScreen) {
    callback = elementData.onEnter;

  // Or if element was on screen and now isn't, leave
  } else if (elementData.onLeave && elementData.isOffScreen === false && isOffScreen) {
    callback = elementData.onLeave;

  // Or if element was within screen and now isn't, begin leave
  } else if (elementData.onBeginLeave && elementData.isWithinScreen && !isWithinScreen) {
    callback = elementData.onBeginLeave;

  // Or if element was not completely within screen and now is, complete enter
  } else if (elementData.onCompleteEnter && elementData.isWithinScreen === false && isWithinScreen) {
    callback = elementData.onCompleteEnter;
  }

  // Update element data with latest position
  elementData.isOffTop = isOffTop;
  elementData.isOffRight = isOffRight;
  elementData.isOffBottom = isOffBottom;
  elementData.isOffLeft = isOffLeft;
  elementData.isOffScreen = isOffScreen;
  elementData.isWithinTop = isWithinTop;
  elementData.isWithinRight = isWithinRight;
  elementData.isWithinBottom = isWithinBottom;
  elementData.isWithinLeft = isWithinLeft;
  elementData.isWithinScreen = isWithinScreen;

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
  if (elementData.onEnter && !elementData.isOffScreen) {
    elementData.onEnter(elementData);
  } else if (elementData.onLeave && elementData.isOffScreen) {
    elementData.onLeave(elementData);
  } else if (elementData.onBeginLeave && !elementData.isWithinScreen) {
    elementData.onBeginLeave(elementData);
  } else if (elementData.onCompleteEnter && elementData.isWithinScreen) {
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

  for (let i = 0; i < numElementsToCheck; i++) {
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
export function measure(id) {
  const elementData = elements[id];
  const { top, right, bottom, left } = elementData.dom.getBoundingClientRect();
  const { buffer } = elementData;

  elementData.top = top + viewport.top - buffer;
  elementData.right = right + viewport.left + buffer;
  elementData.bottom = bottom + viewport.top + buffer;
  elementData.left = left + viewport.left - buffer;
}

/**
 * Measure all element bounding boxes.
 *
 * @return {void}
 */
function measureAll() {
  for (let i = 0; i < numElementsToCheck; i++) {
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
export function startTrackingElement(element, opts) {
  // If there's no viewport, we haven't initialised
  if (!viewport) {
    viewport = new Viewport();
    window.addEventListener('scroll', throttle(checkAll, 1000 / 30));
    window.addEventListener('resize', debounce(measureAll, 100));
  }

  const elementData = {
    dom: element,
    buffer: 0,
    ...opts
  };

  idCounter++;
  numElementsToCheck++;
  elementIdsToCheck.push(idCounter);
  elements[idCounter] = elementData;

  measure(elementData);
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
export function stopTrackingElement(id) {
  const i = elementIdsToCheck.indexOf(id);

  // If element ID is found
  if (i !== -1) {
    elementIdsToCheck.splice(i, 1);
    numElementsToCheck--;
    delete elements[id];
    return true;
  }

  return false;
}
