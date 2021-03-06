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
  let callback;

  if (elementData.onEnter || elementData.onLeave) {
    // Check if element is completely off screen
    const isOffTop = viewport.top > elementData.bottom + elementData.buffer;
    const isOffRight = viewport.right < elementData.left - elementData.buffer;
    const isOffBottom = viewport.bottom < elementData.top - elementData.buffer;
    const isOffLeft = viewport.left > elementData.right + elementData.right;
    const isOffScreen = (isOffTop || isOffRight || isOffBottom || isOffLeft);

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
    const isWithinTop = viewport.top <= elementData.top - elementData.buffer;
    const isWithinRight = viewport.right >= elementData.right + elementData.buffer;
    const isWithinBottom = viewport.bottom >= elementData.bottom + elementData.buffer;
    const isWithinLeft = viewport.left <= elementData.left - elementData.buffer;
    const isWithinScreen = (isWithinTop && isWithinRight && isWithinBottom && isWithinLeft);
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
    callback(elementData, viewport);
  }

  if (elementData.onScroll) {
    elementData.onScroll(elementData, viewport);
  }
}

/**
 * Check new element
 * @param  {object} Element data
 * @return {void}
 */
function checkNew(elementData) {
  if (elementData.onEnter && elementData.isOffScreen === false) {
    elementData.onEnter(elementData, viewport);
  } else if (elementData.onLeave && elementData.isOffScreen === true) {
    elementData.onLeave(elementData, viewport);
  } else if (elementData.onBeginLeave && elementData.isWithinScreen === false) {
    elementData.onBeginLeave(elementData, viewport);
  } else if (elementData.onCompleteEnter && elementData.isWithinScreen === true) {
    elementData.onCompleteEnter(elementData, viewport);
  }
}

/**
 * Check all element bounding boxes for viewport collision.
 *
 * @return {void}
 */
function checkAll() {
  for (let i = 0; i < numElementsToCheck; i++) {
    check(elements[elementIdsToCheck[i]]);
  }
}

function updateAndCheckAll() {
  viewport.update();
  checkAll();
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

  elementData.top = top + viewport.top;
  elementData.right = right + viewport.left;
  elementData.bottom = bottom + viewport.top;
  elementData.left = left + viewport.left;

  if (elementData.onMeasure) {
    elementData.onMeasure(elementData, viewport, window.pageYOffset);
  }
}

/**
 * Measure all element bounding boxes.
 *
 * @return {void}
 */
function measureAll() {
  viewport.remeasure();
  viewport.update();

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
  let checkNextFrame;

  // If there's no viewport, we haven't initialised
  if (!viewport) {
    viewport = new Viewport();
    window.addEventListener('scroll', () => {
      viewport.invalidate();
      if (checkNextFrame) {
        cancelAnimationFrame(checkNextFrame);
      }
      checkNextFrame = requestAnimationFrame(updateAndCheckAll);
    });
    window.addEventListener('resize', debounce(measureAll, 100));
  }

  const elementData = {
    dom: element,
    buffer: 0,
    ...opts
  };

  const elementId = idCounter++;

  numElementsToCheck++;
  elementIdsToCheck.push(elementId);
  elements[elementId] = elementData;

  if (viewport.isInvalid) {
    viewport.update();
  }

  measure(elementId);
  check(elementData);
  checkNew(elementData);

  return elementId;
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

export function manuallyCheckAll() {
  if (viewport) {
    requestAnimationFrame(updateAndCheckAll);
  }
}

export function manuallyMeasureAll() {
  if (viewport) {
    requestAnimationFrame(measureAll);
  }
}
