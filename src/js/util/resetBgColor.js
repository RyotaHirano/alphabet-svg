import $ from 'jquery';
const bgColor = '#ffffff';
const textColor = '#000000';

export default function resetBgColor() {
  const header = $('.js-header');
  const headerTitLe = $('.js-header-title');
  const body = $('body');

  header.css('background-color', bgColor);
  headerTitLe.css('color', textColor);
  body.css('background-color', bgColor);
}
