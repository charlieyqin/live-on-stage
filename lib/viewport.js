"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Viewport, tracks and updates viewport information.
 *
 * Mutates its own internal state to prevent excessive GC, as this
 * may be called multiple times a second during constant scrolling.
 */

var Viewport = function () {
  function Viewport() {
    _classCallCheck(this, Viewport);

    this.body = document.body;
    this.doc = document.documentElement;
    this.update();
  }

  Viewport.prototype.update = function update() {
    this.top = this.body.scrollTop;
    this.left = this.body.scrollLeft;
    this.bottom = this.top + this.doc.clientHeight;
    this.right = this.left + this.doc.clientWidth;
  };

  return Viewport;
}();

exports.default = Viewport;