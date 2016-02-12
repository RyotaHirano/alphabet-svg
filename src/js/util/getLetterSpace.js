const curning = 150;

export default function getLetterSpace(keyCode, beforeChara, svgLeft) {
  let _svgLeft = svgLeft;
  let addjustCurning = 0;
  if (keyCode === 'I' && beforeChara === 'I') {
    addjustCurning = curning - 70;
    _svgLeft += addjustCurning;
  } else if (keyCode === 'I') {
    addjustCurning = curning - 20;
    _svgLeft += addjustCurning;
  } else if (beforeChara === 'I') {
    addjustCurning = curning - 25;
    _svgLeft += addjustCurning;
  } else {
    _svgLeft += curning;
  }
  return _svgLeft;
}
