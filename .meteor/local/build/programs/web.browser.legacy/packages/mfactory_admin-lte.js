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
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/mfactory_admin-lte/packages/mfactory_admin-lte.js                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/mfactory:admin-lte/template.admin-lte.js                                       //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
                                                                                           // 1
Template.__checkName("AdminLTE");                                                          // 2
Template["AdminLTE"] = new Template("Template.AdminLTE", (function() {                     // 3
  var view = this;                                                                         // 4
  return Blaze.Unless(function() {                                                         // 5
    return Spacebars.call(view.lookup("isReady"));                                         // 6
  }, function() {                                                                          // 7
    return [ "\n    ", Blaze._TemplateWith(function() {                                    // 8
      return {                                                                             // 9
        template: Spacebars.call(view.lookup("loadingTemplate"))                           // 10
      };                                                                                   // 11
    }, function() {                                                                        // 12
      return Spacebars.include(function() {                                                // 13
        return Spacebars.call(Template.__dynamic);                                         // 14
      });                                                                                  // 15
    }), "\n  " ];                                                                          // 16
  }, function() {                                                                          // 17
    return [ "\n    ", HTML.DIV({                                                          // 18
      "class": function() {                                                                // 19
        return [ "skin-", Spacebars.mustache(view.lookup("skin")) ];                       // 20
      }                                                                                    // 21
    }, "\n      ", HTML.DIV({                                                              // 22
      "class": "wrapper"                                                                   // 23
    }, "\n        ", Blaze._InOuterTemplateScope(view, function() {                        // 24
      return Spacebars.include(function() {                                                // 25
        return Spacebars.call(view.templateContentBlock);                                  // 26
      });                                                                                  // 27
    }), "\n      "), "\n    "), "\n  " ];                                                  // 28
  });                                                                                      // 29
}));                                                                                       // 30
                                                                                           // 31
Template.__checkName("AdminLTE_loading");                                                  // 32
Template["AdminLTE_loading"] = new Template("Template.AdminLTE_loading", (function() {     // 33
  var view = this;                                                                         // 34
  return HTML.Raw("<b>Loading</b>");                                                       // 35
}));                                                                                       // 36
                                                                                           // 37
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/mfactory:admin-lte/admin-lte.js                                                //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
var screenSizes = {                                                                        // 1
  xs: 480,                                                                                 // 2
  sm: 768,                                                                                 // 3
  md: 992,                                                                                 // 4
  lg: 1200                                                                                 // 5
};                                                                                         // 6
                                                                                           // 7
Template.AdminLTE.onCreated(function () {                                                  // 8
  var self = this;                                                                         // 9
  var skin = 'blue';                                                                       // 10
  var fixed = false;                                                                       // 11
  var sidebarMini = false;                                                                 // 12
                                                                                           // 13
  if (this.data) {                                                                         // 14
    skin = this.data.skin || skin;                                                         // 15
    fixed = this.data.fixed || fixed;                                                      // 16
    sidebarMini = this.data.sidebarMini || sidebarMini;                                    // 17
  }                                                                                        // 18
                                                                                           // 19
  self.isReady = new ReactiveVar(false);                                                   // 20
  self.style = waitOnCSS(cssUrl());                                                        // 21
  self.skin = waitOnCSS(skinUrl(skin));                                                    // 22
                                                                                           // 23
  fixed && $('body').addClass('fixed');                                                    // 24
  sidebarMini && $('body').addClass('sidebar-mini');                                       // 25
  self.removeClasses = function () {                                                       // 26
    fixed && $('body').removeClass('fixed');                                               // 27
    sidebarMini && $('body').removeClass('sidebar-mini');                                  // 28
  }                                                                                        // 29
                                                                                           // 30
  this.autorun(function () {                                                               // 31
    if (self.style.ready() && self.skin.ready()) {                                         // 32
      self.isReady.set(true);                                                              // 33
    }                                                                                      // 34
  });                                                                                      // 35
});                                                                                        // 36
                                                                                           // 37
Template.AdminLTE.onDestroyed(function () {                                                // 38
  this.removeClasses();                                                                    // 39
  this.style.remove();                                                                     // 40
  this.skin.remove();                                                                      // 41
});                                                                                        // 42
                                                                                           // 43
Template.AdminLTE.helpers({                                                                // 44
  isReady: function () {                                                                   // 45
    return Template.instance().isReady.get();                                              // 46
  },                                                                                       // 47
                                                                                           // 48
  loadingTemplate: function () {                                                           // 49
    return this.loadingTemplate || 'AdminLTE_loading';                                     // 50
  },                                                                                       // 51
                                                                                           // 52
  skin: function () {                                                                      // 53
    return this.skin || 'blue';                                                            // 54
  }                                                                                        // 55
});                                                                                        // 56
                                                                                           // 57
Template.AdminLTE.events({                                                                 // 58
  'click [data-toggle=offcanvas]': function (e, t) {                                       // 59
    e.preventDefault();                                                                    // 60
                                                                                           // 61
    //Enable sidebar push menu                                                             // 62
    if ($(window).width() > (screenSizes.sm - 1)) {                                        // 63
      $("body").toggleClass('sidebar-collapse');                                           // 64
    }                                                                                      // 65
    //Handle sidebar push menu for small screens                                           // 66
    else {                                                                                 // 67
      if ($("body").hasClass('sidebar-open')) {                                            // 68
        $("body").removeClass('sidebar-open');                                             // 69
        $("body").removeClass('sidebar-collapse')                                          // 70
      } else {                                                                             // 71
        $("body").addClass('sidebar-open');                                                // 72
      }                                                                                    // 73
    }                                                                                      // 74
  },                                                                                       // 75
                                                                                           // 76
  'click .content-wrapper': function (e, t) {                                              // 77
    //Enable hide menu when clicking on the content-wrapper on small screens               // 78
    if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) { // 79
      $("body").removeClass('sidebar-open');                                               // 80
    }                                                                                      // 81
  },                                                                                       // 82
                                                                                           // 83
  'click .sidebar li a': function (e, t) {                                                 // 84
    //Get the clicked link and the next element                                            // 85
    var $this = $(e.currentTarget);                                                        // 86
    var checkElement = $this.next();                                                       // 87
                                                                                           // 88
    //Check if the next element is a menu and is visible                                   // 89
    if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {            // 90
      //Close the menu                                                                     // 91
      checkElement.slideUp('normal', function () {                                         // 92
        checkElement.removeClass('menu-open');                                             // 93
      });                                                                                  // 94
      checkElement.parent("li").removeClass("active");                                     // 95
    }                                                                                      // 96
    //If the menu is not visible                                                           // 97
    else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {      // 98
      //Get the parent menu                                                                // 99
      var parent = $this.parents('ul').first();                                            // 100
      //Close all open menus within the parent                                             // 101
      var ul = parent.find('ul:visible').slideUp('normal');                                // 102
      //Remove the menu-open class from the parent                                         // 103
      ul.removeClass('menu-open');                                                         // 104
      //Get the parent li                                                                  // 105
      var parent_li = $this.parent("li");                                                  // 106
                                                                                           // 107
      //Open the target menu and add the menu-open class                                   // 108
      checkElement.slideDown('normal', function () {                                       // 109
        //Add the class active to the parent li                                            // 110
        checkElement.addClass('menu-open');                                                // 111
        parent.find('li.active').removeClass('active');                                    // 112
        parent_li.addClass('active');                                                      // 113
      });                                                                                  // 114
    }                                                                                      // 115
    //if this isn't a link, prevent the page from being redirected                         // 116
    if (checkElement.is('.treeview-menu')) {                                               // 117
      e.preventDefault();                                                                  // 118
    }                                                                                      // 119
  }                                                                                        // 120
});                                                                                        // 121
                                                                                           // 122
function cssUrl () {                                                                       // 123
  return Meteor.absoluteUrl('packages/mfactory_admin-lte/css/AdminLTE.min.css');           // 124
}                                                                                          // 125
                                                                                           // 126
function skinUrl (name) {                                                                  // 127
  return Meteor.absoluteUrl(                                                               // 128
    'packages/mfactory_admin-lte/css/skins/skin-' + name + '.min.css');                    // 129
}                                                                                          // 130
                                                                                           // 131
function waitOnCSS (url, timeout) {                                                        // 132
  var isLoaded = new ReactiveVar(false);                                                   // 133
  timeout = timeout || 5000;                                                               // 134
                                                                                           // 135
  var link = document.createElement('link');                                               // 136
  link.type = 'text/css';                                                                  // 137
  link.rel = 'stylesheet';                                                                 // 138
  link.href = url;                                                                         // 139
                                                                                           // 140
  link.onload = function () {                                                              // 141
    isLoaded.set(true);                                                                    // 142
  };                                                                                       // 143
                                                                                           // 144
  if (link.addEventListener) {                                                             // 145
    link.addEventListener('load', function () {                                            // 146
      isLoaded.set(true);                                                                  // 147
    }, false);                                                                             // 148
  }                                                                                        // 149
                                                                                           // 150
  link.onreadystatechange = function () {                                                  // 151
    var state = link.readyState;                                                           // 152
    if (state === 'loaded' || state === 'complete') {                                      // 153
      link.onreadystatechange = null;                                                      // 154
      isLoaded.set(true);                                                                  // 155
    }                                                                                      // 156
  };                                                                                       // 157
                                                                                           // 158
  var cssnum = document.styleSheets.length;                                                // 159
  var ti = setInterval(function () {                                                       // 160
    if (document.styleSheets.length > cssnum) {                                            // 161
      isLoaded.set(true);                                                                  // 162
      clearInterval(ti);                                                                   // 163
    }                                                                                      // 164
  }, 10);                                                                                  // 165
                                                                                           // 166
  setTimeout(function () {                                                                 // 167
    isLoaded.set(true);                                                                    // 168
  }, timeout);                                                                             // 169
                                                                                           // 170
  $(document.head).append(link);                                                           // 171
                                                                                           // 172
  return {                                                                                 // 173
    ready: function () {                                                                   // 174
      return isLoaded.get();                                                               // 175
    },                                                                                     // 176
                                                                                           // 177
    remove: function () {                                                                  // 178
      $('link[url="' + url + '"]').remove();                                               // 179
    }                                                                                      // 180
  };                                                                                       // 181
}                                                                                          // 182
                                                                                           // 183
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("mfactory:admin-lte");

})();
