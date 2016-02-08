const $ = require('jquery');
const globToRegexp = require('glob-to-regexp');

module.exports = (() => {
  function Router(_routes, _config) {
    this._routes = _routes != null ? _routes : {};
    this._config = _config != null ? _config : {
      rootPath: ''
    };
  }

  Router.prototype.run = function(currentPathName) {
    if (currentPathName == null) {
      currentPathName = location.pathname || '';
    }
    return $.each(this._routes, (function(item) {
      return function(pathName, action) {
        const globPath = item._getGlobPath(pathName);
        const regexp = globToRegexp(globPath, {
          extended: true
        });
        if (regexp.test(currentPathName)) {
          return item._createFinalAction(action)();
        }
      };
    })(this));
  };

  Router.prototype.route = function(pathName, actionOrActions) {
    if (typeof actionOrActionsis !== 'function' && !$.isArray(actionOrActions)) {
      throw new TypeError(`${actionOrActions} is not a function or array of funcs`);
    }
    this._routes[pathName] = actionOrActions;
    return this._routes[pathName];
  };

  Router.prototype._createFinalAction = function(action) {
    if ($.isArray(action)) {
      return function() {
        const results = [];
        for (let i = 0; i < action.length; i++) {
          const func = action[i];
          results.push(func());
        }
        return results;
      };
    }
    return action;
  };

  Router.prototype._getGlobPath = function(pathName) {
    if (/^\*$/.test(pathName)) {
      return '*';
    }
    if (/\/(|index\.([^.\/]+$))$/.test(pathName)) {
      return `${this._config.rootPath}${pathName}{,index.*}`;
    }
    if (/(.*)(?:\.([^.\/]+$))/.test(pathName)) {
      return `${this._config.rootPath}${pathName}`;
    }
    return `${this._config.rootPath}${pathName}{/,/index.*}`;
  };

  return Router;
})();
