import Svg from './Svg';

export default class DrawSvg extends Svg {
  constructor(el, inOrder) {
    super(el, inOrder);
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
