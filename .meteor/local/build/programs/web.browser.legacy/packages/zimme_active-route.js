//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var __coffeescriptShare, ActiveRoute;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/zimme_active-route/lib/activeroute.coffee                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var checkParams, checkRouteOrPath, checkRouterPackages, errorMessages, fr, ir, test;
fr = ir = null;

checkRouteOrPath = function (arg) {
  var error;

  try {
    return check(arg, Match.OneOf(RegExp, String));
  } catch (error1) {
    error = error1;
    throw new Error(errorMessages.invalidRouteNameArgument);
  }
};

checkParams = function (arg) {
  var error;

  try {
    return check(arg, Object);
  } catch (error1) {
    error = error1;
    throw new Error(errorMessages.invalidRouteParamsArgument);
  }
};

checkRouterPackages = function () {
  var ref, ref1;
  fr = (ref = (ref1 = Package['kadira:flow-router']) != null ? ref1 : Package['meteorhacks:flow-router']) != null ? ref : Package['kadira:flow-router-ssr'];
  ir = Package['iron:router'];

  if (!(ir || fr)) {
    throw new Error(errorMessages.noSupportedRouter);
  }
};

errorMessages = {
  noSupportedRouter: 'No supported router installed. Please install ' + 'iron:router or meteorhacks:flow-router.',
  invalidRouteNameArgument: 'Invalid argument, must be String or RegExp.',
  invalidRouteParamsArgument: 'Invalid arguemnt, must be Object.'
};
share.config = new ReactiveDict('activeRouteConfig');
share.config.setDefault({
  activeClass: 'active',
  caseSensitive: true,
  disabledClass: 'disabled'
});

test = function (value, pattern) {
  var result;

  if (!value) {
    return false;
  }

  if (Match.test(pattern, RegExp)) {
    result = value.search(pattern);
    result = result > -1;
  } else if (Match.test(pattern, String)) {
    if (share.config.equals('caseSensitive', false)) {
      value = value.toLowerCase();
      pattern = pattern.toLowerCase();
    }

    result = value === pattern;
  }

  return result != null ? result : result = false;
};

ActiveRoute = {
  config: function () {
    return this.configure.apply(this, arguments);
  },
  configure: function (options) {
    if (Meteor.isServer) {
      return;
    }

    share.config.set(options);
  },
  name: function (routeName) {
    var routeParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var controller, currentPath, currentRouteName, path, ref, ref1;
    checkRouterPackages();

    if (Meteor.isServer && !Package['kadira:flow-router-ssr']) {
      return;
    }

    checkRouteOrPath(routeName);
    checkParams(routeParams);

    if (ir) {
      if (!_.isEmpty(routeParams) && Match.test(routeName, String)) {
        controller = ir.Router.current();

        if (controller != null ? controller.route : void 0) {
          currentPath = controller != null ? controller.location.get().path : void 0;
        }

        path = ir.Router.path(routeName, routeParams);
      } else {
        currentRouteName = (ref = ir.Router.current()) != null ? (ref1 = ref.route) != null ? typeof ref1.getName === "function" ? ref1.getName() : void 0 : void 0 : void 0;
      }
    }

    if (fr) {
      if (!_.isEmpty(routeParams) && Match.test(routeName, String)) {
        fr.FlowRouter.watchPathChange();

        if (currentPath == null) {
          currentPath = fr.FlowRouter.current().path;
        }

        if (path == null) {
          path = fr.FlowRouter.path(routeName, routeParams);
        }
      } else {
        if (currentRouteName == null) {
          currentRouteName = fr.FlowRouter.getRouteName();
        }
      }
    }

    return test(currentPath || currentRouteName, path || routeName);
  },
  path: function (path) {
    var controller, currentPath;
    checkRouterPackages();

    if (Meteor.isServer) {
      return;
    }

    checkRouteOrPath(path);

    if (ir) {
      controller = ir.Router.current();

      if (controller != null ? controller.route : void 0) {
        currentPath = controller != null ? controller.location.get().path : void 0;
      }
    }

    if (fr) {
      fr.FlowRouter.watchPathChange();

      if (currentPath == null) {
        currentPath = fr.FlowRouter.current().path;
      }
    }

    return test(currentPath, path);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/zimme_active-route/client/helpers.coffee                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Spacebars,
    Template,
    func,
    helpers,
    isActive,
    name,
    hasProp = {}.hasOwnProperty;

if (!(Package.templating && Package.spacebars)) {
  return;
}

Template = Package.templating.Template;
Spacebars = Package.spacebars.Spacebars;

isActive = function (type) {
  var inverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var helperName;
  helperName = 'is';

  if (inverse) {
    helperName += 'Not';
  }

  helperName += "Active" + type;
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var className, isPath, name, path, pattern, ref, regex, result, t;

    if (Match.test(options, Spacebars.kw)) {
      options = options.hash;
    }

    if (Match.test(attributes, Spacebars.kw)) {
      attributes = attributes.hash;
    }

    if (Match.test(options, String)) {
      if (share.config.equals('regex', true)) {
        options = {
          regex: options
        };
      } else if (type === 'Path') {
        options = {
          path: options
        };
      } else {
        options = {
          name: options
        };
      }
    }

    options = _.defaults(attributes, options);
    pattern = Match.ObjectIncluding({
      "class": Match.Optional(String),
      className: Match.Optional(String),
      regex: Match.Optional(Match.OneOf(RegExp, String)),
      name: Match.Optional(String),
      path: Match.Optional(String)
    });
    check(options, pattern);
    var _options = options;
    regex = _options.regex;
    name = _options.name;
    path = _options.path;
    className = (ref = options.class) != null ? ref : options.className;

    if (type === 'Path') {
      name = null;
    } else {
      path = null;
    }

    if (!(regex || name || path)) {
      t = type === 'Route' ? 'name' : type;
      t = t.toLowerCase();
      console.error("Invalid argument, " + helperName + " takes \"" + t + "\", " + (t + "=\"" + t + "\" or regex=\"regex\""));
      return false;
    }

    if (Match.test(regex, String)) {
      if (share.config.equals('caseSensitive', false)) {
        regex = new RegExp(regex, 'i');
      } else {
        regex = new RegExp(regex);
      }
    }

    if (regex == null) {
      regex = name || path;
    }

    if (inverse) {
      if (className == null) {
        className = share.config.get('disabledClass');
      }
    } else {
      if (className == null) {
        className = share.config.get('activeClass');
      }
    }

    if (type === 'Path') {
      isPath = true;
    }

    if (isPath) {
      result = ActiveRoute.path(regex);
    } else {
      options = _.defaults(attributes, attributes.data);
      result = ActiveRoute.name(regex, _.omit(options, ['class', 'className', 'data', 'regex', 'name', 'path']));
    }

    if (inverse) {
      result = !result;
    }

    if (result) {
      return className;
    } else {
      return false;
    }
  };
};

helpers = {
  isActiveRoute: isActive('Route'),
  isActivePath: isActive('Path'),
  isNotActiveRoute: isActive('Route', true),
  isNotActivePath: isActive('Path', true)
};

for (name in meteorBabelHelpers.sanitizeForInObject(helpers)) {
  if (!hasProp.call(helpers, name)) continue;
  func = helpers[name];
  Template.registerHelper(name, func);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("zimme:active-route", {
  ActiveRoute: ActiveRoute
});

})();
