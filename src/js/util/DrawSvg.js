const frame = 25;
const duration = 0.8;

const lineLength = (x1, y1, x2, y2) => {
  const length = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  return length;
};

const getTotalLineLength = elem => {
  const x1 = elem.getAttributeNS(null, 'x1');
  const y1 = elem.getAttributeNS(null, 'y1');
  const x2 = elem.getAttributeNS(null, 'x2');
  const y2 = elem.getAttributeNS(null, 'y2');

  return lineLength(x1, y1, x2, y2);
};

export default class DrawSvg {
  constructor(type, el) {
    this.el = el;
    this.type = el.tagName;
    this.currentFrame = 0;

    this.handle = 0;

    if (this.type === 'path') {
      this.elLength = el.getTotalLength();
    } else if (this.type === 'line') {
      this.elLength = getTotalLineLength(this.el);
    }

    // draw speed
    if (this.elLength <= 100) {
      this.totalFrame = 10;
      this.duration = duration;
    } else {
      this.totalFrame = frame;
      this.duration = duration;
    }

    this.el.style.strokeDasharray = `${this.elLength} ${this.elLength}`;
    this.el.style.strokeDashoffset = this.elLength;
  }

  draw() {
    this.el.style.opacity = 1; // stroke-linecapを使うとlinecapの部分が最初から表示されてしまうので、ここで表示させる
    this.playAnimation();
  }

  resetAnimation() {
    this.el.style.strokeDashoffset = this.elLength;
    this.currentFrame = 0;
  }

  playAnimation() {
    const _this = this;
    const progress = this.currentFrame / this.totalFrame;
    if (progress > 1) {
      window.cancelAnimFrame(this.handle);
    } else {
      this.currentFrame++;
      this.el.style.strokeDashoffset = Math.floor(this.elLength * (1 - progress));
      this.handle = window.requestAnimFrame(function() {
        _this.playAnimation();
      });
    }
  }
}
