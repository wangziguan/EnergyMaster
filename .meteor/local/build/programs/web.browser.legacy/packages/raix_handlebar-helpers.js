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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Session = Package.session.Session;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Helpers;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_handlebar-helpers/common.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Helper scope
if (typeof Helpers === 'undefined') {
  Helpers = {};
}

var languageText = {};

// expects an array: languageText['say.hello.to.me']['en'] = 'Say hello to me:)';
// ex.:
// getText('Say.Hello.To.Me') == 'say hello to me:)'; // lowercase
// getText('SAY.HELLO.TO.ME') == 'SAY HELLO TO ME:)'; // uppercase
// getText('Say.hello.to.me') == 'Say hello to me:)'; // uppercase first letter, rest lowercase
// getText('Say.Hello.To.Me') == 'Say Hello To Me:)'; // camelCase
// getText('SAy.hello.to.me') == 'Say hello To me:)'; // ignore case sensitivity

var _languageDeps = (Meteor.isClient) ? new Deps.Dependency() : null;
var currentLanguage = 'en';

// language = 'en'
Helpers.setLanguage = function (language) {
  if (language && language !== currentLanguage) {
    currentLanguage = language;
    if (Meteor.isClient) _languageDeps.changed();
  }
};

Helpers.language = function () {
  if (Meteor.isClient) _languageDeps.depend();
  return currentLanguage;
};

Helpers.setDictionary = function(dict) {
  languageText = dict;
};

Helpers.addDictionary = function(dict) {
  _.extend(languageText, dict);
};

// handleCase will mimic text Case making src same case as text
var handleCase = function (text, src) {
  // Return lowercase
  if (text == text.toLowerCase())
    return src.toLowerCase();
  // Return uppercase
  if (text == text.toUpperCase())
    return src.toUpperCase();
  // Return uppercase first letter, rest lowercase
  if (text.substr(1) == text.substr(1).toLowerCase())
    return src.substr(0, 1).toUpperCase() + src.substr(1).toLowerCase();
  // Return src withour changes
  if (text.substr(0, 2) == text.substr(0, 2).toUpperCase())
    return src;
  // Return CamelCase
  return src.replace(/( [a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
};

/**
 *
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
Helpers.getText = function (text, lang) {
  var txt = text.toLowerCase();
  var langText = languageText && languageText[txt];
  var langKey = (typeof lang === 'string') ? lang : Helpers.language();
  return handleCase(text, (langText) ? ( (langText[langKey]) ? langText[langKey] : langText.en) : '[' + text + ']');
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_handlebar-helpers/helpers.operators.js                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Forward compability
if (typeof UI === 'undefined' || typeof UI.registerHelper !== 'function') {
  UI = {
    registerHelper: function(name, f) {
      if (typeof Handlebars !== 'undefined') {
        return Handlebars.registerHelper(name, f);
      } else {
        throw new Error('No UI or Handlebars found');
      }
    }
  };
}

if (typeof UI !== 'undefined') {
    UI.registerHelper('getLength', function (a) {
      return a && a.length;
    });

    UI.registerHelper('isSelected', function (a, b) {
      return (a === b) ? { selected: 'selected' } : null;
    });

    UI.registerHelper('isChecked', function (a, b) {
      return (a === b) ? { checked: 'checked' } : null;
    });

    UI.registerHelper('cutString', function (str, len) {
      return (str.length > len)?str.substr(0, Math.max(len-3, 0))+'...':str;
    });

    UI.registerHelper('$eq', function (a, b) {
      return (a === b); //Only text, numbers, boolean - not array & objects
    });

    UI.registerHelper('$neq', function (a, b) {
      return (a !== b); //Only text, numbers, boolean - not array & objects
    });

    UI.registerHelper('$in', function (a, b, c, d) {
      return ( a === b || a === c || a === d);
    });

    UI.registerHelper('$nin', function (a, b, c, d) {
      return ( a !== b && a !== c && a !== d);
    });

    UI.registerHelper('$exists', function (a) {
      return ( a !== undefined);
    });

    UI.registerHelper('$lt', function (a, b) {
      return (a < b);
    });

    UI.registerHelper('$gt', function (a, b) {
      return (a > b);
    });

    UI.registerHelper('$lte', function (a, b) {
      return (a <= b);
    });

    UI.registerHelper('$gte', function (a, b) {
      return (a >= b);
    });


    UI.registerHelper('$and', function (a, b) {
      return (a && b);
    });

    UI.registerHelper('$or', function (a, b) {
      return (a || b);
    });

    UI.registerHelper('$not', function (a) {
      return (!a);
    });

    UI.registerHelper('nl2br', function (text) {
        var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Spacebars.SafeString(nl2br);
    });

    UI.registerHelper('getText', function (text, lang) { // Deprecating
      var langKey = lang || null;
      return Helpers.getText(text, langKey);
    });
    
  UI.registerHelper("$mapped", function(arr) {
    if(!Array.isArray(arr)){
      try {
        arr = arr.fetch()
      }
      catch (e){
        console.log("Error in $mapped: perhaps you aren't sending in a collection or array.")
        return [];
      }
    }
    
    var $length = arr.length;
    
    var mappedArray = arr.map(function(item,index) {
      item.$length = $length;
      item.$index = index;
      item.$first = index === 0;
      item.$last  = index === $length-1;
      return item;
    });
    
    return mappedArray || [];
  });
  
    // UI.registerHelper('userRole', function ( /* arguments */) {
    //   var role = Session.get('currentRole');
    //   return _.any(arguments, function(value) { return (value == role); });
    // });

    /*
        Then $uper helper - Credit goes to @belisarius222 aka Ted Blackman for sparking an idear for a solution
    */
    Helpers.superScope = {};

    Helpers.addScope = function(name, obj) {
      // TODO: Get rid of underscore
      Helpers.superScope[name] = _.bind(function() { return this; }, obj);
    };

    Helpers.removeScope = function(name) {
      delete UI._globalHelpers[name];
      delete Helpers.superScope[name];
    };
    
    Helpers.addScope('Session', Session);
    Helpers.addScope('Meteor', Meteor);

    UI.registerHelper('$', function() {
      return Helpers.superScope;
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("raix:handlebar-helpers", {
  Helpers: Helpers
});

})();
