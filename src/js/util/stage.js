import $ from 'jquery';
const stageBgColor = '#1e1e1e';
const time = 0.4;
const transition = `opacity ${time}s ease-in-out`;

export default class Stage {
  constructor(el) {
    this.$el = $(el);
    this.init();
  }

  init() {
    const winW = $(window).width();
    const winH = $(window).height();
    this.$el.css('width', winW);
    this.$el.css('height', winH);
    this.$el.css('visibility', 'hidden');
    this.$el.css('opacity', 0);
    this.$el.css('background-color', stageBgColor);
    this.$el.css('transition', transition);
  }

  show() {
    this.$el.css('z-index', '10000');
    this.$el.css('visibility', 'visible');
    this.$el.css('opacity', '1');
  }

  close() {
    this.$el.css('opacity', '0');
    setTimeout(() => {
      this.$el.css('visibility', 'hidden');
      this.$el.css('z-index', '-1');
    }, time * 1000);
  }

  fitting() {
    const winW = $(window).width();
    const winH = $(window).height();
    this.$el.css('width', winW);
    this.$el.css('height', winH);
  }
}
