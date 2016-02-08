module.exports = function() {
  if (window.location.pathname !== '/alphabet-svg/') {
    const body = document.querySelector('body');
    const mainContent = document.querySelector('.l-main');
    const menuBtn = document.querySelector('#js-menubtn');
    const sideBar = document.querySelector('#js-sidebar');

    const toggleMenu = () => {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const mainHeight = mainContent.clientHeight + 40;
        sideBar.style.height = `${mainHeight}px`;
        body.classList.toggle('menu-open');
        if (body.classList.contains('menu-open')) {
          body.classList.add('menu-close');
        } else {
          body.classList.remove('menu-close');
        }
        !body.classList.toggle('menu-close');
      });
    };

    const init = () => {
      toggleMenu();
    };

    init();
  }
};
