const frame = 25;
const duration = 0.8;

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / frame);
    }
  );
})();

window.cancelAnimFrame = (function() {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function(id) {
      window.clearTimeout(id);
    }
  );
})();

export default class DrawSvg {
  constructor(type, el, inOrder) {
    this._el = el;
    this._type = el.tagName;
    this._currentFrame = 0;

    this._handle = 0;

    if (this._type === 'path') {
      this._elLength = el.getTotalLength();
    } else if (this._type === 'line') {
      this._elLength = this._getTotalLineLength(this._el);
    }

    // draw speed
    if (inOrder) {
      if (this._elLength <= 100) {
        this._totalFrame = 10;
        this.duration = duration;
      } else {
        this._totalFrame = frame;
        this.duration = duration;
      }
    } else {
      this._totalFrame = 50;
      this.duration = 0;
    }

    this._el.style.strokeDasharray = `${this._elLength} ${this._elLength}`;
    this._el.style.strokeDashoffset = this._elLength;
  }

  draw() {
    this._el.style.opacity = 1; // stroke-linecapを使うとlinecapの部分が最初から表示されてしまうので、ここで表示させる
    this.playAnimation();
  }

  resetAnimation() {
    this._el.style.strokeDashoffset = this._elLength;
    this._currentFrame = 0;
  }

  playAnimation() {
    const progress = this._currentFrame / this._totalFrame;
    if (progress > 1) {
      window.cancelAnimFrame(this._handle);
    } else {
      this._currentFrame++;
      this._el.style.strokeDashoffset = Math.floor(this._elLength * (1 - progress));
      this._handle = window.requestAnimFrame(() => {
        this.playAnimation();
      });
    }
  }

  _getTotalLineLength(elem) {
    const x1 = elem.getAttributeNS(null, 'x1');
    const y1 = elem.getAttributeNS(null, 'y1');
    let x2 = elem.getAttributeNS(null, 'x2');
    let y2 = elem.getAttributeNS(null, 'y2');

    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  }
}
