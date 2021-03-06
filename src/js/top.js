import $ from 'jquery';
import debounce from 'lodash.debounce';

import Loading from './util/loading';
import DrawSvg from './util/DrawSvg';
import Stage from './util/stage';
import changeBgColor from './util/changeBgColor';
import resetBgColor from './util/resetBgColor';
import chkKeyCode from './util/chkKeyCode';
import resizeStageWidth from './util/resizeStageWidth';
import fittingWinHeight from './util/fittingWinHeight';
import getLetterSpace from './util/getLetterSpace';

const svgData = require('./data/alphabet-svg.json');
const playEnableClass = 'play--enable';
const loadingText = 'ALPHABETSVG';

const xmlns = 'http://www.w3.org/2000/svg';
const charaWidth = 150;
let beforeChara;
let svgLeft = 0;
let count = 0;
let pathCount;
let pathArr = [];
let timerArr = [];
let stageWrap;

const frame = 25;
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

export default function top() {
  const createPath = (data, parent, color, inOrder) => {
    let pathElem;
    const type = data.type;
    if (type === 'path') {
      pathElem = document.createElementNS(xmlns, 'path');
      pathElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      pathElem.setAttributeNS(null, 'height', '200px');
      pathElem.setAttributeNS(null, 'd', data.d);
      pathElem.setAttributeNS(null, 'class', 'c-path');
      pathElem.setAttributeNS(null, 'stroke', color);
    } else if (type === 'line') {
      pathElem = document.createElementNS(xmlns, 'line');
      pathElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      pathElem.setAttributeNS(null, 'height', '200px');
      pathElem.setAttributeNS(null, 'x1', data.x1);
      pathElem.setAttributeNS(null, 'y1', data.y1);
      pathElem.setAttributeNS(null, 'x2', data.x2);
      pathElem.setAttributeNS(null, 'y2', data.y2);
      pathElem.setAttributeNS(null, 'class', 'c-line');
      pathElem.setAttributeNS(null, 'stroke', color);
    }
    pathElem.style.display = 'block';

    const rawElem = new DrawSvg(pathElem, inOrder);
    pathArr.push(rawElem);

    parent.appendChild(pathElem);
    pathCount++;
  };

  const getRandomColor = () => {
    const hue = Math.floor(360 * Math.random());
    return `hsl(${hue}, 35%, 60%)`;
  };

  const addStageChara = (stage, chara, charaData, inOrder) => {
    if (Array.isArray(charaData)) {
      const pathNum = charaData.length;
      const svgElem = document.createElementNS(xmlns, 'svg');
      const id = `path-${count}`;

      if (count !== 0) {
        svgLeft = getLetterSpace(chara, beforeChara, svgLeft);
      }
      beforeChara = chara;

      svgElem.setAttributeNS(null, 'viewBox', `0 0 ${charaWidth} 200`);
      svgElem.setAttributeNS(null, 'width', `${charaWidth}px`);
      svgElem.setAttributeNS(null, 'height', '200px');
      svgElem.setAttributeNS(null, 'id', id);
      svgElem.setAttributeNS(null, 'x', svgLeft);
      svgElem.setAttributeNS(null, 'pathNum', pathNum);
      svgElem.style.display = 'block';

      stage.append(svgElem);
      const color = getRandomColor();

      charaData.slice().map(item => {
        createPath(item, svgElem, color, inOrder);
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
        }, i * item.duration * 1000);
        timerArr.push(timer);
      });
    }
  };

  const resetData = () => {
    svgLeft = 0;
    count = 0;
    pathCount = 0;
    pathArr = [];
    beforeChara = '';
    $('.js-stage')[0].setAttribute('width', `0`);
    deleteStageChara();
  };

  const resetStyle = () => {
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

  const resetSvgPosition = stage => {
    const winW = $(window).width();
    const maxCharaNum = Math.floor(winW / charaWidth);
    if (maxCharaNum < count) {
      const newcharaWidth = Math.floor(winW / count);
      const svgArr = $(`${stage} svg`);
      Object.keys(svgArr).map(key => {
        if (isFinite(key)) {
          svgArr[key].setAttribute('x', `${(newcharaWidth) * key}`);
          svgArr[key].setAttribute('width', `${newcharaWidth}`);
        }
      });
    }

    return;
  };

  const getInputText = (stage, inputText, inOrder) => {
    const inputArr = inputText.split('');
    inputArr.slice().forEach(item => {
      const chara = svgData[item];
      resizeStageWidth(stage, true);
      addStageChara(stage, item, chara, inOrder);
    });
  };

  const bindPlayAnimationBtn = () => {
    const btn = $('.js-playAnimation');
    btn.on('click.playAnimation', () => {
      const inputText = $('.js-input').val().toUpperCase();
      if (inputText !== '') {
        const stage = $('.js-stage');
        stageWrap.show();
        resetData();
        getInputText(stage, inputText, true);
        resetStyle();
        delTimer();
        resetSvgPosition('.js-stage');
        setTimeout(() => {
          playAnimation();
        }, 1000);
      }
    });
  };

  const bindReplayBtn = () => {
    const btn = $('.js-replayAnimation');
    btn.on('click.replayAnimation', () => {
      resetData();
      const inputText = $('.js-input').val().toUpperCase();
      const stage = $('.js-stage');
      getInputText(stage, inputText, true);
      resetStyle();
      delTimer();
      resetSvgPosition('.js-stage');
      playAnimation();
    });
  };

  const bindcloseStageBtn = () => {
    const btn = $('.js-stage-wrapper-close-btn');
    btn.on('click.closeStage', () => {
      stageWrap.close();
    });
  };

  const createStage = () => {
    const $stageWrap = $('.js-stage-wrapper');
    stageWrap = new Stage($stageWrap);
  };

  const loadingInit = () => {
    const elLoading = $('.js-loading');
    const loadingStage = $('.js-loading-stage');
    const loading = new Loading(elLoading);
    loading.init();

    getInputText(loadingStage, loadingText, false);
    resetSvgPosition('.js-loading-stage');
    setTimeout(() => {
      playAnimation();
      setTimeout(() => {
        loading.close();
      }, 2000);
    }, 800);
  };

  const init = () => {
    loadingInit();
    fittingWinHeight();
    bindInput();
    bindPlayAnimationBtn();
    bindReplayBtn();
    bindcloseStageBtn();

    createStage();
    bindWindow();
  };
  init();
}
