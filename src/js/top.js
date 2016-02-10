import $ from 'jquery';
import debounce from 'lodash.debounce';
import Stage from './util/stage';
import changeBgColor from './util/changeBgColor';
import resetBgColor from './util/resetBgColor';
const svgData = require('./data/alphabet-svg.json');

export default function top() {
  const xmlns = 'http://www.w3.org/2000/svg';
  const charaWidth = 150;
  let count = 0;
  let pathCount;
  const duration = 1;
  const pathArr = [];
  let timerArr = [];
  const frame = 30;
  let stageWrap;

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

  class DrawSvg {
    constructor(type, el) {
      this.el = el;
      this.type = el.tagName;
      this.currentFrame = 0;
      this.totalFrame = frame;
      this.handle = 0;

      if (this.type === 'path') {
        this.elLength = el.getTotalLength();
      } else if (this.type === 'line') {
        this.elLength = getTotalLineLength(this.el);
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

    // playAnimation() {
    //   this.el.style.transition = this.el.style.WebkitTransition = 'none';
    //   this.el.style.strokeDasharray = `${this.elLength} ${this.elLength}`;
    //   this.el.style.strokeDashoffset = this.elLength;
    //   this.el.getBoundingClientRect();
    //   this.el.style.transition = this.el.style.WebkitTransition = `stroke-dashoffset ${duration}s ease-in-out`;
    //   this.el.style.strokeDashoffset = '0';
    // }

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

  const createPath = (data, parent) => {
    let pathElem;
    const type = data.type;
    if (type === 'path') {
      pathElem = document.createElementNS(xmlns, 'path');
      pathElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      pathElem.setAttributeNS(null, 'height', '200px');
      pathElem.setAttributeNS(null, 'd', data.d);
      pathElem.setAttributeNS(null, 'class', 'c-path');
    } else if (type === 'line') {
      pathElem = document.createElementNS(xmlns, 'line');
      pathElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      pathElem.setAttributeNS(null, 'height', '200px');
      pathElem.setAttributeNS(null, 'x1', data.x1);
      pathElem.setAttributeNS(null, 'y1', data.y1);
      pathElem.setAttributeNS(null, 'x2', data.x2);
      pathElem.setAttributeNS(null, 'y2', data.y2);
      pathElem.setAttributeNS(null, 'class', 'c-line');
    }
    pathElem.style.display = 'block';

    const rawElem = new DrawSvg(type, pathElem);
    pathArr.push(rawElem);

    parent.appendChild(pathElem);
    pathCount++;
  };

  const addStageChara = chara => {
    if (Array.isArray(chara)) {
      const stage = $('.js-stage');
      const pathNum = chara.length;
      const svgElem = document.createElementNS(xmlns, 'svg');
      const id = `path-${count}`;
      const svgLeft = charaWidth * count;
      svgElem.setAttributeNS(null, 'viewBox', `0 0 ${charaWidth} 200`);
      svgElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      svgElem.setAttributeNS(null, 'height', '200px');
      svgElem.setAttributeNS(null, 'id', id);
      svgElem.setAttributeNS(null, 'x', svgLeft);
      svgElem.setAttributeNS(null, 'pathNum', pathNum);
      svgElem.style.display = 'block';

      stage.append(svgElem);

      chara.slice().map(item => {
        createPath(item, svgElem);
      });
      count++;
    }
  };

  const deleteStageChara = () => {
    const targetNum = count - 1;
    const targetId = `#path-${targetNum}`;
    const target = $(targetId);
    if (target[0]) {
      const targetPathNum = target[0].attributes.pathNum.value;
      for (let i = 0; i < targetPathNum; i++) {
        pathArr.pop();
        pathCount--;
      }
      target.remove();
      count--;
    }
  };

  const playAnimation = () => {
    if (pathArr.length > 0) {
      pathArr.forEach((item, i) => {
        const timer = setTimeout(() => {
          item.draw();
        }, i * duration * 1000);
        timerArr.push(timer);
      });
    }
  };

  const reset = () => {
    const pathAll = document.querySelectorAll('path');
    const lineAll = document.querySelectorAll('line');
    const lineCount = lineAll.length;
    if (pathAll.length > 0) {
      for (let i = 0; i < pathAll.length; i++) {
        const target = pathAll[i];
        target.style.opacity = 0;
      }
    }
    if (lineCount > 0) {
      for (let i = 0; i < lineCount; i++) {
        const target = lineAll[i];
        target.style.opacity = 0;
      }
    }

    const length = pathArr.length;
    for (let j = 0; j < length; j++) {
      const target = pathArr[j];
      target.resetAnimation();
    }
  };

  const delTimer = () => {
    if (timerArr.length > 0) {
      timerArr.forEach(timer => {
        clearTimeout(timer);
      });
      timerArr = [];
    }
  };

  const fitting = () => {
    stageWrap.fitting();
  };

  const bindWindow = () => {
    $(window).on('resize', debounce(fitting, 200));
  };

  const bindInput = () => {
    const input = $('.js-input');

    input.on('keydown.input', e => {
      const selectTextLength = window.getSelection().toString().length;
      if (selectTextLength === 0) {
        const keyCode = e.keyCode;

        // resetOpacity();
        delTimer();

        if (keyCode !== 8) {
          const chara = svgData[keyCode];
          if (chara !== undefined) {
            addStageChara(chara);
          } else {
            e.preventDefault();
            return false;
          }
        } else {
          // Delete
          deleteStageChara();
        }
      } else {
        e.preventDefault();
        return false;
      }
    });

    input.on('paste.input', e => {
      e.preventDefault();
      return false;
    });

    input.on('focus', () => {
      changeBgColor();
    });

    input.on('focusout', () => {
      resetBgColor();
    });
  };

  const bindPlayAnimationBtn = () => {
    const btn = $('.js-playAnimation');
    btn.on('click.playAnimation', () => {
      stageWrap.show();
      reset();
      delTimer();
      playAnimation();
    });
  };

  const bindcloseStageBtn = () => {
    const btn = $('.js-stage-wrapper-close-btn');
    btn.on('click.closeStage', () => {
      stageWrap.close();
    });
  };

  const init = () => {
    bindInput();
    bindPlayAnimationBtn();
    bindcloseStageBtn();

    const $stageWrap = $('.js-stage-wrapper');
    stageWrap = new Stage($stageWrap);
    bindWindow();
  };

  init();
}
