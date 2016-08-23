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

    this.doc = document.documentElement;
    this.remeasure();
    this.update();
  }

  Viewport.prototype.remeasure = function remeasure() {
    this.width = this.doc.clientWidth;
    this.height = this.doc.clientHeight;
  };

  Viewport.prototype.update = function update() {
    this.top = window.pageYOffset;
    this.left = window.pageXOffset;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
  };

  return Viewport;
}();

exports.default = Viewport;