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
  name: function (routeName, routeParams = {}) {
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


/* Exports */
Package._define("zimme:active-route", {
  ActiveRoute: ActiveRoute
});

})();

//# sourceURL=meteor://💻app/packages/zimme_active-route.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvemltbWVfYWN0aXZlLXJvdXRlL2xpYi9hY3RpdmVyb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3RpdmVyb3V0ZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tQYXJhbXMiLCJjaGVja1JvdXRlT3JQYXRoIiwiY2hlY2tSb3V0ZXJQYWNrYWdlcyIsImVycm9yTWVzc2FnZXMiLCJmciIsImlyIiwidGVzdCIsImFyZyIsImVycm9yIiwiY2hlY2siLCJNYXRjaCIsIk9uZU9mIiwiUmVnRXhwIiwiU3RyaW5nIiwiZXJyb3IxIiwiRXJyb3IiLCJpbnZhbGlkUm91dGVOYW1lQXJndW1lbnQiLCJPYmplY3QiLCJpbnZhbGlkUm91dGVQYXJhbXNBcmd1bWVudCIsInJlZiIsInJlZjEiLCJQYWNrYWdlIiwibm9TdXBwb3J0ZWRSb3V0ZXIiLCJzaGFyZSIsImNvbmZpZyIsIlJlYWN0aXZlRGljdCIsInNldERlZmF1bHQiLCJhY3RpdmVDbGFzcyIsImNhc2VTZW5zaXRpdmUiLCJkaXNhYmxlZENsYXNzIiwidmFsdWUiLCJwYXR0ZXJuIiwicmVzdWx0Iiwic2VhcmNoIiwiZXF1YWxzIiwidG9Mb3dlckNhc2UiLCJBY3RpdmVSb3V0ZSIsImNvbmZpZ3VyZSIsImFwcGx5IiwiYXJndW1lbnRzIiwib3B0aW9ucyIsIk1ldGVvciIsImlzU2VydmVyIiwic2V0IiwibmFtZSIsInJvdXRlTmFtZSIsInJvdXRlUGFyYW1zIiwiY29udHJvbGxlciIsImN1cnJlbnRQYXRoIiwiY3VycmVudFJvdXRlTmFtZSIsInBhdGgiLCJfIiwiaXNFbXB0eSIsIlJvdXRlciIsImN1cnJlbnQiLCJyb3V0ZSIsImxvY2F0aW9uIiwiZ2V0IiwiZ2V0TmFtZSIsIkZsb3dSb3V0ZXIiLCJ3YXRjaFBhdGhDaGFuZ2UiLCJnZXRSb3V0ZU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxXQUFB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LEdBQXJCLEdBQTJCUCxJQUF6QyxHQUF5QyxNQUF6QztBQUZGO0FDNEJDOztBRHhCRCxRQUFHOUMsRUFBSDtBQUNFQSxRQUFFLENBQUN1RCxVQUFILENBQWNDLGVBQWQ7O0FDMEJBLFVBQUlaLFdBQVcsSUFBSSxJQUFuQixFQUF5QjtBRHpCekJBLG1CQUFBLEdBQWU1QyxFQUFFLENBQUN1RCxVQUFILENBQWNMLE9BQWQsR0FBd0JKLElBQXZDO0FBRkY7QUM4QkM7O0FBQ0QsV0QzQkE1QyxJQUFBLENBQUswQyxXQUFMLEVBQWtCRSxJQUFsQixDQzJCQTtBRDFDSTtBQXJDTixDQUZGLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3ppbW1lX2FjdGl2ZS1yb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImZyID0gaXIgPSBudWxsXG5cbmNoZWNrUm91dGVPclBhdGggPSAoYXJnKSAtPlxuICB0cnlcbiAgICBjaGVjayBhcmcsIE1hdGNoLk9uZU9mIFJlZ0V4cCwgU3RyaW5nXG4gIGNhdGNoIGVycm9yXG4gICAgdGhyb3cgbmV3IEVycm9yIGVycm9yTWVzc2FnZXMuaW52YWxpZFJvdXRlTmFtZUFyZ3VtZW50XG5cbmNoZWNrUGFyYW1zID0gKGFyZykgLT5cbiAgdHJ5XG4gICAgY2hlY2sgYXJnLCBPYmplY3RcbiAgY2F0Y2ggZXJyb3JcbiAgICB0aHJvdyBuZXcgRXJyb3IgZXJyb3JNZXNzYWdlcy5pbnZhbGlkUm91dGVQYXJhbXNBcmd1bWVudFxuXG5jaGVja1JvdXRlclBhY2thZ2VzID0gLT5cbiAgZnIgPSBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXInXSA/IFBhY2thZ2VbJ21ldGVvcmhhY2tzOmZsb3ctcm91dGVyJ10gPyBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXItc3NyJ11cbiAgaXIgPSBQYWNrYWdlWydpcm9uOnJvdXRlciddXG4gIHRocm93IG5ldyBFcnJvciBlcnJvck1lc3NhZ2VzLm5vU3VwcG9ydGVkUm91dGVyIHVubGVzcyBpciBvciBmclxuXG5lcnJvck1lc3NhZ2VzID1cbiAgbm9TdXBwb3J0ZWRSb3V0ZXI6XG4gICAgJ05vIHN1cHBvcnRlZCByb3V0ZXIgaW5zdGFsbGVkLiBQbGVhc2UgaW5zdGFsbCAnICtcbiAgICAnaXJvbjpyb3V0ZXIgb3IgbWV0ZW9yaGFja3M6Zmxvdy1yb3V0ZXIuJ1xuXG4gIGludmFsaWRSb3V0ZU5hbWVBcmd1bWVudDogJ0ludmFsaWQgYXJndW1lbnQsIG11c3QgYmUgU3RyaW5nIG9yIFJlZ0V4cC4nXG4gIGludmFsaWRSb3V0ZVBhcmFtc0FyZ3VtZW50OiAnSW52YWxpZCBhcmd1ZW1udCwgbXVzdCBiZSBPYmplY3QuJ1xuXG5zaGFyZS5jb25maWcgPSBuZXcgUmVhY3RpdmVEaWN0ICdhY3RpdmVSb3V0ZUNvbmZpZydcbnNoYXJlLmNvbmZpZy5zZXREZWZhdWx0XG4gIGFjdGl2ZUNsYXNzOiAnYWN0aXZlJ1xuICBjYXNlU2Vuc2l0aXZlOiB0cnVlXG4gIGRpc2FibGVkQ2xhc3M6ICdkaXNhYmxlZCdcblxudGVzdCA9ICh2YWx1ZSwgcGF0dGVybikgLT5cbiAgcmV0dXJuIGZhbHNlIHVubGVzcyB2YWx1ZVxuXG4gIGlmIE1hdGNoLnRlc3QgcGF0dGVybiwgUmVnRXhwXG4gICAgcmVzdWx0ID0gdmFsdWUuc2VhcmNoIHBhdHRlcm5cbiAgICByZXN1bHQgPSByZXN1bHQgPiAtMVxuXG4gIGVsc2UgaWYgTWF0Y2gudGVzdCBwYXR0ZXJuLCBTdHJpbmdcbiAgICBpZiBzaGFyZS5jb25maWcuZXF1YWxzICdjYXNlU2Vuc2l0aXZlJywgZmFsc2VcbiAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgcGF0dGVybiA9IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuXG4gICAgcmVzdWx0ID0gdmFsdWUgaXMgcGF0dGVyblxuXG4gIHJlc3VsdCA/PSBmYWxzZVxuXG5BY3RpdmVSb3V0ZSA9XG5cbiAgY29uZmlnOiAtPlxuICAgIEBjb25maWd1cmUuYXBwbHkgQCwgYXJndW1lbnRzXG5cbiAgY29uZmlndXJlOiAob3B0aW9ucykgLT5cbiAgICByZXR1cm4gaWYgTWV0ZW9yLmlzU2VydmVyXG5cbiAgICBzaGFyZS5jb25maWcuc2V0IG9wdGlvbnNcbiAgICByZXR1cm5cblxuICBuYW1lOiAocm91dGVOYW1lLCByb3V0ZVBhcmFtcyA9IHt9KSAtPlxuICAgIGNoZWNrUm91dGVyUGFja2FnZXMoKVxuXG4gICAgcmV0dXJuIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgIVBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlci1zc3InXSlcblxuICAgIGNoZWNrUm91dGVPclBhdGggcm91dGVOYW1lXG4gICAgY2hlY2tQYXJhbXMgcm91dGVQYXJhbXNcblxuICAgIGlmIGlyXG4gICAgICBpZiBub3QgXy5pc0VtcHR5KHJvdXRlUGFyYW1zKSBhbmQgTWF0Y2gudGVzdCByb3V0ZU5hbWUsIFN0cmluZ1xuICAgICAgICBjb250cm9sbGVyID0gaXIuUm91dGVyLmN1cnJlbnQoKVxuICAgICAgICBjdXJyZW50UGF0aCA9IGNvbnRyb2xsZXI/LmxvY2F0aW9uLmdldCgpLnBhdGggaWYgY29udHJvbGxlcj8ucm91dGVcbiAgICAgICAgcGF0aCA9IGlyLlJvdXRlci5wYXRoIHJvdXRlTmFtZSwgcm91dGVQYXJhbXNcblxuICAgICAgZWxzZVxuICAgICAgICBjdXJyZW50Um91dGVOYW1lID0gaXIuUm91dGVyLmN1cnJlbnQoKT8ucm91dGU/LmdldE5hbWU/KClcblxuICAgIGlmIGZyXG4gICAgICBpZiBub3QgXy5pc0VtcHR5KHJvdXRlUGFyYW1zKSBhbmQgTWF0Y2gudGVzdCByb3V0ZU5hbWUsIFN0cmluZ1xuICAgICAgICBmci5GbG93Um91dGVyLndhdGNoUGF0aENoYW5nZSgpXG4gICAgICAgIGN1cnJlbnRQYXRoID89IGZyLkZsb3dSb3V0ZXIuY3VycmVudCgpLnBhdGhcbiAgICAgICAgcGF0aCA/PSBmci5GbG93Um91dGVyLnBhdGggcm91dGVOYW1lLCByb3V0ZVBhcmFtc1xuXG4gICAgICBlbHNlXG4gICAgICAgIGN1cnJlbnRSb3V0ZU5hbWUgPz0gZnIuRmxvd1JvdXRlci5nZXRSb3V0ZU5hbWUoKVxuXG4gICAgdGVzdCBjdXJyZW50UGF0aCBvciBjdXJyZW50Um91dGVOYW1lLCBwYXRoIG9yIHJvdXRlTmFtZVxuXG4gIHBhdGg6IChwYXRoKSAtPlxuICAgIGNoZWNrUm91dGVyUGFja2FnZXMoKVxuXG4gICAgcmV0dXJuIGlmIE1ldGVvci5pc1NlcnZlclxuXG4gICAgY2hlY2tSb3V0ZU9yUGF0aCBwYXRoXG5cbiAgICBpZiBpclxuICAgICAgY29udHJvbGxlciA9IGlyLlJvdXRlci5jdXJyZW50KClcbiAgICAgIGN1cnJlbnRQYXRoID0gY29udHJvbGxlcj8ubG9jYXRpb24uZ2V0KCkucGF0aCBpZiBjb250cm9sbGVyPy5yb3V0ZVxuXG4gICAgaWYgZnJcbiAgICAgIGZyLkZsb3dSb3V0ZXIud2F0Y2hQYXRoQ2hhbmdlKClcbiAgICAgIGN1cnJlbnRQYXRoID89IGZyLkZsb3dSb3V0ZXIuY3VycmVudCgpLnBhdGhcblxuICAgIHRlc3QgY3VycmVudFBhdGgsIHBhdGhcbiIsInZhciBjaGVja1BhcmFtcywgY2hlY2tSb3V0ZU9yUGF0aCwgY2hlY2tSb3V0ZXJQYWNrYWdlcywgZXJyb3JNZXNzYWdlcywgZnIsIGlyLCB0ZXN0OyAgICAgICAgICAgICBcblxuZnIgPSBpciA9IG51bGw7XG5cbmNoZWNrUm91dGVPclBhdGggPSBmdW5jdGlvbihhcmcpIHtcbiAgdmFyIGVycm9yO1xuICB0cnkge1xuICAgIHJldHVybiBjaGVjayhhcmcsIE1hdGNoLk9uZU9mKFJlZ0V4cCwgU3RyaW5nKSk7XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzLmludmFsaWRSb3V0ZU5hbWVBcmd1bWVudCk7XG4gIH1cbn07XG5cbmNoZWNrUGFyYW1zID0gZnVuY3Rpb24oYXJnKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2hlY2soYXJnLCBPYmplY3QpO1xuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlcy5pbnZhbGlkUm91dGVQYXJhbXNBcmd1bWVudCk7XG4gIH1cbn07XG5cbmNoZWNrUm91dGVyUGFja2FnZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgZnIgPSAocmVmID0gKHJlZjEgPSBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXInXSkgIT0gbnVsbCA/IHJlZjEgOiBQYWNrYWdlWydtZXRlb3JoYWNrczpmbG93LXJvdXRlciddKSAhPSBudWxsID8gcmVmIDogUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyLXNzciddO1xuICBpciA9IFBhY2thZ2VbJ2lyb246cm91dGVyJ107XG4gIGlmICghKGlyIHx8IGZyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzLm5vU3VwcG9ydGVkUm91dGVyKTtcbiAgfVxufTtcblxuZXJyb3JNZXNzYWdlcyA9IHtcbiAgbm9TdXBwb3J0ZWRSb3V0ZXI6ICdObyBzdXBwb3J0ZWQgcm91dGVyIGluc3RhbGxlZC4gUGxlYXNlIGluc3RhbGwgJyArICdpcm9uOnJvdXRlciBvciBtZXRlb3JoYWNrczpmbG93LXJvdXRlci4nLFxuICBpbnZhbGlkUm91dGVOYW1lQXJndW1lbnQ6ICdJbnZhbGlkIGFyZ3VtZW50LCBtdXN0IGJlIFN0cmluZyBvciBSZWdFeHAuJyxcbiAgaW52YWxpZFJvdXRlUGFyYW1zQXJndW1lbnQ6ICdJbnZhbGlkIGFyZ3VlbW50LCBtdXN0IGJlIE9iamVjdC4nXG59O1xuXG5zaGFyZS5jb25maWcgPSBuZXcgUmVhY3RpdmVEaWN0KCdhY3RpdmVSb3V0ZUNvbmZpZycpO1xuXG5zaGFyZS5jb25maWcuc2V0RGVmYXVsdCh7XG4gIGFjdGl2ZUNsYXNzOiAnYWN0aXZlJyxcbiAgY2FzZVNlbnNpdGl2ZTogdHJ1ZSxcbiAgZGlzYWJsZWRDbGFzczogJ2Rpc2FibGVkJ1xufSk7XG5cbnRlc3QgPSBmdW5jdGlvbih2YWx1ZSwgcGF0dGVybikge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChNYXRjaC50ZXN0KHBhdHRlcm4sIFJlZ0V4cCkpIHtcbiAgICByZXN1bHQgPSB2YWx1ZS5zZWFyY2gocGF0dGVybik7XG4gICAgcmVzdWx0ID0gcmVzdWx0ID4gLTE7XG4gIH0gZWxzZSBpZiAoTWF0Y2gudGVzdChwYXR0ZXJuLCBTdHJpbmcpKSB7XG4gICAgaWYgKHNoYXJlLmNvbmZpZy5lcXVhbHMoJ2Nhc2VTZW5zaXRpdmUnLCBmYWxzZSkpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIHJlc3VsdCA9IHZhbHVlID09PSBwYXR0ZXJuO1xuICB9XG4gIHJldHVybiByZXN1bHQgIT0gbnVsbCA/IHJlc3VsdCA6IHJlc3VsdCA9IGZhbHNlO1xufTtcblxuQWN0aXZlUm91dGUgPSB7XG4gIGNvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGNvbmZpZ3VyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2hhcmUuY29uZmlnLnNldChvcHRpb25zKTtcbiAgfSxcbiAgbmFtZTogZnVuY3Rpb24ocm91dGVOYW1lLCByb3V0ZVBhcmFtcyA9IHt9KSB7XG4gICAgdmFyIGNvbnRyb2xsZXIsIGN1cnJlbnRQYXRoLCBjdXJyZW50Um91dGVOYW1lLCBwYXRoLCByZWYsIHJlZjE7XG4gICAgY2hlY2tSb3V0ZXJQYWNrYWdlcygpO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgIVBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlci1zc3InXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVja1JvdXRlT3JQYXRoKHJvdXRlTmFtZSk7XG4gICAgY2hlY2tQYXJhbXMocm91dGVQYXJhbXMpO1xuICAgIGlmIChpcikge1xuICAgICAgaWYgKCFfLmlzRW1wdHkocm91dGVQYXJhbXMpICYmIE1hdGNoLnRlc3Qocm91dGVOYW1lLCBTdHJpbmcpKSB7XG4gICAgICAgIGNvbnRyb2xsZXIgPSBpci5Sb3V0ZXIuY3VycmVudCgpO1xuICAgICAgICBpZiAoY29udHJvbGxlciAhPSBudWxsID8gY29udHJvbGxlci5yb3V0ZSA6IHZvaWQgMCkge1xuICAgICAgICAgIGN1cnJlbnRQYXRoID0gY29udHJvbGxlciAhPSBudWxsID8gY29udHJvbGxlci5sb2NhdGlvbi5nZXQoKS5wYXRoIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHBhdGggPSBpci5Sb3V0ZXIucGF0aChyb3V0ZU5hbWUsIHJvdXRlUGFyYW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRSb3V0ZU5hbWUgPSAocmVmID0gaXIuUm91dGVyLmN1cnJlbnQoKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLnJvdXRlKSAhPSBudWxsID8gdHlwZW9mIHJlZjEuZ2V0TmFtZSA9PT0gXCJmdW5jdGlvblwiID8gcmVmMS5nZXROYW1lKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmcikge1xuICAgICAgaWYgKCFfLmlzRW1wdHkocm91dGVQYXJhbXMpICYmIE1hdGNoLnRlc3Qocm91dGVOYW1lLCBTdHJpbmcpKSB7XG4gICAgICAgIGZyLkZsb3dSb3V0ZXIud2F0Y2hQYXRoQ2hhbmdlKCk7XG4gICAgICAgIGlmIChjdXJyZW50UGF0aCA9PSBudWxsKSB7XG4gICAgICAgICAgY3VycmVudFBhdGggPSBmci5GbG93Um91dGVyLmN1cnJlbnQoKS5wYXRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXRoID09IG51bGwpIHtcbiAgICAgICAgICBwYXRoID0gZnIuRmxvd1JvdXRlci5wYXRoKHJvdXRlTmFtZSwgcm91dGVQYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3VycmVudFJvdXRlTmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgY3VycmVudFJvdXRlTmFtZSA9IGZyLkZsb3dSb3V0ZXIuZ2V0Um91dGVOYW1lKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlc3QoY3VycmVudFBhdGggfHwgY3VycmVudFJvdXRlTmFtZSwgcGF0aCB8fCByb3V0ZU5hbWUpO1xuICB9LFxuICBwYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIGNvbnRyb2xsZXIsIGN1cnJlbnRQYXRoO1xuICAgIGNoZWNrUm91dGVyUGFja2FnZXMoKTtcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrUm91dGVPclBhdGgocGF0aCk7XG4gICAgaWYgKGlyKSB7XG4gICAgICBjb250cm9sbGVyID0gaXIuUm91dGVyLmN1cnJlbnQoKTtcbiAgICAgIGlmIChjb250cm9sbGVyICE9IG51bGwgPyBjb250cm9sbGVyLnJvdXRlIDogdm9pZCAwKSB7XG4gICAgICAgIGN1cnJlbnRQYXRoID0gY29udHJvbGxlciAhPSBudWxsID8gY29udHJvbGxlci5sb2NhdGlvbi5nZXQoKS5wYXRoIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnIpIHtcbiAgICAgIGZyLkZsb3dSb3V0ZXIud2F0Y2hQYXRoQ2hhbmdlKCk7XG4gICAgICBpZiAoY3VycmVudFBhdGggPT0gbnVsbCkge1xuICAgICAgICBjdXJyZW50UGF0aCA9IGZyLkZsb3dSb3V0ZXIuY3VycmVudCgpLnBhdGg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXN0KGN1cnJlbnRQYXRoLCBwYXRoKTtcbiAgfVxufTtcbiJdfQ==
