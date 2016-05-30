# Live on Stage

#### High performance library for tracking DOM elements entering and leaving the viewport.

Live on Stage achieves high performance by:

- Measuring element bounding boxes once, when tracking begins.
- Throttles viewport measurement and event checking to 30fps.
- Only remeasures bounding boxes when window resizing has finished for 100 milliseconds.

## Install

```js
npm install live-on-stage --save
```

## Use

### Start tracking an element

```js
import { startTrackingElement, stopTrackingElement } from 'live-on-stage';

const trackingId = startTrackingElement(document.querySelector('div'), options);
```

### Stop tracking an element

```js
stopTrackingElement(trackingId);
```

### Remeasure an element
```js
import { remeasureElement } from 'live-on-stage';

measureElement(trackingId);
```

## Options

- `onEnter: function`: Fires when element enters the viewport.
- `onLeave: function`: Fires when element leaves the viewport.
- `onPartialLeave: function`: Fires when **part of** the element leaves the viewport.
- `buffer: number`: Size, in pixels, to add to each part of the element's calculated bounding box.
