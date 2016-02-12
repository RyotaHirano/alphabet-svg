import $ from 'jquery';

export default function fittingWinHeight() {
  const body = $('.js-wrapper');
  const winH = $(window).height();
  const headerH = $('.js-header').height();
  const footerH = $('.js-footer').height();
  body.css('height', winH - headerH - footerH);
}
