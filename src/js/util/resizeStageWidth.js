export default function resizeStageWidth(stage, plus) {
  let stageWidth;
  if (plus) {
    stageWidth = parseInt(stage.attr('width'), 10) + 150;
  } else {
    stageWidth = parseInt(stage.attr('width'), 10) - 150;
  }

  stage.attr('width', stageWidth);
}
