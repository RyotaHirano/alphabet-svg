import Router from './lib/router';

import commonAction from './common';
import topAction from './top';

const router = new Router({
  '*': commonAction,
  '/': topAction
}, {
  rootPath: '/alphabet-svg'
});

router.run();
