import pathDispatcher from 'path-dispatcher';
import topAction from './top';

const dispatcher = pathDispatcher({
  '/': topAction
}, {
  rootPath: '/alphabet-svg'
});

dispatcher.dispatch();
