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

- `onEnter: function`: Fires when element enters the viewport (becomes visible). Opposite: `onLeave`
- `onLeave: function`: Fires when element leaves the viewport (becomes non-visible). Opposite: `onEnter`
- `onBeginLeave: function`: Fires when the element **begins** to leaves the viewport. Opposite: `onCompleteEnter`
- `onCompleteEnter: function`: Fires when an element **completely** enters the viewport. Opposite: `onBeginLeave`
- `buffer: number`: Size, in pixels, to add to each side of the element's calculated bounding box.

Callbacks are provided one argument, `elementData`, which can be used to query the positional status of an element:

- `dom: HTMLElement`: The DOM element as provided to `startTrackingElement`.
- `top`, `right`, `bottom`, `left: number`: Absolute bounding box measurements relative to document.
- `isOffTop`, `isOffRight`, `isOffBottom`, `isOffLeft`, `isOffScreen: boolean`: `true` when element is positioned off given viewport side.
- `isWithinTop`, `isWithinRight`, `isWithinBottom`, `isWithinLeft`, `isWithinScreen: boolean`: `true` when element is completely within viewport side.

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

