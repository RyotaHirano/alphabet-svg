export default function chkKeyCode(keyCode) {
  if (keyCode >= 48 && keyCode <= 57) { // 0~9
    return true;
  } else if (keyCode >= 65 && keyCode <= 90) { // AtoZ
    return true;
  } else if (keyCode === 37 || keyCode === 39) { // ← or →
    return true;
  }
  return false;
}
