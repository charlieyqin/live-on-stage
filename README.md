# Live on Stage

#### High performance tracking of DOM elements entering and leaving the viewport.

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

- `onEnter: function`: Fires when element enters the viewport (becomes visible).
- `onLeave: function`: Fires when element leaves the viewport (becomes non-visible).
- `onPartialLeave: function`: Fires when the element **begins** to leaves the viewport.
- `onCompleteEnter: function`: Fires when an element **completely** enters the viewport.
- `buffer: number`: Size, in pixels, to add to each side of the element's calculated bounding box.

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

