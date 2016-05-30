import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import Viewport from './viewport';

const elements = {};
const elementIdsToCheck = [];
let id = 0;
let numElementsToCheck = 0;
let viewport;

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
  const isOffTop = viewport.top > elementData.bottom;
  const isOffRight = viewport.right < elementData.left;
  const isOffBottom = viewport.bottom < elementData.top;
  const isOffLeft = viewport.left > elementData.right;
  const isOffScreen = (isOffTop || isOffRight || isOffBottom || isOffLeft);

  // If element was off screen, and is now on screen
  if (elementData.onEnter && ((elementData.isOffScreen || elementData.isOffScreen === undefined) && !isOffScreen)) {
    elementData.onEnter(elementData, { isOffTop, isOffRight, isOffBottom, isOffLeft });

  // Or element was on screen, and is now off screen
  } else if (elementData.onLeave && !elementData.isOffScreen && isOffScreen) {
    elementData.onLeave(elementData, { isOffTop, isOffRight, isOffBottom, isOffLeft });
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
  const { top, right, bottom, left } = elementData.dom.getBoundingClientRect();
  const { buffer } = elementData;

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

  for (let i = 0; i < numElementsToCheck; i++) {
    check(elements[elementIdsToCheck[i]]);
  }
}

/**
 * Measure all element bounding boxes.
 *
 * @return {void}
 */
function measureAll() {
  for (let i = 0; i < numElementsToCheck; i++) {
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
export const startTrackingElement = (element, opts) => {
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
export const stopTrackingElement = (dataId) => {
  const i = elementIdsToCheck.indexOf(dataId);

  // If element ID is found
  if (i !== -1) {
    elementIdsToCheck.splice(i, 1);
    numElementsToCheck++;
    delete elements[dataId];
    return true;
  }

  return false;
};
