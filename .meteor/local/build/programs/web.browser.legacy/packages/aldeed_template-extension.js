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
var Template = Package['templating-runtime'].Template;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;
var Spacebars = Package.spacebars.Spacebars;

/* Package-scope variables */
var Hooks;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:template-extension":{"lib":{"hooks.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/hooks.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Hooks = {
  global: {
    created: [],
    rendered: [],
    destroyed: []
  },
  master: {
    created: function () {
      Hooks.runGlobal('created', this, arguments);
    },
    rendered: function () {
      Hooks.runGlobal('rendered', this, arguments);
    },
    destroyed: function () {
      Hooks.runGlobal('destroyed', this, arguments);
    }
  }
};

Hooks.addGlobal = function (template) {
  // For each hookType, define the hooks for this template.
  // Since we might call this multiple times from startup code
  // and other functions, make sure we do it only once.
  // Doing it twice would create an infinite loop of self-calling
  // hooks.
  if (!template._hasTemplateExtensionMasterHooks) {
    template.onCreated(Hooks.master.created);
    template.onRendered(Hooks.master.rendered);
    template.onDestroyed(Hooks.master.destroyed);
    template._hasTemplateExtensionMasterHooks = true;
  }
};

Hooks.runGlobal = function (type, template, args) {
  for (var _iterator = Hooks.global[type], _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var _hook = _ref;

    _hook.apply(template, args);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-for-each.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-for-each.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.forEach = function (callback) {
  // for some reason we get the "body" template twice when looping, so
  // we track that and only call the callback once.
  var alreadyDidBody = false;

  for (var t in meteorBabelHelpers.sanitizeForInObject(Template)) {
    if (Template.hasOwnProperty(t)) {
      var tmpl = Template[t];

      if (Blaze.isTemplate(tmpl)) {
        var name = tmpl.viewName;

        if (name === 'body') {
          if (!alreadyDidBody) {
            alreadyDidBody = true;
            callback(tmpl);
          }
        } else if (name !== 'Template.__dynamic' && name !== 'Template.__dynamicWithDataContext') {
          callback(tmpl);
        }
      }
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-hooks.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-hooks.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

Template.prototype.hooks = function (hooks) {
  if (!hooks || (0, _typeof2.default)(hooks) !== 'object') {
    throw new Error('hooks argument must be an object with created, rendered, and/or destroyed properties, each set to a function');
  }

  if (typeof hooks.created === 'function') this.onCreated(hooks.created);
  if (typeof hooks.rendered === 'function') this.onRendered(hooks.rendered);
  if (typeof hooks.destroyed === 'function') this.onDestroyed(hooks.destroyed);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-global-hooks.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-global-hooks.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Setup for multiple hooks support
// We assume that no other code will be directly defining
// a hook once the client has started.
Meteor.startup(function () {
  Template.forEach(function (template) {
    Hooks.addGlobal(template);
  });
});

Template.onCreated = function (hook) {
  Hooks.global.created.push(hook);
};

Template.onRendered = function (hook) {
  Hooks.global.rendered.push(hook);
};

Template.onDestroyed = function (hook) {
  Hooks.global.destroyed.push(hook);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-for-each-instance.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-for-each-instance.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template._renderedInstances = [];
Template.onRendered(function () {
  function onRendered() {
    Template._renderedInstances.push(this);
  }

  return onRendered;
}());
Template.onDestroyed(function () {
  function onDestroyed() {
    var i = Template._renderedInstances.indexOf(this);

    if (i > -1) Template._renderedInstances.splice(i, 1);
  }

  return onDestroyed;
}());

Template.forEachCurrentlyRenderedInstance = function (func) {
  Template._renderedInstances.forEach(func);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-inherits-events-from.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-inherits-events-from.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.inheritsEventsFrom = function () {
  function inheritsEventsFrom(otherTemplate) {
    var self = this;
    self.__eventMaps = self.__eventMaps || [];

    function inheritEvents(template) {
      // String template names can be provided and template object is looked up
      if (typeof template === 'string') template = Template[template];
      if (!template) return;
      self.__eventMaps = self.__eventMaps.concat(template.__eventMaps);
    } // Accept an array as otherTemplate argument


    if (Array.isArray(otherTemplate)) {
      otherTemplate.forEach(inheritEvents);
      return;
    } // otherTemplate is a string


    inheritEvents(otherTemplate);
  }

  return inheritsEventsFrom;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-inherits-helpers-from.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-inherits-helpers-from.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.inheritsHelpersFrom = function () {
  function inheritsHelpersFrom(otherTemplate) {
    var _this = this;

    var inheritHelpers = function (template) {
      // String template names can be provided and template object is looked up
      if (typeof template === 'string') template = Template[template];
      if (!template) return;
      var inheritedHelpers = {};

      for (var name in meteorBabelHelpers.sanitizeForInObject(template.__helpers)) {
        if (template.__helpers.hasOwnProperty(name)) {
          if (name.charAt(0) === ' ') {
            inheritedHelpers[name.slice(1)] = template.__helpers[name];
          }
        }
      }

      _this.helpers(inheritedHelpers);
    }; // Accept an array as otherTemplate argument


    if (Array.isArray(otherTemplate)) {
      otherTemplate.forEach(inheritHelpers);
      return;
    } // otherTemplate is a string


    inheritHelpers(otherTemplate);
  }

  return inheritsHelpersFrom;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-inherits-hooks-from.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-inherits-hooks-from.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.inheritsHooksFrom = function () {
  function inheritsHooksFrom(otherTemplate) {
    var self = this;

    function inheritHooks(template) {
      // String template names can be provided and template object is looked up
      if (typeof template === 'string') template = Template[template];
      if (!template) return; // For this to work properly, need to ensure that we've defined
      // the global hook hook for the other template already.

      Hooks.addGlobal(template);

      for (var _iterator = template._callbacks.created, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _hook3 = _ref;
        // Don't copy the master hook because every template already has it
        if (_hook3 === Hooks.master.created) continue;
        self.onCreated(_hook3);
      }

      for (var _iterator2 = template._callbacks.rendered, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _hook4 = _ref2;
        // Don't copy the master hook because every template already has it
        if (_hook4 === Hooks.master.rendered) continue;
        self.onRendered(_hook4);
      }

      for (var _iterator3 = template._callbacks.destroyed, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var _hook5 = _ref3;
        // Don't copy the master hook because every template already has it
        if (_hook5 === Hooks.master.destroyed) continue;
        self.onDestroyed(_hook5);
      }
    } // Accept an array as otherTemplate argument


    if (Array.isArray(otherTemplate)) {
      otherTemplate.forEach(inheritHooks);
      return;
    } // otherTemplate is a string


    inheritHooks(otherTemplate);
  }

  return inheritsHooksFrom;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-register-helpers.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-register-helpers.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.registerHelpers = function (helpers) {
  if (!helpers) return;

  for (var name in meteorBabelHelpers.sanitizeForInObject(helpers)) {
    if (helpers.hasOwnProperty(name)) {
      Template.registerHelper(name, helpers[name]);
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-replaces.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-replaces.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.replaces = function () {
  function replaces(otherTemplate) {
    var self = this;

    function replaceRender(template) {
      // String template names can be provided and template object is looked up
      if (typeof template === 'string') template = Template[template];
      if (!template) return;
      template.renderFunction = self.renderFunction;
    } // Accept an array as otherTemplate argument


    if (Array.isArray(otherTemplate)) {
      otherTemplate.forEach(replaceRender);
      return;
    }

    replaceRender(otherTemplate);
  }

  return replaces;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-clear-event-maps.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-clear-event-maps.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.clearEventMaps = function () {
  function clearEventMaps() {
    this.__eventMaps = [];
  }

  return clearEventMaps;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-copy-as.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-copy-as.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Template.prototype.copyAs = function () {
  function copyAs(newTemplateName) {
    var self = this;

    function createNewTemplate(templateName) {
      var newTemplate = Template[templateName] = new Template("Template." + templateName, self.renderFunction);
      newTemplate.inheritsHelpersFrom(self);
      newTemplate.inheritsEventsFrom(self);
      newTemplate.inheritsHooksFrom(self);
      return newTemplate;
    } // Check if newTemplateName is an array


    if (Array.isArray(newTemplateName)) {
      var result = [];

      for (var _iterator = newTemplateName, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _name = _ref;
        result.push(createNewTemplate(_name));
      }

      return result;
    } // newTemplateName is a string


    return createNewTemplate(newTemplateName);
  }

  return copyAs;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-instance-parent.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-instance-parent.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * @param selector Can be a height or a function.
 *        Height. The number of levels beyond the current template instance to look.
 *        Defaults to 0.
 *
 *        Function that is given a template as we traverse up the template true. It is passed the template
 *        currently being traversed. If it returns true, then that template is returned, otherwise next is used. This
 *        is done till we hit a template with no parent, in which case null is returned.
 * @param includeBlockHelpers True to include block helpers.
 * @returns {*}
 */
Blaze.TemplateInstance.prototype.parent = function () {
  function parent(selector, includeBlockHelpers) {
    var template = null;

    if (isFinite(selector) || !selector) {
      // If height is null, undefined, or 0, we default to 1, the first parent.
      var height = !selector ? 1 : selector;
      template = parentByHeight.call(this, height, includeBlockHelpers);
    } else if (typeof selector === 'function') {
      template = parentByHeight.call(this, Number.MAX_VALUE, includeBlockHelpers, selector);
    } else {
      throw 'template:children Template.parent() is given an invalid selector type.';
    }

    return template;
  }

  return parent;
}(); // Access parent template instance. "height" is the number of levels beyond the
// current template instance to look. By default block helper template instances
// are skipped, but if "includeBlockHelpers" is set to true, they are not.
// See https://github.com/meteor/meteor/issues/3071


function parentByHeight(height, includeBlockHelpers, selector) {
  var i = 0;
  var template = this;

  while (i < height && template) {
    var view = parentView(template.view, includeBlockHelpers); // We skip contentBlock views which are injected by Meteor when using
    // block helpers (in addition to block helper view). This matches more
    // the visual structure of templates and not the internal implementation.

    while (view && (!view.template || view.name === '(contentBlock)' || view.name === '(elseBlock)')) {
      view = parentView(view, includeBlockHelpers);
    }

    if (!view) return null; // Body view has template field, but not templateInstance,
    // which more or less signals that we reached the top.

    template = typeof view.templateInstance === 'function' ? view.templateInstance() : null;

    if (!!selector && !!selector(template)) {
      return template;
    }

    i++;
  }

  return template;
}

function parentView(view, includeBlockHelpers) {
  if (includeBlockHelpers) return view.originalParentView || view.parentView;
  return view.parentView;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-instance-get.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-instance-get.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Allow easy access to a template instance field when you do not know exactly
// on which instance (this, or parent, or parent's parent, ...) a field is defined.
// This allows easy restructuring of templates in HTML, moving things to included
// templates without having to change everywhere in the code instance levels.
// It also allows different structures of templates, when once template is included
// at one level, and some other time at another. Levels do not matter anymore, just
// that the field exists somewhere.
Blaze.TemplateInstance.prototype.get = function () {
  function get(fieldName) {
    var template = this;

    while (template) {
      if (fieldName in template) return template[fieldName];
      template = template.parent(1, true);
    }
  }

  return get;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-instance-set.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-instance-set.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Allow easy setting of template instance's parent (or ancestor) field
Blaze.TemplateInstance.prototype.set = function () {
  function set(fieldName, value) {
    var template = this;

    while (template) {
      if (fieldName in template) {
        var previousValue = template[fieldName];

        if (Package['reactive-var'] && previousValue instanceof Package['reactive-var'].ReactiveVar) {
          template[fieldName].set(value);
        } else {
          template[fieldName] = value;
        }

        return previousValue;
      }

      template = template.parent(1, true);
    }
  }

  return set;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-parent-data-function.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/aldeed_template-extension/lib/template-parent-data-function.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Allow to specify a function to test parent data for at various
// levels, instead of specifying a fixed number of levels to traverse.
var originalParentData = Blaze._parentData;

Blaze._parentData = function (height, _functionWrapped) {
  // If height is not a function, simply call original implementation.
  if (typeof height !== 'function') return originalParentData(height, _functionWrapped);
  var theWith = Blaze.getView('with');

  var test = function () {
    return height(theWith.dataVar.get());
  };

  while (theWith) {
    if (Tracker.nonreactive(test)) break;
    theWith = Blaze.getView(theWith, 'with');
  } // _functionWrapped is internal and will not be
  // specified with non numeric height, so we ignore it.


  if (!theWith) return null; // This registers a Tracker dependency.

  return theWith.dataVar.get();
};

Template.parentData = Blaze._parentData;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".html"
  ]
});

require("/node_modules/meteor/aldeed:template-extension/lib/hooks.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-for-each.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-hooks.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-global-hooks.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-for-each-instance.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-inherits-events-from.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-inherits-helpers-from.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-inherits-hooks-from.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-register-helpers.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-replaces.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-clear-event-maps.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-copy-as.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-instance-parent.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-instance-get.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-instance-set.js");
require("/node_modules/meteor/aldeed:template-extension/lib/template-parent-data-function.js");

/* Exports */
Package._define("aldeed:template-extension");

})();
