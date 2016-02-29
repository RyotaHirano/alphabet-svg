const frame = 25;
const duration = 0.8;

export default class DrawSvg {
  get el() {
    return this._el;
  }

  get type() {
    return this._type;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  set currentFrame(value) {
    this._currentFrame = value;
  }

  get animationID() {
    return this._animationID;
  }

  set animationID(value) {
    this._animationID = value;
  }

  get elLength() {
    return this._elLength;
  }

  get totalFrame() {
    return this._totalFrame;
  }

  set totalFrame(value) {
    this._totalFrame = value;
  }

  constructor(el, inOrder) {
    this._el = el;
    this._type = el.tagName;
    this._currentFrame = 0;
    this._animationID = null;
    if (this.type === 'path') {
      this._elLength = this.el.getTotalLength();
    } else if (this.type === 'line') {
      this._elLength = this._getTotalLineLength(this.el);
    }

    // draw speed
    if (inOrder) {
      if (this.elLength <= 100) {
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

    this.el.style.strokeDasharray = `${this.elLength} ${this.elLength}`;
    this.el.style.strokeDashoffset = this.elLength;
  }

  draw() {
    this.el.style.opacity = 1; // stroke-linecapを使うとlinecapの部分が最初から表示されてしまうので、ここで表示させる
    this.animate();
  }

  resetAnimation() {
    this.el.style.strokeDashoffset = this.elLength;
    this.currentFrame = 0;
  }

  animate() {
    const progress = this.currentFrame / this.totalFrame;
    if (progress > 1) {
      window.cancelAnimFrame(this.animationID);
    } else {
      this.currentFrame++;
      this.el.style.strokeDashoffset = Math.floor(this.elLength * (1 - progress));
      this.animationID = window.requestAnimFrame(() => {
        this.animate();
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
