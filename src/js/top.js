import $ from 'jquery';
import debounce from 'lodash.debounce';
import Stage from './util/stage';
import changeBgColor from './util/changeBgColor';
import resetBgColor from './util/resetBgColor';
const svgData = require('./data/alphabet-svg.json');

export default function top() {
  const xmlns = 'http://www.w3.org/2000/svg';
  const charaWidth = 150;
  const curning = 150;
  let svgLeft = 0;
  let count = 0;
  let pathCount;
  const duration = 1;
  let pathArr = [];
  let timerArr = [];
  const frame = 30;
  let stageWrap;
  const keyCodeI = 'I';
  let beforeKeyCode;
  const playEnableClass = 'play--enable';

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

  const getLetterSpace = keyCode => {
    let _svgLeft = svgLeft;
    let addjustCurning = 0;
    if (keyCode === keyCodeI && beforeKeyCode === keyCodeI) {
      addjustCurning = curning - 70;
      _svgLeft += addjustCurning;
    } else if (keyCode === keyCodeI) {
      addjustCurning = curning - 20;
      _svgLeft += addjustCurning;
    } else if (beforeKeyCode === keyCodeI) {
      addjustCurning = curning - 25;
      _svgLeft += addjustCurning;
    } else {
      _svgLeft += curning;
    }
    return _svgLeft;
  };

  const addStageChara = (chara, charaData) => {
    if (Array.isArray(charaData)) {
      const stage = $('.js-stage');
      const pathNum = charaData.length;
      const svgElem = document.createElementNS(xmlns, 'svg');
      const id = `path-${count}`;

      if (count !== 0) {
        svgLeft = getLetterSpace(chara);
      }
      beforeKeyCode = chara;

      svgElem.setAttributeNS(null, 'viewBox', `0 0 ${charaWidth} 200`);
      svgElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      svgElem.setAttributeNS(null, 'height', '200px');
      svgElem.setAttributeNS(null, 'id', id);
      svgElem.setAttributeNS(null, 'x', svgLeft);
      svgElem.setAttributeNS(null, 'pathNum', pathNum);
      svgElem.style.display = 'block';

      stage.append(svgElem);

      charaData.slice().map(item => {
        createPath(item, svgElem);
      });
      count++;
    }
  };

  const deleteStageChara = () => {
    $('.js-stage').empty();
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

  const resetData = () => {
    svgLeft = 0;
    count = 0;
    pathCount = 0;
    pathArr = [];
    timerArr = [];
    beforeKeyCode = '';
    $('.js-stage')[0].setAttribute('width', `0`);
    deleteStageChara();
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

  const fittingStage = () => {
    stageWrap.fitting();
  };

  const bindWindow = () => {
    $(window).on('resize', debounce(fittingStage, 200));
  };

  const resizeStageWidth = plus => {
    const stage = $('.js-stage');
    let stageWidth;
    if (plus) {
      stageWidth = parseInt(stage.attr('width'), 10) + 150;
    } else {
      stageWidth = parseInt(stage.attr('width'), 10) - 150;
    }

    stage.attr('width', stageWidth);
  };

  const chkKeyCode = keyCode => {
    if (keyCode >= 48 && keyCode <= 57) { // 0~9
      return true;
    } else if (keyCode >= 65 && keyCode <= 90) { // AtoZ
      return true;
    } else if (keyCode === 37 || keyCode === 39) { // ← or →
      return true;
    }
    return false;
  };

  const bindInput = () => {
    const input = $('.js-input');

    input.on('keydown.input', e => {
      const keyCode = e.keyCode;

      // Shift Key or Alt Key
      if (e.shiftKey || e.altKey) {
        e.preventDefault();
        return false;
      }

      delTimer();

      if (keyCode !== 8) { // Not Delete
        if (chkKeyCode(keyCode)) {
          $('.js-playAnimation').removeClass(playEnableClass);
        } else {
          e.preventDefault();
          return false;
        }
      }
    });

    input.on('keyup.input', e => {
      const keyCode = e.keyCode;
      if (keyCode === 8) { // Delete
        const inputText = $('.js-input').val();
        if (inputText === '') {
          $('.js-playAnimation').addClass(playEnableClass);
        }
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

  const resetSvgPosition = () => {
    const winW = $(window).width();
    const maxCharaNum = Math.floor(winW / charaWidth);
    if (maxCharaNum < count) {
      const newcharaWidth = Math.floor(winW / count);
      const svgArr = $('.js-stage svg');
      Object.keys(svgArr).map(key => {
        if (isFinite(key)) {
          svgArr[key].setAttribute('x', `${(newcharaWidth) * key}`);
          svgArr[key].setAttribute('width', `${newcharaWidth}`);
        }
      });
    }

    return;
  };

  const getInputText = inputText => {
    const inputArr = inputText.split('');
    inputArr.slice().forEach(item => {
      const chara = svgData[item];
      resizeStageWidth(true);
      addStageChara(item, chara);
    });
  };

  const bindPlayAnimationBtn = () => {
    const btn = $('.js-playAnimation');
    btn.on('click.playAnimation', () => {
      const inputText = $('.js-input').val().toUpperCase();
      if (inputText !== '') {
        stageWrap.show();
        resetData();
        getInputText(inputText);
        reset();
        delTimer();
        resetSvgPosition();
        setTimeout(() => {
          playAnimation();
        }, 1000);
      }
    });
  };

  const bindcloseStageBtn = () => {
    const btn = $('.js-stage-wrapper-close-btn');
    btn.on('click.closeStage', () => {
      stageWrap.close();
    });
  };

  const fitting = () => {
    const body = $('.js-wrapper');
    const winH = $(window).height();
    const headerH = $('.js-header').height();
    const footerH = $('.js-footer').height();
    body.css('height', winH - headerH - footerH);
  };

  const init = () => {
    fitting();
    bindInput();
    bindPlayAnimationBtn();
    bindcloseStageBtn();

    const $stageWrap = $('.js-stage-wrapper');
    stageWrap = new Stage($stageWrap);
    bindWindow();
  };

  init();
}
