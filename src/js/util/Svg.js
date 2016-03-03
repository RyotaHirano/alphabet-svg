const frame = 25;
const duration = 0.8;

export default class Svg {
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
}
