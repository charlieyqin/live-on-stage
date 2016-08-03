/**
 * @class Viewport, tracks and updates viewport information.
 *
 * Mutates its own internal state to prevent excessive GC, as this
 * may be called multiple times a second during constant scrolling.
 */
export default class Viewport {
  constructor() {
    this.doc = document.documentElement;
    this.remeasure();
    this.update();
  }

  remeasure() {
    this.width = this.doc.clientWidth;
    this.height = this.doc.clientHeight;
  }

  update() {
    this.top = window.pageXOffset;
    this.left = window.pageYOffset;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
  }
}
