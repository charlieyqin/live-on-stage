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

Start tracking a DOM element by providing it to `startTrackingElement`. A second argument, `options`, is an optional object with event callbacks and other properties.

```js
import { startTrackingElement } from 'live-on-stage';

const trackingId = startTrackingElement(document.querySelector('div'), options);
```

#### Options

- `onEnter: function`: Fires when element enters the viewport.
- `onLeave: function`: Fires when element leaves the viewport.
- `onPartialLeave: function`: Fires when the element **begins** to leaves the viewport.
- `onCompleteEnter: function`: Fires when an element **completely** enters the viewport.
- `buffer: number`: Size, in pixels, to add to each part of the element's calculated bounding box.

### Stop tracking an element

```js
import { stopTrackingElement } from 'live-on-stage';

stopTrackingElement(trackingId);
```

### Manually measure an element

If an element has moved around on the page as a result of something other than a window resize event, its bounding box can be manually updated with `measureElement`.

```js
import { measureElement } from 'live-on-stage';

measureElement(trackingId);
```

