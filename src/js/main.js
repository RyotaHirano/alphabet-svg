import pathDispatcher from 'path-dispatcher';

import commonAction from './common';
import topAction from './top';

const dispatcher = pathDispatcher({
  '*': commonAction,
  '/': topAction
}, {
  rootPath: '/alphabet-svg'
});

dispatcher.dispatch();
