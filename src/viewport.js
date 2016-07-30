/**
 * @class Viewport, tracks and updates viewport information.
 *
 * Mutates its own internal state to prevent excessive GC, as this
 * may be called multiple times a second during constant scrolling.
 */
export default class Foo {
  constructor() {
    this.body = document.body;
    this.doc = document.documentElement;
    this.update();
  }

  update() {
    this.top = this.body.scrollTop;
    this.left = this.body.scrollLeft;
    this.bottom = this.top + this.doc.clientHeight;
    this.right = this.left + this.doc.clientWidth;
  }
}
