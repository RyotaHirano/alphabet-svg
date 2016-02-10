import $ from 'jquery';
const bgColor = '#252a3e';
const textColor = '#7c87b1';

export default function changeBgColor() {
  const header = $('.js-header');
  const headerTitLe = $('.js-header-title');
  const body = $('.js-wrapper');

  header.css('background-color', bgColor);
  headerTitLe.css('color', textColor);
  body.css('background-color', bgColor);
}
