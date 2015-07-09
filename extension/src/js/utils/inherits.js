
/**
 * inherits
 */

function inherits(child, parent) {
  function f() {
    this.constructor = child;
  }
  f.prototype = parent.prototype;
  child.prototype = new f;
}
