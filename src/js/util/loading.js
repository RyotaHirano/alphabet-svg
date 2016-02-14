import $ from 'jquery';

const time = 0.4;

export default class Loading {
  constructor(el) {
    this.$el = $(el);
  }

  init() {
    const winW = $(window).width();
    const winH = $(window).height();
    this.$el.css('width', winW);
    this.$el.css('height', winH);
  }

  close() {
    this.$el.css('opacity', '0');
    setTimeout(() => {
      this.$el.remove();
    }, time * 1000);
  }
}
