(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var Collection2 = Package['aldeed:collection2'].Collection2;
var Roles = Package['alanning:roles'].Roles;
var Helpers = Package['raix:handlebar-helpers'].Helpers;
var enableDebugLogging = Package['reywood:publish-composite'].enableDebugLogging;
var publishComposite = Package['reywood:publish-composite'].publishComposite;
var moment = Package['momentjs:moment'].moment;
var Tabular = Package['aldeed:tabular'].Tabular;
var ActiveRoute = Package['zimme:active-route'].ActiveRoute;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Iron = Package['iron:core'].Iron;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, AdminDashboard;

var require = meteorInstall({"node_modules":{"meteor":{"wangziguan:admin":{"lib":{"both":{"AdminDashboard.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/both/AdminDashboard.coffee                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
AdminDashboard = {
  schemas: {},
  sidebarItems: [],
  collectionItems: [],
  alertSuccess: function (message) {
    return Session.set('adminSuccess', message);
  },
  alertFailure: function (message) {
    return Session.set('adminError', message);
  },
  checkAdmin: function () {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin');

      if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.nonAdminRedirectRoute : void 0) === "string") {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }

    if (typeof this.next === 'function') {
      return this.next();
    }
  },
  adminRoutes: ['adminDashboard', 'adminDashboardUsersNew', 'adminDashboardUsersEdit', 'adminDashboardView', 'adminDashboardNew', 'adminDashboardEdit'],
  collectionLabel: function (collection) {
    var ref;

    if (collection === 'Users') {
      return 'Users';
    } else if (collection != null && typeof ((ref = AdminConfig.collections[collection]) != null ? ref.label : void 0) === 'string') {
      return AdminConfig.collections[collection].label;
    } else {
      return Session.get('admin_collection_name');
    }
  },
  addSidebarItem: function (title, url, options) {
    var item;
    item = {
      title: title
    };

    if (_.isObject(url) && typeof options === 'undefined') {
      item.options = url;
    } else {
      item.url = url;
      item.options = options;
    }

    return this.sidebarItems.push(item);
  },
  extendSidebarItem: function (title, urls) {
    var existing;

    if (_.isObject(urls)) {
      urls = [urls];
    }

    existing = _.find(this.sidebarItems, function (item) {
      return item.title === title;
    });

    if (existing) {
      return existing.options.urls = _.union(existing.options.urls, urls);
    }
  },
  addCollectionItem: function (fn) {
    return this.collectionItems.push(fn);
  },
  path: function (s) {
    var path;
    path = '/admin';

    if (typeof s === 'string' && s.length > 0) {
      path += (s[0] === '/' ? '' : '/') + s;
    }

    return path;
  }
};
AdminDashboard.schemas.newUser = new SimpleSchema({
  email: {
    type: String,
    label: "Email address"
  },
  password: {
    type: String,
    label: 'Password'
  },
  sendPassword: {
    type: Boolean,
    label: 'Send this user their password by email',
    optional: true
  }
});
AdminDashboard.schemas.sendResetPasswordEmail = new SimpleSchema({
  _id: {
    type: String
  }
});
AdminDashboard.schemas.changePassword = new SimpleSchema({
  _id: {
    type: String
  },
  password: {
    type: String
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"router.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/both/router.coffee                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.AdminController = RouteController.extend({
  layoutTemplate: 'AdminLayout',
  waitOn: function () {
    return [Meteor.subscribe('adminUsers'), Meteor.subscribe('adminUser'), Meteor.subscribe('adminCollectionsCount')];
  },
  onBeforeAction: function () {
    Session.set('adminSuccess', null);
    Session.set('adminError', null);
    Session.set('admin_title', '');
    Session.set('admin_subtitle', '');
    Session.set('admin_collection_page', null);
    Session.set('admin_collection_name', null);
    Session.set('admin_id', null);
    Session.set('admin_doc', null);

    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin');

      if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.nonAdminRedirectRoute : void 0) === 'string') {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }

    return this.next();
  }
});
Router.route("adminDashboard", {
  path: "/admin",
  template: "AdminDashboard",
  controller: "AdminController",
  action: function () {
    return this.render();
  },
  onAfterAction: function () {
    Session.set('admin_title', '总览');
    Session.set('admin_collection_name', '');
    return Session.set('admin_collection_page', '');
  }
});
Router.route("adminDashboardUsersView", {
  path: "/admin/Users",
  template: "AdminDashboardView",
  controller: "AdminController",
  action: function () {
    return this.render();
  },
  data: function () {
    return {
      admin_table: AdminTables.Users
    };
  },
  onAfterAction: function () {
    Session.set('admin_title', '账号管理');
    Session.set('admin_subtitle', '');
    return Session.set('admin_collection_name', 'Users');
  }
});
Router.route("adminDashboardUsersNew", {
  path: "/admin/Users/new",
  template: "AdminDashboardUsersNew",
  controller: 'AdminController',
  action: function () {
    return this.render();
  },
  onAfterAction: function () {
    Session.set('admin_title', '账号管理');
    Session.set('admin_subtitle', '创建新用户');
    Session.set('admin_collection_page', '');
    return Session.set('admin_collection_name', 'Users');
  }
});
Router.route("adminDashboardUsersEdit", {
  path: "/admin/Users/:_id/edit",
  template: "AdminDashboardUsersEdit",
  controller: "AdminController",
  data: function () {
    return {
      user: Meteor.users.find(this.params._id).fetch(),
      roles: Roles.getRolesForUser(this.params._id),
      otherRoles: _.difference(_.map(Meteor.roles.find().fetch(), function (role) {
        return role.name;
      }), Roles.getRolesForUser(this.params._id))
    };
  },
  action: function () {
    return this.render();
  },
  onAfterAction: function () {
    Session.set('admin_title', '账号管理');
    Session.set('admin_subtitle', '编辑用户 ' + this.params._id);
    Session.set('admin_collection_page', '');
    Session.set('admin_collection_name', 'Users');
    Session.set('admin_id', this.params._id);
    return Session.set('admin_doc', Meteor.users.findOne({
      _id: this.params._id
    }));
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/both/utils.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.adminCollectionObject = function (collection) {
  if (typeof AdminConfig.collections[collection] !== 'undefined' && typeof AdminConfig.collections[collection].collectionObject !== 'undefined') {
    return AdminConfig.collections[collection].collectionObject;
  } else {
    return lookup(collection);
  }
};

this.adminCallback = function (name, args, callback) {
  var ref1, stop;
  stop = false;

  if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? (ref1 = AdminConfig.callbacks) != null ? ref1[name] : void 0 : void 0) === 'function') {
    stop = AdminConfig.callbacks[name](...args) === false;
  }

  if (typeof callback === 'function') {
    if (!stop) {
      return callback(...args);
    }
  }
};

this.lookup = function (obj, root, required = true) {
  var arr, ref;

  if (typeof root === 'undefined') {
    root = Meteor.isServer ? global : window;
  }

  if (typeof obj === 'string') {
    ref = root;
    arr = obj.split('.');

    while (arr.length && (ref = ref[arr.shift()])) {
      continue;
    }

    if (!ref && required) {
      throw new Error(obj + ' is not in the ' + root.toString());
    } else {
      return ref;
    }
  }

  return obj;
};

this.parseID = function (id) {
  if (typeof id === 'string') {
    if (id.indexOf("ObjectID") > -1) {
      return new Mongo.ObjectID(id.slice(id.indexOf('"') + 1, id.lastIndexOf('"')));
    } else {
      return id;
    }
  } else {
    return id;
  }
};

this.parseIDs = function (ids) {
  return _.map(ids, function (id) {
    return parseID(id);
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startup.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/both/startup.coffee                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var adminCreateRouteEdit, adminCreateRouteEditOptions, adminCreateRouteNew, adminCreateRouteNewOptions, adminCreateRouteView, adminCreateRouteViewOptions, adminCreateRoutes, adminCreateTables, adminDelButton, adminEditButton, adminEditDelButtons, adminPublishTables, adminTablePubName, adminTablesDom, defaultColumns;
this.AdminTables = {};
adminTablesDom = '<"box"<"box-header"<"box-toolbar"<"pull-left"<lf>><"pull-right"p>>><"box-body"t>><r>';
adminEditButton = {
  data: '_id',
  title: 'Edit',
  createdCell: function (node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminEditBtn, {
      _id: cellData
    }));
  },
  width: '40px',
  orderable: false
};
adminDelButton = {
  data: '_id',
  title: 'Delete',
  createdCell: function (node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminDeleteBtn, {
      _id: cellData
    }));
  },
  width: '40px',
  orderable: false
};
adminEditDelButtons = [adminEditButton, adminDelButton];

defaultColumns = function () {
  return [{
    data: '_id',
    title: 'ID'
  }];
};

adminTablePubName = function (collection) {
  return `admin_tabular_${collection}`;
};

adminCreateTables = function (collections) {
  return _.each(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0, function (collection, name) {
    var columns;

    _.defaults(collection, {
      showEditColumn: true,
      showDelColumn: true,
      showInSideBar: true
    });

    columns = _.map(collection.tableColumns, function (column) {
      var createdCell;

      if (column.template) {
        createdCell = function (node, cellData, rowData) {
          $(node).html('');
          return Blaze.renderWithData(Template[column.template], {
            value: cellData,
            doc: rowData
          }, node);
        };
      }

      return {
        data: column.name,
        title: column.label,
        createdCell: createdCell
      };
    });

    if (columns.length === 0) {
      columns = defaultColumns();
    }

    if (collection.showEditColumn) {
      columns.push(adminEditButton);
    }

    if (collection.showDelColumn) {
      columns.push(adminDelButton);
    }

    return AdminTables[name] = new Tabular.Table({
      name: name,
      collection: adminCollectionObject(name),
      pub: collection.children && adminTablePubName(name),
      sub: collection.sub,
      columns: columns,
      extraFields: collection.extraFields,
      dom: adminTablesDom,
      selector: collection.selector || function () {
        return {};
      }
    });
  });
};

adminCreateRoutes = function (collections) {
  _.each(collections, adminCreateRouteView);

  _.each(collections, adminCreateRouteNew);

  return _.each(collections, adminCreateRouteEdit);
};

adminCreateRouteView = function (collection, collectionName) {
  return Router.route(`adminDashboard${collectionName}View`, adminCreateRouteViewOptions(collection, collectionName));
};

adminCreateRouteViewOptions = function (collection, collectionName) {
  var options, ref;
  options = {
    path: `/admin/${collectionName}`,
    template: "AdminDashboardViewWrapper",
    controller: "AdminController",
    data: function () {
      return {
        admin_table: AdminTables[collectionName]
      };
    },
    action: function () {
      return this.render();
    },
    onAfterAction: function () {
      var ref, ref1;
      Session.set('admin_title', collectionName);
      Session.set('admin_subtitle', 'View');
      Session.set('admin_collection_name', collectionName);
      return (ref = collection.routes) != null ? (ref1 = ref.view) != null ? ref1.onAfterAction : void 0 : void 0;
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref.view : void 0);
};

adminCreateRouteNew = function (collection, collectionName) {
  return Router.route(`adminDashboard${collectionName}New`, adminCreateRouteNewOptions(collection, collectionName));
};

adminCreateRouteNewOptions = function (collection, collectionName) {
  var options, ref;
  options = {
    path: `/admin/${collectionName}/new`,
    template: "AdminDashboardNew",
    controller: "AdminController",
    action: function () {
      return this.render();
    },
    onAfterAction: function () {
      var ref, ref1;
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Create new');
      Session.set('admin_collection_page', 'new');
      Session.set('admin_collection_name', collectionName);
      return (ref = collection.routes) != null ? (ref1 = ref.new) != null ? ref1.onAfterAction : void 0 : void 0;
    },
    data: function () {
      return {
        admin_collection: adminCollectionObject(collectionName)
      };
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref.new : void 0);
};

adminCreateRouteEdit = function (collection, collectionName) {
  return Router.route(`adminDashboard${collectionName}Edit`, adminCreateRouteEditOptions(collection, collectionName));
};

adminCreateRouteEditOptions = function (collection, collectionName) {
  var options, ref;
  options = {
    path: `/admin/${collectionName}/:_id/edit`,
    template: "AdminDashboardEdit",
    controller: "AdminController",
    waitOn: function () {
      var ref, ref1;
      Meteor.subscribe('adminCollectionDoc', collectionName, parseID(this.params._id));
      return (ref = collection.routes) != null ? (ref1 = ref.edit) != null ? ref1.waitOn : void 0 : void 0;
    },
    action: function () {
      return this.render();
    },
    onAfterAction: function () {
      var ref, ref1;
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Edit ' + this.params._id);
      Session.set('admin_collection_page', 'edit');
      Session.set('admin_collection_name', collectionName);
      Session.set('admin_id', parseID(this.params._id));
      Session.set('admin_doc', adminCollectionObject(collectionName).findOne({
        _id: parseID(this.params._id)
      }));
      return (ref = collection.routes) != null ? (ref1 = ref.edit) != null ? ref1.onAfterAction : void 0 : void 0;
    },
    data: function () {
      return {
        admin_collection: adminCollectionObject(collectionName)
      };
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref.edit : void 0);
};

adminPublishTables = function (collections) {
  return _.each(collections, function (collection, name) {
    if (!collection.children) {
      return void 0;
    }

    return Meteor.publishComposite(adminTablePubName(name), function (tableName, ids, fields) {
      var extraFields;
      check(tableName, String);
      check(ids, Array);
      check(fields, Match.Optional(Object));
      extraFields = _.reduce(collection.extraFields, function (fields, name) {
        fields[name] = 1;
        return fields;
      }, {});

      _.extend(fields, extraFields);

      this.unblock();
      return {
        find: function () {
          this.unblock();
          return adminCollectionObject(name).find({
            _id: {
              $in: ids
            }
          }, {
            fields: fields
          });
        },
        children: collection.children
      };
    });
  });
};

Meteor.startup(function () {
  adminCreateTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  adminCreateRoutes(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);

  if (Meteor.isServer) {
    adminPublishTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  }

  if (AdminTables.Users) {
    return void 0;
  }

  return AdminTables.Users = new Tabular.Table({
    // Modify selector to allow search by email
    changeSelector: function (selector, userId) {
      var $or;
      $or = selector['$or'];
      $or && (selector['$or'] = _.map($or, function (exp) {
        var ref;

        if (((ref = exp.emails) != null ? ref['$regex'] : void 0) != null) {
          return {
            emails: {
              $elemMatch: {
                address: exp.emails
              }
            }
          };
        } else {
          return exp;
        }
      }));
      return selector;
    },
    name: 'Users',
    collection: Meteor.users,
    columns: _.union([{
      data: '_id',
      title: 'Admin',
      // TODO: use `tmpl`
      createdCell: function (node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminUsersIsAdmin, {
          _id: cellData
        }));
      },
      width: '40px'
    }, {
      data: 'emails',
      title: 'Email',
      render: function (value) {
        return value[0].address;
      },
      searchable: true
    }, {
      data: 'emails',
      title: 'Mail',
      // TODO: use `tmpl`
      createdCell: function (node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminUsersMailBtn, {
          emails: cellData
        }));
      },
      width: '40px'
    }, {
      data: 'createdAt',
      title: 'Joined'
    }], adminEditDelButtons),
    dom: adminTablesDom
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collections.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/both/collections.coffee                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.AdminCollectionsCount = new Mongo.Collection('adminCollectionsCount');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publish.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/server/publish.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publishComposite('adminCollectionDoc', function (collection, id) {
  var ref, ref1;
  check(collection, String);
  check(id, Match.OneOf(String, Mongo.ObjectID));

  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return {
      find: function () {
        return adminCollectionObject(collection).find(id);
      },
      children: (typeof AdminConfig !== "undefined" && AdminConfig !== null ? (ref = AdminConfig.collections) != null ? (ref1 = ref[collection]) != null ? ref1.children : void 0 : void 0 : void 0) || []
    };
  } else {
    return this.ready();
  }
});
Meteor.publish('adminUsers', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find();
  } else {
    return this.ready();
  }
});
Meteor.publish('adminUser', function () {
  return Meteor.users.find(this.userId);
});
Meteor.publish('adminCollectionsCount', function () {
  var handles, self;
  handles = [];
  self = this;

  _.each(AdminTables, function (table, name) {
    var count, id, ready, selector;
    id = new Mongo.ObjectID();
    count = 0;
    table = AdminTables[name];
    ready = false;
    selector = table.selector ? table.selector(self.userId) : {};
    handles.push(table.collection.find().observeChanges({
      added: function () {
        count += 1;
        return ready && self.changed('adminCollectionsCount', id, {
          count: count
        });
      },
      removed: function () {
        count -= 1;
        return ready && self.changed('adminCollectionsCount', id, {
          count: count
        });
      }
    }));
    ready = true;
    return self.added('adminCollectionsCount', id, {
      collection: name,
      count: count
    });
  });

  self.onStop(function () {
    return _.each(handles, function (handle) {
      return handle.stop();
    });
  });
  return self.ready();
});
Meteor.publish(null, function () {
  return Meteor.roles.find({});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/wangziguan_admin/lib/server/methods.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  adminInsertDoc: function (doc, collection) {
    var result;
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock();
      result = adminCollectionObject(collection).insert(doc);
      return result;
    }
  },
  adminUpdateDoc: function (modifier, collection, _id) {
    var result;
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock();
      result = adminCollectionObject(collection).update({
        _id: _id
      }, modifier);
      return result;
    }
  },
  adminRemoveDoc: function (collection, _id) {
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (collection === 'Users') {
        return Meteor.users.remove({
          _id: _id
        });
      } else {
        // global[collection].remove {_id:_id}
        return adminCollectionObject(collection).remove({
          _id: _id
        });
      }
    }
  },
  adminNewUser: function (doc) {
    var emails;
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      emails = doc.email.split(',');
      return _.each(emails, function (email) {
        var _id, user;

        user = {};
        user.email = email;
        user.password = doc.password;
        _id = Accounts.createUser(user);

        if (doc.sendPassword && AdminConfig.fromEmail != null) {
          Email.send({
            to: user.email,
            from: AdminConfig.fromEmail,
            subject: 'Your account has been created',
            html: 'You\'ve just had an account created for ' + Meteor.absoluteUrl() + ' with password ' + doc.password
          });
        }

        if (!doc.sendPassword) {
          return Accounts.sendEnrollmentEmail(_id);
        }
      });
    }
  },
  adminUpdateUser: function (modifier, _id) {
    var result;
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock();
      result = Meteor.users.update({
        _id: _id
      }, modifier);
      return result;
    }
  },
  adminSendResetPasswordEmail: function (doc) {
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('Changing password for user ' + doc._id);
      return Accounts.sendResetPasswordEmail(doc._id);
    }
  },
  adminChangePassword: function (doc) {
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('Changing password for user ' + doc._id);
      Accounts.setPassword(doc._id, doc.password);
      return {
        label: 'Email user their new password'
      };
    }
  },
  adminCheckAdmin: function () {
    var adminEmails, email, user;
    check(arguments, [Match.Any]);
    user = Meteor.users.findOne({
      _id: this.userId
    });

    if (this.userId && !Roles.userIsInRole(this.userId, ['admin']) && user.emails.length > 0) {
      email = user.emails[0].address;

      if (typeof Meteor.settings.adminEmails !== 'undefined') {
        adminEmails = Meteor.settings.adminEmails;

        if (adminEmails.indexOf(email) > -1) {
          console.log('Adding admin user: ' + email);
          return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        }
      } else if (typeof AdminConfig !== 'undefined' && typeof AdminConfig.adminEmails === 'object') {
        adminEmails = AdminConfig.adminEmails;

        if (adminEmails.indexOf(email) > -1) {
          console.log('Adding admin user: ' + email);
          return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        }
      } else if (this.userId === Meteor.users.findOne({}, {
        sort: {
          createdAt: 1
        }
      })._id) {
        console.log('Making first user admin: ' + email);
        return Roles.addUsersToRoles(this.userId, ['admin']);
      }
    }
  },
  adminAddUserToRole: function (_id, role) {
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.addUsersToRoles(_id, role, Roles.GLOBAL_GROUP);
    }
  },
  adminRemoveUserToRole: function (_id, role) {
    check(arguments, [Match.Any]);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.removeUsersFromRoles(_id, role, Roles.GLOBAL_GROUP);
    }
  },
  adminSetCollectionSort: function (collection, _sort) {
    check(arguments, [Match.Any]);
    return global.AdminPages[collection].set({
      sort: _sort
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"simpl-schema":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/wangziguan_admin/node_modules/simpl-schema/package.json                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "simpl-schema",
  "version": "1.5.3",
  "main": "./dist/main.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/wangziguan_admin/node_modules/simpl-schema/dist/main.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/wangziguan:admin/lib/both/AdminDashboard.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/both/router.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/both/utils.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/both/startup.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/both/collections.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/server/publish.coffee");
require("/node_modules/meteor/wangziguan:admin/lib/server/methods.coffee");

/* Exports */
Package._define("wangziguan:admin", {
  AdminDashboard: AdminDashboard
});

})();

//# sourceURL=meteor://💻app/packages/wangziguan_admin.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2FuZ3ppZ3Vhbl9hZG1pbi9saWIvYm90aC9BZG1pbkRhc2hib2FyZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9ib3RoL0FkbWluRGFzaGJvYXJkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2FuZ3ppZ3Vhbl9hZG1pbi9saWIvYm90aC9yb3V0ZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvYm90aC9yb3V0ZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy93YW5nemlndWFuX2FkbWluL2xpYi9ib3RoL3V0aWxzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2JvdGgvdXRpbHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy93YW5nemlndWFuX2FkbWluL2xpYi9ib3RoL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvYm90aC9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2FuZ3ppZ3Vhbl9hZG1pbi9saWIvYm90aC9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3dhbmd6aWd1YW5fYWRtaW4vbGliL3NlcnZlci9wdWJsaXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3NlcnZlci9wdWJsaXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2FuZ3ppZ3Vhbl9hZG1pbi9saWIvc2VydmVyL21ldGhvZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2VydmVyL21ldGhvZHMuY29mZmVlIl0sIm5hbWVzIjpbIlNpbXBsZVNjaGVtYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsIkFkbWluRGFzaGJvYXJkIiwic2NoZW1hcyIsInNpZGViYXJJdGVtcyIsImNvbGxlY3Rpb25JdGVtcyIsImFsZXJ0U3VjY2VzcyIsIm1lc3NhZ2UiLCJTZXNzaW9uIiwic2V0IiwiYWxlcnRGYWlsdXJlIiwiY2hlY2tBZG1pbiIsIlJvbGVzIiwidXNlcklzSW5Sb2xlIiwiTWV0ZW9yIiwidXNlcklkIiwiY2FsbCIsIkFkbWluQ29uZmlnIiwibm9uQWRtaW5SZWRpcmVjdFJvdXRlIiwiUm91dGVyIiwiZ28iLCJuZXh0IiwiYWRtaW5Sb3V0ZXMiLCJjb2xsZWN0aW9uTGFiZWwiLCJjb2xsZWN0aW9uIiwicmVmIiwiY29sbGVjdGlvbnMiLCJsYWJlbCIsImdldCIsImFkZFNpZGViYXJJdGVtIiwidGl0bGUiLCJ1cmwiLCJvcHRpb25zIiwiaXRlbSIsIl8iLCJpc09iamVjdCIsInB1c2giLCJleHRlbmRTaWRlYmFySXRlbSIsInVybHMiLCJleGlzdGluZyIsImZpbmQiLCJ1bmlvbiIsImFkZENvbGxlY3Rpb25JdGVtIiwiZm4iLCJwYXRoIiwicyIsImxlbmd0aCIsIm5ld1VzZXIiLCJlbWFpbCIsInR5cGUiLCJTdHJpbmciLCJwYXNzd29yZCIsInNlbmRQYXNzd29yZCIsIkJvb2xlYW4iLCJvcHRpb25hbCIsInNlbmRSZXNldFBhc3N3b3JkRW1haWwiLCJfaWQiLCJjaGFuZ2VQYXNzd29yZCIsIkFkbWluQ29udHJvbGxlciIsIlJvdXRlQ29udHJvbGxlciIsImV4dGVuZCIsImxheW91dFRlbXBsYXRlIiwid2FpdE9uIiwic3Vic2NyaWJlIiwib25CZWZvcmVBY3Rpb24iLCJyb3V0ZSIsInRlbXBsYXRlIiwiY29udHJvbGxlciIsImFjdGlvbiIsInJlbmRlciIsIm9uQWZ0ZXJBY3Rpb24iLCJkYXRhIiwiYWRtaW5fdGFibGUiLCJBZG1pblRhYmxlcyIsIlVzZXJzIiwidXNlciIsInVzZXJzIiwicGFyYW1zIiwiZmV0Y2giLCJyb2xlcyIsImdldFJvbGVzRm9yVXNlciIsIm90aGVyUm9sZXMiLCJkaWZmZXJlbmNlIiwibWFwIiwicm9sZSIsIm5hbWUiLCJmaW5kT25lIiwiYWRtaW5Db2xsZWN0aW9uT2JqZWN0IiwiY29sbGVjdGlvbk9iamVjdCIsImxvb2t1cCIsImFkbWluQ2FsbGJhY2siLCJhcmdzIiwiY2FsbGJhY2siLCJyZWYxIiwic3RvcCIsImNhbGxiYWNrcyIsIm9iaiIsInJvb3QiLCJyZXF1aXJlZCIsImFyciIsImlzU2VydmVyIiwiZ2xvYmFsIiwid2luZG93Iiwic3BsaXQiLCJzaGlmdCIsIkVycm9yIiwidG9TdHJpbmciLCJwYXJzZUlEIiwiaWQiLCJpbmRleE9mIiwiTW9uZ28iLCJPYmplY3RJRCIsInNsaWNlIiwibGFzdEluZGV4T2YiLCJwYXJzZUlEcyIsImlkcyIsImFkbWluQ3JlYXRlUm91dGVFZGl0IiwiYWRtaW5DcmVhdGVSb3V0ZUVkaXRPcHRpb25zIiwiYWRtaW5DcmVhdGVSb3V0ZU5ldyIsImFkbWluQ3JlYXRlUm91dGVOZXdPcHRpb25zIiwiYWRtaW5DcmVhdGVSb3V0ZVZpZXciLCJhZG1pbkNyZWF0ZVJvdXRlVmlld09wdGlvbnMiLCJhZG1pbkNyZWF0ZVJvdXRlcyIsImFkbWluQ3JlYXRlVGFibGVzIiwiYWRtaW5EZWxCdXR0b24iLCJhZG1pbkVkaXRCdXR0b24iLCJhZG1pbkVkaXREZWxCdXR0b25zIiwiYWRtaW5QdWJsaXNoVGFibGVzIiwiYWRtaW5UYWJsZVB1Yk5hbWUiLCJhZG1pblRhYmxlc0RvbSIsImRlZmF1bHRDb2x1bW5zIiwiY3JlYXRlZENlbGwiLCJub2RlIiwiY2VsbERhdGEiLCJyb3dEYXRhIiwiJCIsImh0bWwiLCJCbGF6ZSIsInRvSFRNTFdpdGhEYXRhIiwiVGVtcGxhdGUiLCJhZG1pbkVkaXRCdG4iLCJ3aWR0aCIsIm9yZGVyYWJsZSIsImFkbWluRGVsZXRlQnRuIiwiZWFjaCIsImNvbHVtbnMiLCJkZWZhdWx0cyIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsInNob3dJblNpZGVCYXIiLCJ0YWJsZUNvbHVtbnMiLCJjb2x1bW4iLCJyZW5kZXJXaXRoRGF0YSIsInZhbHVlIiwiZG9jIiwiVGFidWxhciIsIlRhYmxlIiwicHViIiwiY2hpbGRyZW4iLCJzdWIiLCJleHRyYUZpZWxkcyIsImRvbSIsInNlbGVjdG9yIiwiY29sbGVjdGlvbk5hbWUiLCJyb3V0ZXMiLCJ2aWV3IiwibmV3IiwiYWRtaW5fY29sbGVjdGlvbiIsImVkaXQiLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiZmllbGRzIiwiY2hlY2siLCJBcnJheSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPYmplY3QiLCJyZWR1Y2UiLCJ1bmJsb2NrIiwiJGluIiwic3RhcnR1cCIsImNoYW5nZVNlbGVjdG9yIiwiJG9yIiwiZXhwIiwiZW1haWxzIiwiJGVsZW1NYXRjaCIsImFkZHJlc3MiLCJhZG1pblVzZXJzSXNBZG1pbiIsInNlYXJjaGFibGUiLCJhZG1pblVzZXJzTWFpbEJ0biIsIkFkbWluQ29sbGVjdGlvbnNDb3VudCIsIkNvbGxlY3Rpb24iLCJPbmVPZiIsInJlYWR5IiwicHVibGlzaCIsImhhbmRsZXMiLCJzZWxmIiwidGFibGUiLCJjb3VudCIsIm9ic2VydmVDaGFuZ2VzIiwiYWRkZWQiLCJjaGFuZ2VkIiwicmVtb3ZlZCIsIm9uU3RvcCIsImhhbmRsZSIsIm1ldGhvZHMiLCJhZG1pbkluc2VydERvYyIsInJlc3VsdCIsImFyZ3VtZW50cyIsIkFueSIsImluc2VydCIsImFkbWluVXBkYXRlRG9jIiwibW9kaWZpZXIiLCJ1cGRhdGUiLCJhZG1pblJlbW92ZURvYyIsInJlbW92ZSIsImFkbWluTmV3VXNlciIsIkFjY291bnRzIiwiY3JlYXRlVXNlciIsImZyb21FbWFpbCIsIkVtYWlsIiwic2VuZCIsInRvIiwiZnJvbSIsInN1YmplY3QiLCJhYnNvbHV0ZVVybCIsInNlbmRFbnJvbGxtZW50RW1haWwiLCJhZG1pblVwZGF0ZVVzZXIiLCJhZG1pblNlbmRSZXNldFBhc3N3b3JkRW1haWwiLCJjb25zb2xlIiwibG9nIiwiYWRtaW5DaGFuZ2VQYXNzd29yZCIsInNldFBhc3N3b3JkIiwiYWRtaW5DaGVja0FkbWluIiwiYWRtaW5FbWFpbHMiLCJzZXR0aW5ncyIsImFkZFVzZXJzVG9Sb2xlcyIsIkdMT0JBTF9HUk9VUCIsInNvcnQiLCJjcmVhdGVkQXQiLCJhZG1pbkFkZFVzZXJUb1JvbGUiLCJhZG1pblJlbW92ZVVzZXJUb1JvbGUiLCJyZW1vdmVVc2Vyc0Zyb21Sb2xlcyIsImFkbWluU2V0Q29sbGVjdGlvblNvcnQiLCJfc29ydCIsIkFkbWluUGFnZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLFlBQUE7QUFBQUMsTUFBQSxDQUFBQyxJQUFBO0FBQUFDLFNBQUEsQ0FBQUMsQ0FBQTtBQUFBSixnQkFBQSxHQUFBSSxDQUFBO0FBQUE7O0FBQUE7QUFFQUMsY0FBQSxHQUNDO0FBQUFDLFNBQUEsRUFBUyxFQUFUO0FBQ0FDLGNBQUEsRUFBYyxFQURkO0FBRUFDLGlCQUFBLEVBQWlCLEVBRmpCO0FBR0FDLGNBQUEsRUFBYyxVQUFDQyxPQUFEO0FDR1gsV0RGRkMsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWixFQUE0QkYsT0FBNUIsQ0NFRTtBRE5IO0FBS0FHLGNBQUEsRUFBYyxVQUFDSCxPQUFEO0FDSVgsV0RIRkMsT0FBTyxDQUFDQyxHQUFSLENBQVksWUFBWixFQUEwQkYsT0FBMUIsQ0NHRTtBRFRIO0FBUUFJLFlBQUEsRUFBWTtBQUNYLFFBQUcsQ0FBSUMsS0FBSyxDQUFDQyxZQUFOLENBQW1CQyxNQUFNLENBQUNDLE1BQVAsRUFBbkIsRUFBb0MsQ0FBQyxPQUFELENBQXBDLENBQVA7QUFDQ0QsWUFBTSxDQUFDRSxJQUFQLENBQVksaUJBQVo7O0FBQ0EsVUFBSSxlQUFBQyxXQUFBLG9CQUFBQSxXQUFBLFlBQU9BLFdBQVcsQ0FBRUMscUJBQXBCLEdBQW9CLE1BQXBCLE1BQTZDLFFBQWpEO0FBQ0NDLGNBQU0sQ0FBQ0MsRUFBUCxDQUFVSCxXQUFXLENBQUNDLHFCQUF0QjtBQUhGO0FDUUc7O0FESkgsUUFBRyxPQUFPLEtBQUVHLElBQVQsS0FBaUIsVUFBcEI7QUNNSSxhRExILEtBQUNBLElBQUQsRUNLRztB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LFVBQVAsQ0FBa0I3TixVQUFsQixFQUE4QmYsR0FBOUIsQ0FDQztBQUFBcU8sVUFBQSxFQUFNTTtBQUFOLEtBREQsQ0NtQ0U7QURyQ3FCO0FBL0Z4QixDQURELEUiLCJmaWxlIjoiL3BhY2thZ2VzL3dhbmd6aWd1YW5fYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbkFkbWluRGFzaGJvYXJkID1cblx0c2NoZW1hczoge31cblx0c2lkZWJhckl0ZW1zOiBbXVxuXHRjb2xsZWN0aW9uSXRlbXM6IFtdXG5cdGFsZXJ0U3VjY2VzczogKG1lc3NhZ2UpLT5cblx0XHRTZXNzaW9uLnNldCAnYWRtaW5TdWNjZXNzJywgbWVzc2FnZVxuXHRhbGVydEZhaWx1cmU6IChtZXNzYWdlKS0+XG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluRXJyb3InLCBtZXNzYWdlXG5cblx0Y2hlY2tBZG1pbjogLT5cblx0XHRpZiBub3QgUm9sZXMudXNlcklzSW5Sb2xlIE1ldGVvci51c2VySWQoKSwgWydhZG1pbiddXG5cdFx0XHRNZXRlb3IuY2FsbCAnYWRtaW5DaGVja0FkbWluJ1xuXHRcdFx0aWYgKHR5cGVvZiBBZG1pbkNvbmZpZz8ubm9uQWRtaW5SZWRpcmVjdFJvdXRlID09IFwic3RyaW5nXCIpXG5cdFx0XHRcdFJvdXRlci5nbyBBZG1pbkNvbmZpZy5ub25BZG1pblJlZGlyZWN0Um91dGVcblx0XHRpZiB0eXBlb2YgQC5uZXh0ID09ICdmdW5jdGlvbidcblx0XHRcdEBuZXh0KClcblx0YWRtaW5Sb3V0ZXM6IFsnYWRtaW5EYXNoYm9hcmQnLCdhZG1pbkRhc2hib2FyZFVzZXJzTmV3JywnYWRtaW5EYXNoYm9hcmRVc2Vyc0VkaXQnLCdhZG1pbkRhc2hib2FyZFZpZXcnLCdhZG1pbkRhc2hib2FyZE5ldycsJ2FkbWluRGFzaGJvYXJkRWRpdCddXG5cdGNvbGxlY3Rpb25MYWJlbDogKGNvbGxlY3Rpb24pLT5cblx0XHRpZiBjb2xsZWN0aW9uID09ICdVc2Vycydcblx0XHRcdCdVc2Vycydcblx0XHRlbHNlIGlmIGNvbGxlY3Rpb24/IGFuZCB0eXBlb2YgQWRtaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0/LmxhYmVsID09ICdzdHJpbmcnXG5cdFx0XHRBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXS5sYWJlbFxuXHRcdGVsc2UgU2Vzc2lvbi5nZXQgJ2FkbWluX2NvbGxlY3Rpb25fbmFtZSdcblxuXHRhZGRTaWRlYmFySXRlbTogKHRpdGxlLCB1cmwsIG9wdGlvbnMpIC0+XG5cdFx0aXRlbSA9IHRpdGxlOiB0aXRsZVxuXHRcdGlmIF8uaXNPYmplY3QodXJsKSBhbmQgdHlwZW9mIG9wdGlvbnMgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdGl0ZW0ub3B0aW9ucyA9IHVybFxuXHRcdGVsc2Vcblx0XHRcdGl0ZW0udXJsID0gdXJsXG5cdFx0XHRpdGVtLm9wdGlvbnMgPSBvcHRpb25zXG5cblx0XHRAc2lkZWJhckl0ZW1zLnB1c2ggaXRlbVxuXG5cdGV4dGVuZFNpZGViYXJJdGVtOiAodGl0bGUsIHVybHMpIC0+XG5cdFx0aWYgXy5pc09iamVjdCh1cmxzKSB0aGVuIHVybHMgPSBbdXJsc11cblxuXHRcdGV4aXN0aW5nID0gXy5maW5kIEBzaWRlYmFySXRlbXMsIChpdGVtKSAtPiBpdGVtLnRpdGxlID09IHRpdGxlXG5cdFx0aWYgZXhpc3Rpbmdcblx0XHRcdGV4aXN0aW5nLm9wdGlvbnMudXJscyA9IF8udW5pb24gZXhpc3Rpbmcub3B0aW9ucy51cmxzLCB1cmxzXG5cblx0YWRkQ29sbGVjdGlvbkl0ZW06IChmbikgLT5cblx0XHRAY29sbGVjdGlvbkl0ZW1zLnB1c2ggZm5cblxuXHRwYXRoOiAocykgLT5cblx0XHRwYXRoID0gJy9hZG1pbidcblx0XHRpZiB0eXBlb2YgcyA9PSAnc3RyaW5nJyBhbmQgcy5sZW5ndGggPiAwXG5cdFx0XHRwYXRoICs9IChpZiBzWzBdID09ICcvJyB0aGVuICcnIGVsc2UgJy8nKSArIHNcblx0XHRwYXRoXG5cblxuQWRtaW5EYXNoYm9hcmQuc2NoZW1hcy5uZXdVc2VyID0gbmV3IFNpbXBsZVNjaGVtYVxuXHRlbWFpbDogXG5cdFx0dHlwZTogU3RyaW5nXG5cdFx0bGFiZWw6IFwiRW1haWwgYWRkcmVzc1wiXG5cdHBhc3N3b3JkOlxuXHRcdHR5cGU6IFN0cmluZ1xuXHRcdGxhYmVsOiAnUGFzc3dvcmQnXG5cdHNlbmRQYXNzd29yZDpcblx0XHR0eXBlOiBCb29sZWFuXG5cdFx0bGFiZWw6ICdTZW5kIHRoaXMgdXNlciB0aGVpciBwYXNzd29yZCBieSBlbWFpbCdcblx0XHRvcHRpb25hbDogdHJ1ZVxuXG5BZG1pbkRhc2hib2FyZC5zY2hlbWFzLnNlbmRSZXNldFBhc3N3b3JkRW1haWwgPSBuZXcgU2ltcGxlU2NoZW1hXG5cdF9pZDpcblx0XHR0eXBlOiBTdHJpbmdcblxuQWRtaW5EYXNoYm9hcmQuc2NoZW1hcy5jaGFuZ2VQYXNzd29yZCA9IG5ldyBTaW1wbGVTY2hlbWFcblx0X2lkOlxuXHRcdHR5cGU6IFN0cmluZ1xuXHRwYXNzd29yZDpcblx0XHR0eXBlOiBTdHJpbmdcbiIsIiAgICAgICAgICAgICAgICAgICBcblxuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5BZG1pbkRhc2hib2FyZCA9IHtcbiAgc2NoZW1hczoge30sXG4gIHNpZGViYXJJdGVtczogW10sXG4gIGNvbGxlY3Rpb25JdGVtczogW10sXG4gIGFsZXJ0U3VjY2VzczogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHJldHVybiBTZXNzaW9uLnNldCgnYWRtaW5TdWNjZXNzJywgbWVzc2FnZSk7XG4gIH0sXG4gIGFsZXJ0RmFpbHVyZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHJldHVybiBTZXNzaW9uLnNldCgnYWRtaW5FcnJvcicsIG1lc3NhZ2UpO1xuICB9LFxuICBjaGVja0FkbWluOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSkpIHtcbiAgICAgIE1ldGVvci5jYWxsKCdhZG1pbkNoZWNrQWRtaW4nKTtcbiAgICAgIGlmICh0eXBlb2YgKHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLm5vbkFkbWluUmVkaXJlY3RSb3V0ZSA6IHZvaWQgMCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgUm91dGVyLmdvKEFkbWluQ29uZmlnLm5vbkFkbWluUmVkaXJlY3RSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KCk7XG4gICAgfVxuICB9LFxuICBhZG1pblJvdXRlczogWydhZG1pbkRhc2hib2FyZCcsICdhZG1pbkRhc2hib2FyZFVzZXJzTmV3JywgJ2FkbWluRGFzaGJvYXJkVXNlcnNFZGl0JywgJ2FkbWluRGFzaGJvYXJkVmlldycsICdhZG1pbkRhc2hib2FyZE5ldycsICdhZG1pbkRhc2hib2FyZEVkaXQnXSxcbiAgY29sbGVjdGlvbkxhYmVsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gJ1VzZXJzJykge1xuICAgICAgcmV0dXJuICdVc2Vycyc7XG4gICAgfSBlbHNlIGlmICgoY29sbGVjdGlvbiAhPSBudWxsKSAmJiB0eXBlb2YgKChyZWYgPSBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSkgIT0gbnVsbCA/IHJlZi5sYWJlbCA6IHZvaWQgMCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gQWRtaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0ubGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYWRtaW5fY29sbGVjdGlvbl9uYW1lJyk7XG4gICAgfVxuICB9LFxuICBhZGRTaWRlYmFySXRlbTogZnVuY3Rpb24odGl0bGUsIHVybCwgb3B0aW9ucykge1xuICAgIHZhciBpdGVtO1xuICAgIGl0ZW0gPSB7XG4gICAgICB0aXRsZTogdGl0bGVcbiAgICB9O1xuICAgIGlmIChfLmlzT2JqZWN0KHVybCkgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpdGVtLm9wdGlvbnMgPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW0udXJsID0gdXJsO1xuICAgICAgaXRlbS5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lkZWJhckl0ZW1zLnB1c2goaXRlbSk7XG4gIH0sXG4gIGV4dGVuZFNpZGViYXJJdGVtOiBmdW5jdGlvbih0aXRsZSwgdXJscykge1xuICAgIHZhciBleGlzdGluZztcbiAgICBpZiAoXy5pc09iamVjdCh1cmxzKSkge1xuICAgICAgdXJscyA9IFt1cmxzXTtcbiAgICB9XG4gICAgZXhpc3RpbmcgPSBfLmZpbmQodGhpcy5zaWRlYmFySXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnRpdGxlID09PSB0aXRsZTtcbiAgICB9KTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiBleGlzdGluZy5vcHRpb25zLnVybHMgPSBfLnVuaW9uKGV4aXN0aW5nLm9wdGlvbnMudXJscywgdXJscyk7XG4gICAgfVxuICB9LFxuICBhZGRDb2xsZWN0aW9uSXRlbTogZnVuY3Rpb24oZm4pIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uSXRlbXMucHVzaChmbik7XG4gIH0sXG4gIHBhdGg6IGZ1bmN0aW9uKHMpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gJy9hZG1pbic7XG4gICAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJyAmJiBzLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhdGggKz0gKHNbMF0gPT09ICcvJyA/ICcnIDogJy8nKSArIHM7XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG59O1xuXG5BZG1pbkRhc2hib2FyZC5zY2hlbWFzLm5ld1VzZXIgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgbGFiZWw6IFwiRW1haWwgYWRkcmVzc1wiXG4gIH0sXG4gIHBhc3N3b3JkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGxhYmVsOiAnUGFzc3dvcmQnXG4gIH0sXG4gIHNlbmRQYXNzd29yZDoge1xuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgbGFiZWw6ICdTZW5kIHRoaXMgdXNlciB0aGVpciBwYXNzd29yZCBieSBlbWFpbCcsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfVxufSk7XG5cbkFkbWluRGFzaGJvYXJkLnNjaGVtYXMuc2VuZFJlc2V0UGFzc3dvcmRFbWFpbCA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbkFkbWluRGFzaGJvYXJkLnNjaGVtYXMuY2hhbmdlUGFzc3dvcmQgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHBhc3N3b3JkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuIiwiQEFkbWluQ29udHJvbGxlciA9IFJvdXRlQ29udHJvbGxlci5leHRlbmRcblx0bGF5b3V0VGVtcGxhdGU6ICdBZG1pbkxheW91dCdcblx0d2FpdE9uOiAtPlxuXHRcdFtcblx0XHRcdE1ldGVvci5zdWJzY3JpYmUgJ2FkbWluVXNlcnMnXG5cdFx0XHRNZXRlb3Iuc3Vic2NyaWJlICdhZG1pblVzZXInXG5cdFx0XHRNZXRlb3Iuc3Vic2NyaWJlICdhZG1pbkNvbGxlY3Rpb25zQ291bnQnXG5cdFx0XVxuXHRvbkJlZm9yZUFjdGlvbjogLT5cblx0XHRTZXNzaW9uLnNldCAnYWRtaW5TdWNjZXNzJywgbnVsbFxuXHRcdFNlc3Npb24uc2V0ICdhZG1pbkVycm9yJywgbnVsbFxuXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX3RpdGxlJywgJydcblx0XHRTZXNzaW9uLnNldCAnYWRtaW5fc3VidGl0bGUnLCAnJ1xuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCBudWxsXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsIG51bGxcblx0XHRTZXNzaW9uLnNldCAnYWRtaW5faWQnLCBudWxsXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2RvYycsIG51bGxcblxuXHRcdGlmIG5vdCBSb2xlcy51c2VySXNJblJvbGUgTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ11cblx0XHRcdE1ldGVvci5jYWxsICdhZG1pbkNoZWNrQWRtaW4nXG5cdFx0XHRpZiB0eXBlb2YgQWRtaW5Db25maWc/Lm5vbkFkbWluUmVkaXJlY3RSb3V0ZSA9PSAnc3RyaW5nJ1xuXHRcdFx0XHRSb3V0ZXIuZ28gQWRtaW5Db25maWcubm9uQWRtaW5SZWRpcmVjdFJvdXRlXG5cblx0XHRAbmV4dCgpXG5cblxuUm91dGVyLnJvdXRlIFwiYWRtaW5EYXNoYm9hcmRcIixcblx0cGF0aDogXCIvYWRtaW5cIlxuXHR0ZW1wbGF0ZTogXCJBZG1pbkRhc2hib2FyZFwiXG5cdGNvbnRyb2xsZXI6IFwiQWRtaW5Db250cm9sbGVyXCJcblx0YWN0aW9uOiAtPlxuXHRcdEByZW5kZXIoKVxuXHRvbkFmdGVyQWN0aW9uOiAtPlxuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl90aXRsZScsICfmgLvop4gnXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsICcnXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fcGFnZScsICcnXG5cblJvdXRlci5yb3V0ZSBcImFkbWluRGFzaGJvYXJkVXNlcnNWaWV3XCIsXG5cdHBhdGg6IFwiL2FkbWluL1VzZXJzXCJcblx0dGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmRWaWV3XCJcblx0Y29udHJvbGxlcjogXCJBZG1pbkNvbnRyb2xsZXJcIlxuXHRhY3Rpb246IC0+XG5cdFx0QHJlbmRlcigpXG5cdGRhdGE6IC0+XG5cdFx0YWRtaW5fdGFibGU6IEFkbWluVGFibGVzLlVzZXJzXG5cdG9uQWZ0ZXJBY3Rpb246IC0+XG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX3RpdGxlJywgJ+i0puWPt+euoeeQhidcblx0XHRTZXNzaW9uLnNldCAnYWRtaW5fc3VidGl0bGUnLCAnJ1xuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX25hbWUnLCAnVXNlcnMnXG5cblJvdXRlci5yb3V0ZSBcImFkbWluRGFzaGJvYXJkVXNlcnNOZXdcIixcblx0cGF0aDogXCIvYWRtaW4vVXNlcnMvbmV3XCJcblx0dGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmRVc2Vyc05ld1wiXG5cdGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInXG5cdGFjdGlvbjogLT5cblx0XHRAcmVuZGVyKClcblx0b25BZnRlckFjdGlvbjogLT5cblx0XHRTZXNzaW9uLnNldCAnYWRtaW5fdGl0bGUnLCAn6LSm5Y+3566h55CGJ1xuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl9zdWJ0aXRsZScsICfliJvlu7rmlrDnlKjmiLcnXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fcGFnZScsICcnXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsICdVc2VycydcblxuUm91dGVyLnJvdXRlIFwiYWRtaW5EYXNoYm9hcmRVc2Vyc0VkaXRcIixcblx0cGF0aDogXCIvYWRtaW4vVXNlcnMvOl9pZC9lZGl0XCJcblx0dGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmRVc2Vyc0VkaXRcIlxuXHRjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwiXG5cdGRhdGE6IC0+XG5cdFx0dXNlcjogTWV0ZW9yLnVzZXJzLmZpbmQoQHBhcmFtcy5faWQpLmZldGNoKClcblx0XHRyb2xlczogUm9sZXMuZ2V0Um9sZXNGb3JVc2VyIEBwYXJhbXMuX2lkXG5cdFx0b3RoZXJSb2xlczogXy5kaWZmZXJlbmNlIF8ubWFwKE1ldGVvci5yb2xlcy5maW5kKCkuZmV0Y2goKSwgKHJvbGUpIC0+IHJvbGUubmFtZSksIFJvbGVzLmdldFJvbGVzRm9yVXNlcihAcGFyYW1zLl9pZClcblx0YWN0aW9uOiAtPlxuXHRcdEByZW5kZXIoKVxuXHRvbkFmdGVyQWN0aW9uOiAtPlxuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl90aXRsZScsICfotKblj7fnrqHnkIYnXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX3N1YnRpdGxlJywgJ+e8lui+keeUqOaItyAnICsgQHBhcmFtcy5faWRcblx0XHRTZXNzaW9uLnNldCAnYWRtaW5fY29sbGVjdGlvbl9wYWdlJywgJydcblx0XHRTZXNzaW9uLnNldCAnYWRtaW5fY29sbGVjdGlvbl9uYW1lJywgJ1VzZXJzJ1xuXHRcdFNlc3Npb24uc2V0ICdhZG1pbl9pZCcsIEBwYXJhbXMuX2lkXG5cdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2RvYycsIE1ldGVvci51c2Vycy5maW5kT25lKHtfaWQ6QHBhcmFtcy5faWR9KVxuIiwidGhpcy5BZG1pbkNvbnRyb2xsZXIgPSBSb3V0ZUNvbnRyb2xsZXIuZXh0ZW5kKHtcbiAgbGF5b3V0VGVtcGxhdGU6ICdBZG1pbkxheW91dCcsXG4gIHdhaXRPbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtNZXRlb3Iuc3Vic2NyaWJlKCdhZG1pblVzZXJzJyksIE1ldGVvci5zdWJzY3JpYmUoJ2FkbWluVXNlcicpLCBNZXRlb3Iuc3Vic2NyaWJlKCdhZG1pbkNvbGxlY3Rpb25zQ291bnQnKV07XG4gIH0sXG4gIG9uQmVmb3JlQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBTZXNzaW9uLnNldCgnYWRtaW5TdWNjZXNzJywgbnVsbCk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluRXJyb3InLCBudWxsKTtcbiAgICBTZXNzaW9uLnNldCgnYWRtaW5fdGl0bGUnLCAnJyk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX3N1YnRpdGxlJywgJycpO1xuICAgIFNlc3Npb24uc2V0KCdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCBudWxsKTtcbiAgICBTZXNzaW9uLnNldCgnYWRtaW5fY29sbGVjdGlvbl9uYW1lJywgbnVsbCk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2lkJywgbnVsbCk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2RvYycsIG51bGwpO1xuICAgIGlmICghUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbiddKSkge1xuICAgICAgTWV0ZW9yLmNhbGwoJ2FkbWluQ2hlY2tBZG1pbicpO1xuICAgICAgaWYgKHR5cGVvZiAodHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcubm9uQWRtaW5SZWRpcmVjdFJvdXRlIDogdm9pZCAwKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgUm91dGVyLmdvKEFkbWluQ29uZmlnLm5vbkFkbWluUmVkaXJlY3RSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5leHQoKTtcbiAgfVxufSk7XG5cblJvdXRlci5yb3V0ZShcImFkbWluRGFzaGJvYXJkXCIsIHtcbiAgcGF0aDogXCIvYWRtaW5cIixcbiAgdGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmRcIixcbiAgY29udHJvbGxlcjogXCJBZG1pbkNvbnRyb2xsZXJcIixcbiAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgfSxcbiAgb25BZnRlckFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX3RpdGxlJywgJ+aAu+iniCcpO1xuICAgIFNlc3Npb24uc2V0KCdhZG1pbl9jb2xsZWN0aW9uX25hbWUnLCAnJyk7XG4gICAgcmV0dXJuIFNlc3Npb24uc2V0KCdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCAnJyk7XG4gIH1cbn0pO1xuXG5Sb3V0ZXIucm91dGUoXCJhZG1pbkRhc2hib2FyZFVzZXJzVmlld1wiLCB7XG4gIHBhdGg6IFwiL2FkbWluL1VzZXJzXCIsXG4gIHRlbXBsYXRlOiBcIkFkbWluRGFzaGJvYXJkVmlld1wiLFxuICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwiLFxuICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICB9LFxuICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWRtaW5fdGFibGU6IEFkbWluVGFibGVzLlVzZXJzXG4gICAgfTtcbiAgfSxcbiAgb25BZnRlckFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX3RpdGxlJywgJ+i0puWPt+euoeeQhicpO1xuICAgIFNlc3Npb24uc2V0KCdhZG1pbl9zdWJ0aXRsZScsICcnKTtcbiAgICByZXR1cm4gU2Vzc2lvbi5zZXQoJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsICdVc2VycycpO1xuICB9XG59KTtcblxuUm91dGVyLnJvdXRlKFwiYWRtaW5EYXNoYm9hcmRVc2Vyc05ld1wiLCB7XG4gIHBhdGg6IFwiL2FkbWluL1VzZXJzL25ld1wiLFxuICB0ZW1wbGF0ZTogXCJBZG1pbkRhc2hib2FyZFVzZXJzTmV3XCIsXG4gIGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxuICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICB9LFxuICBvbkFmdGVyQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBTZXNzaW9uLnNldCgnYWRtaW5fdGl0bGUnLCAn6LSm5Y+3566h55CGJyk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX3N1YnRpdGxlJywgJ+WIm+W7uuaWsOeUqOaItycpO1xuICAgIFNlc3Npb24uc2V0KCdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCAnJyk7XG4gICAgcmV0dXJuIFNlc3Npb24uc2V0KCdhZG1pbl9jb2xsZWN0aW9uX25hbWUnLCAnVXNlcnMnKTtcbiAgfVxufSk7XG5cblJvdXRlci5yb3V0ZShcImFkbWluRGFzaGJvYXJkVXNlcnNFZGl0XCIsIHtcbiAgcGF0aDogXCIvYWRtaW4vVXNlcnMvOl9pZC9lZGl0XCIsXG4gIHRlbXBsYXRlOiBcIkFkbWluRGFzaGJvYXJkVXNlcnNFZGl0XCIsXG4gIGNvbnRyb2xsZXI6IFwiQWRtaW5Db250cm9sbGVyXCIsXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VyOiBNZXRlb3IudXNlcnMuZmluZCh0aGlzLnBhcmFtcy5faWQpLmZldGNoKCksXG4gICAgICByb2xlczogUm9sZXMuZ2V0Um9sZXNGb3JVc2VyKHRoaXMucGFyYW1zLl9pZCksXG4gICAgICBvdGhlclJvbGVzOiBfLmRpZmZlcmVuY2UoXy5tYXAoTWV0ZW9yLnJvbGVzLmZpbmQoKS5mZXRjaCgpLCBmdW5jdGlvbihyb2xlKSB7XG4gICAgICAgIHJldHVybiByb2xlLm5hbWU7XG4gICAgICB9KSwgUm9sZXMuZ2V0Um9sZXNGb3JVc2VyKHRoaXMucGFyYW1zLl9pZCkpXG4gICAgfTtcbiAgfSxcbiAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgfSxcbiAgb25BZnRlckFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX3RpdGxlJywgJ+i0puWPt+euoeeQhicpO1xuICAgIFNlc3Npb24uc2V0KCdhZG1pbl9zdWJ0aXRsZScsICfnvJbovpHnlKjmiLcgJyArIHRoaXMucGFyYW1zLl9pZCk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2NvbGxlY3Rpb25fcGFnZScsICcnKTtcbiAgICBTZXNzaW9uLnNldCgnYWRtaW5fY29sbGVjdGlvbl9uYW1lJywgJ1VzZXJzJyk7XG4gICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2lkJywgdGhpcy5wYXJhbXMuX2lkKTtcbiAgICByZXR1cm4gU2Vzc2lvbi5zZXQoJ2FkbWluX2RvYycsIE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy5wYXJhbXMuX2lkXG4gICAgfSkpO1xuICB9XG59KTtcbiIsIkBhZG1pbkNvbGxlY3Rpb25PYmplY3QgPSAoY29sbGVjdGlvbikgLT5cblx0aWYgdHlwZW9mIEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dICE9ICd1bmRlZmluZWQnIGFuZCB0eXBlb2YgQWRtaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0uY29sbGVjdGlvbk9iamVjdCAhPSAndW5kZWZpbmVkJ1xuXHRcdEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dLmNvbGxlY3Rpb25PYmplY3Rcblx0ZWxzZVxuXHRcdGxvb2t1cCBjb2xsZWN0aW9uXG5cbkBhZG1pbkNhbGxiYWNrID0gKG5hbWUsIGFyZ3MsIGNhbGxiYWNrKSAtPlxuXHRzdG9wID0gZmFsc2Vcblx0aWYgdHlwZW9mIEFkbWluQ29uZmlnPy5jYWxsYmFja3M/W25hbWVdID09ICdmdW5jdGlvbidcblx0XHRzdG9wID0gQWRtaW5Db25maWcuY2FsbGJhY2tzW25hbWVdKGFyZ3MuLi4pIGlzIGZhbHNlXG5cdGlmIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nXG5cdFx0Y2FsbGJhY2sgYXJncy4uLiB1bmxlc3Mgc3RvcFxuXG5AbG9va3VwID0gKG9iaiwgcm9vdCwgcmVxdWlyZWQ9dHJ1ZSkgLT5cblx0aWYgdHlwZW9mIHJvb3QgPT0gJ3VuZGVmaW5lZCdcblx0XHRyb290ID0gaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gZ2xvYmFsIGVsc2Ugd2luZG93XG5cdGlmIHR5cGVvZiBvYmogPT0gJ3N0cmluZydcblx0XHRyZWYgPSByb290XG5cdFx0YXJyID0gb2JqLnNwbGl0ICcuJ1xuXHRcdGNvbnRpbnVlIHdoaWxlIGFyci5sZW5ndGggYW5kIChyZWYgPSByZWZbYXJyLnNoaWZ0KCldKVxuXHRcdGlmIG5vdCByZWYgYW5kIHJlcXVpcmVkXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3Iob2JqICsgJyBpcyBub3QgaW4gdGhlICcgKyByb290LnRvU3RyaW5nKCkpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHJlZlxuXHRyZXR1cm4gb2JqXG5cdFxuQHBhcnNlSUQgPSAoaWQpIC0+XG5cdGlmIHR5cGVvZiBpZCA9PSAnc3RyaW5nJ1xuXHRcdGlmKGlkLmluZGV4T2YoXCJPYmplY3RJRFwiKSA+IC0xKVxuXHRcdFx0cmV0dXJuIG5ldyBNb25nby5PYmplY3RJRChpZC5zbGljZShpZC5pbmRleE9mKCdcIicpICsgMSxpZC5sYXN0SW5kZXhPZignXCInKSkpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGlkXG5cdGVsc2Vcblx0XHRyZXR1cm4gaWRcblxuQHBhcnNlSURzID0gKGlkcykgLT5cbiAgICByZXR1cm4gXy5tYXAgaWRzLCAoaWQpIC0+XG4gICAgICAgIHBhcnNlSUQgaWRcbiIsInRoaXMuYWRtaW5Db2xsZWN0aW9uT2JqZWN0ID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICBpZiAodHlwZW9mIEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQWRtaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0uY29sbGVjdGlvbk9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gQWRtaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0uY29sbGVjdGlvbk9iamVjdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbG9va3VwKGNvbGxlY3Rpb24pO1xuICB9XG59O1xuXG50aGlzLmFkbWluQ2FsbGJhY2sgPSBmdW5jdGlvbihuYW1lLCBhcmdzLCBjYWxsYmFjaykge1xuICB2YXIgcmVmMSwgc3RvcDtcbiAgc3RvcCA9IGZhbHNlO1xuICBpZiAodHlwZW9mICh0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyAocmVmMSA9IEFkbWluQ29uZmlnLmNhbGxiYWNrcykgIT0gbnVsbCA/IHJlZjFbbmFtZV0gOiB2b2lkIDAgOiB2b2lkIDApID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc3RvcCA9IEFkbWluQ29uZmlnLmNhbGxiYWNrc1tuYW1lXSguLi5hcmdzKSA9PT0gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICghc3RvcCkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxufTtcblxudGhpcy5sb29rdXAgPSBmdW5jdGlvbihvYmosIHJvb3QsIHJlcXVpcmVkID0gdHJ1ZSkge1xuICB2YXIgYXJyLCByZWY7XG4gIGlmICh0eXBlb2Ygcm9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByb290ID0gTWV0ZW9yLmlzU2VydmVyID8gZ2xvYmFsIDogd2luZG93O1xuICB9XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgIHJlZiA9IHJvb3Q7XG4gICAgYXJyID0gb2JqLnNwbGl0KCcuJyk7XG4gICAgd2hpbGUgKGFyci5sZW5ndGggJiYgKHJlZiA9IHJlZlthcnIuc2hpZnQoKV0pKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKCFyZWYgJiYgcmVxdWlyZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihvYmogKyAnIGlzIG5vdCBpbiB0aGUgJyArIHJvb3QudG9TdHJpbmcoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWY7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG50aGlzLnBhcnNlSUQgPSBmdW5jdGlvbihpZCkge1xuICBpZiAodHlwZW9mIGlkID09PSAnc3RyaW5nJykge1xuICAgIGlmIChpZC5pbmRleE9mKFwiT2JqZWN0SURcIikgPiAtMSkge1xuICAgICAgcmV0dXJuIG5ldyBNb25nby5PYmplY3RJRChpZC5zbGljZShpZC5pbmRleE9mKCdcIicpICsgMSwgaWQubGFzdEluZGV4T2YoJ1wiJykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbn07XG5cbnRoaXMucGFyc2VJRHMgPSBmdW5jdGlvbihpZHMpIHtcbiAgcmV0dXJuIF8ubWFwKGlkcywgZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gcGFyc2VJRChpZCk7XG4gIH0pO1xufTtcbiIsIkBBZG1pblRhYmxlcyA9IHt9XG5cbmFkbWluVGFibGVzRG9tID0gJzxcImJveFwiPFwiYm94LWhlYWRlclwiPFwiYm94LXRvb2xiYXJcIjxcInB1bGwtbGVmdFwiPGxmPj48XCJwdWxsLXJpZ2h0XCJwPj4+PFwiYm94LWJvZHlcInQ+PjxyPidcblxuYWRtaW5FZGl0QnV0dG9uID0ge1xuXHRkYXRhOiAnX2lkJ1xuXHR0aXRsZTogJ0VkaXQnXG5cdGNyZWF0ZWRDZWxsOiAobm9kZSwgY2VsbERhdGEsIHJvd0RhdGEpIC0+XG5cdFx0JChub2RlKS5odG1sKEJsYXplLnRvSFRNTFdpdGhEYXRhIFRlbXBsYXRlLmFkbWluRWRpdEJ0biwge19pZDogY2VsbERhdGF9KVxuXHR3aWR0aDogJzQwcHgnXG5cdG9yZGVyYWJsZTogZmFsc2Vcbn1cbmFkbWluRGVsQnV0dG9uID0ge1xuXHRkYXRhOiAnX2lkJ1xuXHR0aXRsZTogJ0RlbGV0ZSdcblx0Y3JlYXRlZENlbGw6IChub2RlLCBjZWxsRGF0YSwgcm93RGF0YSkgLT5cblx0XHQkKG5vZGUpLmh0bWwoQmxhemUudG9IVE1MV2l0aERhdGEgVGVtcGxhdGUuYWRtaW5EZWxldGVCdG4sIHtfaWQ6IGNlbGxEYXRhfSlcblx0d2lkdGg6ICc0MHB4J1xuXHRvcmRlcmFibGU6IGZhbHNlXG59XG5cbmFkbWluRWRpdERlbEJ1dHRvbnMgPSBbXG5cdGFkbWluRWRpdEJ1dHRvbixcblx0YWRtaW5EZWxCdXR0b25cbl1cblxuZGVmYXVsdENvbHVtbnMgPSAoKSAtPiBbXG4gIGRhdGE6ICdfaWQnLFxuICB0aXRsZTogJ0lEJ1xuXVxuXG5hZG1pblRhYmxlUHViTmFtZSA9IChjb2xsZWN0aW9uKSAtPlxuXHRcImFkbWluX3RhYnVsYXJfI3tjb2xsZWN0aW9ufVwiXG5cbmFkbWluQ3JlYXRlVGFibGVzID0gKGNvbGxlY3Rpb25zKSAtPlxuXHRfLmVhY2ggQWRtaW5Db25maWc/LmNvbGxlY3Rpb25zLCAoY29sbGVjdGlvbiwgbmFtZSkgLT5cblx0XHRfLmRlZmF1bHRzIGNvbGxlY3Rpb24sIHtcblx0XHRcdHNob3dFZGl0Q29sdW1uOiB0cnVlXG5cdFx0XHRzaG93RGVsQ29sdW1uOiB0cnVlXG5cdFx0XHRzaG93SW5TaWRlQmFyOiB0cnVlXG5cdFx0fVxuXG5cdFx0Y29sdW1ucyA9IF8ubWFwIGNvbGxlY3Rpb24udGFibGVDb2x1bW5zLCAoY29sdW1uKSAtPlxuXHRcdFx0aWYgY29sdW1uLnRlbXBsYXRlXG5cdFx0XHRcdGNyZWF0ZWRDZWxsID0gKG5vZGUsIGNlbGxEYXRhLCByb3dEYXRhKSAtPlxuXHRcdFx0XHRcdCQobm9kZSkuaHRtbCAnJ1xuXHRcdFx0XHRcdEJsYXplLnJlbmRlcldpdGhEYXRhKFRlbXBsYXRlW2NvbHVtbi50ZW1wbGF0ZV0sIHt2YWx1ZTogY2VsbERhdGEsIGRvYzogcm93RGF0YX0sIG5vZGUpXG5cblx0XHRcdGRhdGE6IGNvbHVtbi5uYW1lXG5cdFx0XHR0aXRsZTogY29sdW1uLmxhYmVsXG5cdFx0XHRjcmVhdGVkQ2VsbDogY3JlYXRlZENlbGxcblxuXHRcdGlmIGNvbHVtbnMubGVuZ3RoID09IDBcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Q29sdW1ucygpXG5cblx0XHRpZiBjb2xsZWN0aW9uLnNob3dFZGl0Q29sdW1uXG5cdFx0XHRjb2x1bW5zLnB1c2goYWRtaW5FZGl0QnV0dG9uKVxuXHRcdGlmIGNvbGxlY3Rpb24uc2hvd0RlbENvbHVtblxuXHRcdFx0Y29sdW1ucy5wdXNoKGFkbWluRGVsQnV0dG9uKVxuXG5cdFx0QWRtaW5UYWJsZXNbbmFtZV0gPSBuZXcgVGFidWxhci5UYWJsZVxuXHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0Y29sbGVjdGlvbjogYWRtaW5Db2xsZWN0aW9uT2JqZWN0KG5hbWUpXG5cdFx0XHRwdWI6IGNvbGxlY3Rpb24uY2hpbGRyZW4gYW5kIGFkbWluVGFibGVQdWJOYW1lKG5hbWUpXG5cdFx0XHRzdWI6IGNvbGxlY3Rpb24uc3ViXG5cdFx0XHRjb2x1bW5zOiBjb2x1bW5zXG5cdFx0XHRleHRyYUZpZWxkczogY29sbGVjdGlvbi5leHRyYUZpZWxkc1xuXHRcdFx0ZG9tOiBhZG1pblRhYmxlc0RvbVxuXHRcdFx0c2VsZWN0b3I6IGNvbGxlY3Rpb24uc2VsZWN0b3IgfHwgLT5cblx0XHRcdFx0cmV0dXJuIHt9XG5cbmFkbWluQ3JlYXRlUm91dGVzID0gKGNvbGxlY3Rpb25zKSAtPlxuXHRfLmVhY2ggY29sbGVjdGlvbnMsIGFkbWluQ3JlYXRlUm91dGVWaWV3XG5cdF8uZWFjaCBjb2xsZWN0aW9ucyxcdGFkbWluQ3JlYXRlUm91dGVOZXdcblx0Xy5lYWNoIGNvbGxlY3Rpb25zLCBhZG1pbkNyZWF0ZVJvdXRlRWRpdFxuXG5hZG1pbkNyZWF0ZVJvdXRlVmlldyA9IChjb2xsZWN0aW9uLCBjb2xsZWN0aW9uTmFtZSkgLT5cblx0Um91dGVyLnJvdXRlIFwiYWRtaW5EYXNoYm9hcmQje2NvbGxlY3Rpb25OYW1lfVZpZXdcIixcblx0XHRhZG1pbkNyZWF0ZVJvdXRlVmlld09wdGlvbnMgY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWVcblxuYWRtaW5DcmVhdGVSb3V0ZVZpZXdPcHRpb25zID0gKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSAtPlxuXHRvcHRpb25zID1cblx0XHRwYXRoOiBcIi9hZG1pbi8je2NvbGxlY3Rpb25OYW1lfVwiXG5cdFx0dGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmRWaWV3V3JhcHBlclwiXG5cdFx0Y29udHJvbGxlcjogXCJBZG1pbkNvbnRyb2xsZXJcIlxuXHRcdGRhdGE6IC0+XG5cdFx0XHRhZG1pbl90YWJsZTogQWRtaW5UYWJsZXNbY29sbGVjdGlvbk5hbWVdXG5cdFx0YWN0aW9uOiAtPlxuXHRcdFx0QHJlbmRlcigpXG5cdFx0b25BZnRlckFjdGlvbjogLT5cblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl90aXRsZScsIGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRTZXNzaW9uLnNldCAnYWRtaW5fc3VidGl0bGUnLCAnVmlldydcblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX25hbWUnLCBjb2xsZWN0aW9uTmFtZVxuXHRcdFx0Y29sbGVjdGlvbi5yb3V0ZXM/LnZpZXc/Lm9uQWZ0ZXJBY3Rpb25cblx0Xy5kZWZhdWx0cyBvcHRpb25zLCBjb2xsZWN0aW9uLnJvdXRlcz8udmlld1xuXG5hZG1pbkNyZWF0ZVJvdXRlTmV3ID0gKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSAtPlxuXHRSb3V0ZXIucm91dGUgXCJhZG1pbkRhc2hib2FyZCN7Y29sbGVjdGlvbk5hbWV9TmV3XCIsXG5cdFx0YWRtaW5DcmVhdGVSb3V0ZU5ld09wdGlvbnMgY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWVcblxuYWRtaW5DcmVhdGVSb3V0ZU5ld09wdGlvbnMgPSAoY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWUpIC0+XG5cdG9wdGlvbnMgPVxuXHRcdHBhdGg6IFwiL2FkbWluLyN7Y29sbGVjdGlvbk5hbWV9L25ld1wiXG5cdFx0dGVtcGxhdGU6IFwiQWRtaW5EYXNoYm9hcmROZXdcIlxuXHRcdGNvbnRyb2xsZXI6IFwiQWRtaW5Db250cm9sbGVyXCJcblx0XHRhY3Rpb246IC0+XG5cdFx0XHRAcmVuZGVyKClcblx0XHRvbkFmdGVyQWN0aW9uOiAtPlxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX3RpdGxlJywgQWRtaW5EYXNoYm9hcmQuY29sbGVjdGlvbkxhYmVsIGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRTZXNzaW9uLnNldCAnYWRtaW5fc3VidGl0bGUnLCAnQ3JlYXRlIG5ldydcblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCAnbmV3J1xuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsIGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRjb2xsZWN0aW9uLnJvdXRlcz8ubmV3Py5vbkFmdGVyQWN0aW9uXG5cdFx0ZGF0YTogLT5cblx0XHRcdGFkbWluX2NvbGxlY3Rpb246IGFkbWluQ29sbGVjdGlvbk9iamVjdCBjb2xsZWN0aW9uTmFtZVxuXHRfLmRlZmF1bHRzIG9wdGlvbnMsIGNvbGxlY3Rpb24ucm91dGVzPy5uZXdcblxuYWRtaW5DcmVhdGVSb3V0ZUVkaXQgPSAoY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWUpIC0+XG5cdFJvdXRlci5yb3V0ZSBcImFkbWluRGFzaGJvYXJkI3tjb2xsZWN0aW9uTmFtZX1FZGl0XCIsXG5cdFx0YWRtaW5DcmVhdGVSb3V0ZUVkaXRPcHRpb25zIGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lXG5cbmFkbWluQ3JlYXRlUm91dGVFZGl0T3B0aW9ucyA9IChjb2xsZWN0aW9uLCBjb2xsZWN0aW9uTmFtZSkgLT5cblx0b3B0aW9ucyA9XG5cdFx0cGF0aDogXCIvYWRtaW4vI3tjb2xsZWN0aW9uTmFtZX0vOl9pZC9lZGl0XCJcblx0XHR0ZW1wbGF0ZTogXCJBZG1pbkRhc2hib2FyZEVkaXRcIlxuXHRcdGNvbnRyb2xsZXI6IFwiQWRtaW5Db250cm9sbGVyXCJcblx0XHR3YWl0T246IC0+XG5cdFx0XHRNZXRlb3Iuc3Vic2NyaWJlICdhZG1pbkNvbGxlY3Rpb25Eb2MnLCBjb2xsZWN0aW9uTmFtZSwgcGFyc2VJRChAcGFyYW1zLl9pZClcblx0XHRcdGNvbGxlY3Rpb24ucm91dGVzPy5lZGl0Py53YWl0T25cblx0XHRhY3Rpb246IC0+XG5cdFx0XHRAcmVuZGVyKClcblx0XHRvbkFmdGVyQWN0aW9uOiAtPlxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX3RpdGxlJywgQWRtaW5EYXNoYm9hcmQuY29sbGVjdGlvbkxhYmVsIGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRTZXNzaW9uLnNldCAnYWRtaW5fc3VidGl0bGUnLCAnRWRpdCAnICsgQHBhcmFtcy5faWRcblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX3BhZ2UnLCAnZWRpdCdcblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl9jb2xsZWN0aW9uX25hbWUnLCBjb2xsZWN0aW9uTmFtZVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FkbWluX2lkJywgcGFyc2VJRChAcGFyYW1zLl9pZClcblx0XHRcdFNlc3Npb24uc2V0ICdhZG1pbl9kb2MnLCBhZG1pbkNvbGxlY3Rpb25PYmplY3QoY29sbGVjdGlvbk5hbWUpLmZpbmRPbmUgX2lkIDogcGFyc2VJRChAcGFyYW1zLl9pZClcblx0XHRcdGNvbGxlY3Rpb24ucm91dGVzPy5lZGl0Py5vbkFmdGVyQWN0aW9uXG5cdFx0ZGF0YTogLT5cblx0XHRcdGFkbWluX2NvbGxlY3Rpb246IGFkbWluQ29sbGVjdGlvbk9iamVjdCBjb2xsZWN0aW9uTmFtZVxuXHRfLmRlZmF1bHRzIG9wdGlvbnMsIGNvbGxlY3Rpb24ucm91dGVzPy5lZGl0XG5cbmFkbWluUHVibGlzaFRhYmxlcyA9IChjb2xsZWN0aW9ucykgLT5cblx0Xy5lYWNoIGNvbGxlY3Rpb25zLCAoY29sbGVjdGlvbiwgbmFtZSkgLT5cblx0XHRpZiBub3QgY29sbGVjdGlvbi5jaGlsZHJlbiB0aGVuIHJldHVybiB1bmRlZmluZWRcblx0XHRNZXRlb3IucHVibGlzaENvbXBvc2l0ZSBhZG1pblRhYmxlUHViTmFtZShuYW1lKSwgKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMpIC0+XG5cdFx0XHRjaGVjayB0YWJsZU5hbWUsIFN0cmluZ1xuXHRcdFx0Y2hlY2sgaWRzLCBBcnJheVxuXHRcdFx0Y2hlY2sgZmllbGRzLCBNYXRjaC5PcHRpb25hbCBPYmplY3RcblxuXHRcdFx0ZXh0cmFGaWVsZHMgPSBfLnJlZHVjZSBjb2xsZWN0aW9uLmV4dHJhRmllbGRzLCAoZmllbGRzLCBuYW1lKSAtPlxuXHRcdFx0XHRmaWVsZHNbbmFtZV0gPSAxXG5cdFx0XHRcdGZpZWxkc1xuXHRcdFx0LCB7fVxuXHRcdFx0Xy5leHRlbmQgZmllbGRzLCBleHRyYUZpZWxkc1xuXG5cdFx0XHRAdW5ibG9jaygpXG5cblx0XHRcdGZpbmQ6IC0+XG5cdFx0XHRcdEB1bmJsb2NrKClcblx0XHRcdFx0YWRtaW5Db2xsZWN0aW9uT2JqZWN0KG5hbWUpLmZpbmQge19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc31cblx0XHRcdGNoaWxkcmVuOiBjb2xsZWN0aW9uLmNoaWxkcmVuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdGFkbWluQ3JlYXRlVGFibGVzIEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc1xuXHRhZG1pbkNyZWF0ZVJvdXRlcyBBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNcblx0YWRtaW5QdWJsaXNoVGFibGVzIEFkbWluQ29uZmlnPy5jb2xsZWN0aW9ucyBpZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRpZiBBZG1pblRhYmxlcy5Vc2VycyB0aGVuIHJldHVybiB1bmRlZmluZWRcblxuXHRBZG1pblRhYmxlcy5Vc2VycyA9IG5ldyBUYWJ1bGFyLlRhYmxlXG5cdFx0IyBNb2RpZnkgc2VsZWN0b3IgdG8gYWxsb3cgc2VhcmNoIGJ5IGVtYWlsXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxuXHRcdFx0JG9yID0gc2VsZWN0b3JbJyRvciddXG5cdFx0XHQkb3IgYW5kIHNlbGVjdG9yWyckb3InXSA9IF8ubWFwICRvciwgKGV4cCkgLT5cblx0XHRcdFx0aWYgZXhwLmVtYWlscz9bJyRyZWdleCddP1xuXHRcdFx0XHRcdGVtYWlsczogJGVsZW1NYXRjaDogYWRkcmVzczogZXhwLmVtYWlsc1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZXhwXG5cdFx0XHRzZWxlY3RvclxuXG5cdFx0bmFtZTogJ1VzZXJzJ1xuXHRcdGNvbGxlY3Rpb246IE1ldGVvci51c2Vyc1xuXHRcdGNvbHVtbnM6IF8udW5pb24gW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiAnX2lkJ1xuXHRcdFx0XHR0aXRsZTogJ0FkbWluJ1xuXHRcdFx0XHQjIFRPRE86IHVzZSBgdG1wbGBcblx0XHRcdFx0Y3JlYXRlZENlbGw6IChub2RlLCBjZWxsRGF0YSwgcm93RGF0YSkgLT5cblx0XHRcdFx0XHQkKG5vZGUpLmh0bWwoQmxhemUudG9IVE1MV2l0aERhdGEgVGVtcGxhdGUuYWRtaW5Vc2Vyc0lzQWRtaW4sIHtfaWQ6IGNlbGxEYXRhfSlcblx0XHRcdFx0d2lkdGg6ICc0MHB4J1xuXHRcdFx0fVxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiAnZW1haWxzJ1xuXHRcdFx0XHR0aXRsZTogJ0VtYWlsJ1xuXHRcdFx0XHRyZW5kZXI6ICh2YWx1ZSkgLT5cblx0XHRcdFx0XHR2YWx1ZVswXS5hZGRyZXNzXG5cdFx0XHRcdHNlYXJjaGFibGU6IHRydWVcblx0XHRcdH1cblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogJ2VtYWlscydcblx0XHRcdFx0dGl0bGU6ICdNYWlsJ1xuXHRcdFx0XHQjIFRPRE86IHVzZSBgdG1wbGBcblx0XHRcdFx0Y3JlYXRlZENlbGw6IChub2RlLCBjZWxsRGF0YSwgcm93RGF0YSkgLT5cblx0XHRcdFx0XHQkKG5vZGUpLmh0bWwoQmxhemUudG9IVE1MV2l0aERhdGEgVGVtcGxhdGUuYWRtaW5Vc2Vyc01haWxCdG4sIHtlbWFpbHM6IGNlbGxEYXRhfSlcblx0XHRcdFx0d2lkdGg6ICc0MHB4J1xuXHRcdFx0fVxuXHRcdFx0eyBkYXRhOiAnY3JlYXRlZEF0JywgdGl0bGU6ICdKb2luZWQnIH1cblx0XHRdLCBhZG1pbkVkaXREZWxCdXR0b25zXG5cdFx0ZG9tOiBhZG1pblRhYmxlc0RvbVxuIiwidmFyIGFkbWluQ3JlYXRlUm91dGVFZGl0LCBhZG1pbkNyZWF0ZVJvdXRlRWRpdE9wdGlvbnMsIGFkbWluQ3JlYXRlUm91dGVOZXcsIGFkbWluQ3JlYXRlUm91dGVOZXdPcHRpb25zLCBhZG1pbkNyZWF0ZVJvdXRlVmlldywgYWRtaW5DcmVhdGVSb3V0ZVZpZXdPcHRpb25zLCBhZG1pbkNyZWF0ZVJvdXRlcywgYWRtaW5DcmVhdGVUYWJsZXMsIGFkbWluRGVsQnV0dG9uLCBhZG1pbkVkaXRCdXR0b24sIGFkbWluRWRpdERlbEJ1dHRvbnMsIGFkbWluUHVibGlzaFRhYmxlcywgYWRtaW5UYWJsZVB1Yk5hbWUsIGFkbWluVGFibGVzRG9tLCBkZWZhdWx0Q29sdW1ucztcblxudGhpcy5BZG1pblRhYmxlcyA9IHt9O1xuXG5hZG1pblRhYmxlc0RvbSA9ICc8XCJib3hcIjxcImJveC1oZWFkZXJcIjxcImJveC10b29sYmFyXCI8XCJwdWxsLWxlZnRcIjxsZj4+PFwicHVsbC1yaWdodFwicD4+PjxcImJveC1ib2R5XCJ0Pj48cj4nO1xuXG5hZG1pbkVkaXRCdXR0b24gPSB7XG4gIGRhdGE6ICdfaWQnLFxuICB0aXRsZTogJ0VkaXQnLFxuICBjcmVhdGVkQ2VsbDogZnVuY3Rpb24obm9kZSwgY2VsbERhdGEsIHJvd0RhdGEpIHtcbiAgICByZXR1cm4gJChub2RlKS5odG1sKEJsYXplLnRvSFRNTFdpdGhEYXRhKFRlbXBsYXRlLmFkbWluRWRpdEJ0biwge1xuICAgICAgX2lkOiBjZWxsRGF0YVxuICAgIH0pKTtcbiAgfSxcbiAgd2lkdGg6ICc0MHB4JyxcbiAgb3JkZXJhYmxlOiBmYWxzZVxufTtcblxuYWRtaW5EZWxCdXR0b24gPSB7XG4gIGRhdGE6ICdfaWQnLFxuICB0aXRsZTogJ0RlbGV0ZScsXG4gIGNyZWF0ZWRDZWxsOiBmdW5jdGlvbihub2RlLCBjZWxsRGF0YSwgcm93RGF0YSkge1xuICAgIHJldHVybiAkKG5vZGUpLmh0bWwoQmxhemUudG9IVE1MV2l0aERhdGEoVGVtcGxhdGUuYWRtaW5EZWxldGVCdG4sIHtcbiAgICAgIF9pZDogY2VsbERhdGFcbiAgICB9KSk7XG4gIH0sXG4gIHdpZHRoOiAnNDBweCcsXG4gIG9yZGVyYWJsZTogZmFsc2Vcbn07XG5cbmFkbWluRWRpdERlbEJ1dHRvbnMgPSBbYWRtaW5FZGl0QnV0dG9uLCBhZG1pbkRlbEJ1dHRvbl07XG5cbmRlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgZGF0YTogJ19pZCcsXG4gICAgICB0aXRsZTogJ0lEJ1xuICAgIH1cbiAgXTtcbn07XG5cbmFkbWluVGFibGVQdWJOYW1lID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICByZXR1cm4gYGFkbWluX3RhYnVsYXJfJHtjb2xsZWN0aW9ufWA7XG59O1xuXG5hZG1pbkNyZWF0ZVRhYmxlcyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb25zKSB7XG4gIHJldHVybiBfLmVhY2godHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnMgOiB2b2lkIDAsIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG5hbWUpIHtcbiAgICB2YXIgY29sdW1ucztcbiAgICBfLmRlZmF1bHRzKGNvbGxlY3Rpb24sIHtcbiAgICAgIHNob3dFZGl0Q29sdW1uOiB0cnVlLFxuICAgICAgc2hvd0RlbENvbHVtbjogdHJ1ZSxcbiAgICAgIHNob3dJblNpZGVCYXI6IHRydWVcbiAgICB9KTtcbiAgICBjb2x1bW5zID0gXy5tYXAoY29sbGVjdGlvbi50YWJsZUNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgdmFyIGNyZWF0ZWRDZWxsO1xuICAgICAgaWYgKGNvbHVtbi50ZW1wbGF0ZSkge1xuICAgICAgICBjcmVhdGVkQ2VsbCA9IGZ1bmN0aW9uKG5vZGUsIGNlbGxEYXRhLCByb3dEYXRhKSB7XG4gICAgICAgICAgJChub2RlKS5odG1sKCcnKTtcbiAgICAgICAgICByZXR1cm4gQmxhemUucmVuZGVyV2l0aERhdGEoVGVtcGxhdGVbY29sdW1uLnRlbXBsYXRlXSwge1xuICAgICAgICAgICAgdmFsdWU6IGNlbGxEYXRhLFxuICAgICAgICAgICAgZG9jOiByb3dEYXRhXG4gICAgICAgICAgfSwgbm9kZSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBjb2x1bW4ubmFtZSxcbiAgICAgICAgdGl0bGU6IGNvbHVtbi5sYWJlbCxcbiAgICAgICAgY3JlYXRlZENlbGw6IGNyZWF0ZWRDZWxsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRDb2x1bW5zKCk7XG4gICAgfVxuICAgIGlmIChjb2xsZWN0aW9uLnNob3dFZGl0Q29sdW1uKSB7XG4gICAgICBjb2x1bW5zLnB1c2goYWRtaW5FZGl0QnV0dG9uKTtcbiAgICB9XG4gICAgaWYgKGNvbGxlY3Rpb24uc2hvd0RlbENvbHVtbikge1xuICAgICAgY29sdW1ucy5wdXNoKGFkbWluRGVsQnV0dG9uKTtcbiAgICB9XG4gICAgcmV0dXJuIEFkbWluVGFibGVzW25hbWVdID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGNvbGxlY3Rpb246IGFkbWluQ29sbGVjdGlvbk9iamVjdChuYW1lKSxcbiAgICAgIHB1YjogY29sbGVjdGlvbi5jaGlsZHJlbiAmJiBhZG1pblRhYmxlUHViTmFtZShuYW1lKSxcbiAgICAgIHN1YjogY29sbGVjdGlvbi5zdWIsXG4gICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgZXh0cmFGaWVsZHM6IGNvbGxlY3Rpb24uZXh0cmFGaWVsZHMsXG4gICAgICBkb206IGFkbWluVGFibGVzRG9tLFxuICAgICAgc2VsZWN0b3I6IGNvbGxlY3Rpb24uc2VsZWN0b3IgfHwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5hZG1pbkNyZWF0ZVJvdXRlcyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb25zKSB7XG4gIF8uZWFjaChjb2xsZWN0aW9ucywgYWRtaW5DcmVhdGVSb3V0ZVZpZXcpO1xuICBfLmVhY2goY29sbGVjdGlvbnMsIGFkbWluQ3JlYXRlUm91dGVOZXcpO1xuICByZXR1cm4gXy5lYWNoKGNvbGxlY3Rpb25zLCBhZG1pbkNyZWF0ZVJvdXRlRWRpdCk7XG59O1xuXG5hZG1pbkNyZWF0ZVJvdXRlVmlldyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSB7XG4gIHJldHVybiBSb3V0ZXIucm91dGUoYGFkbWluRGFzaGJvYXJkJHtjb2xsZWN0aW9uTmFtZX1WaWV3YCwgYWRtaW5DcmVhdGVSb3V0ZVZpZXdPcHRpb25zKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSk7XG59O1xuXG5hZG1pbkNyZWF0ZVJvdXRlVmlld09wdGlvbnMgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjb2xsZWN0aW9uTmFtZSkge1xuICB2YXIgb3B0aW9ucywgcmVmO1xuICBvcHRpb25zID0ge1xuICAgIHBhdGg6IGAvYWRtaW4vJHtjb2xsZWN0aW9uTmFtZX1gLFxuICAgIHRlbXBsYXRlOiBcIkFkbWluRGFzaGJvYXJkVmlld1dyYXBwZXJcIixcbiAgICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwiLFxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWRtaW5fdGFibGU6IEFkbWluVGFibGVzW2NvbGxlY3Rpb25OYW1lXVxuICAgICAgfTtcbiAgICB9LFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgICB9LFxuICAgIG9uQWZ0ZXJBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIFNlc3Npb24uc2V0KCdhZG1pbl90aXRsZScsIGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgIFNlc3Npb24uc2V0KCdhZG1pbl9zdWJ0aXRsZScsICdWaWV3Jyk7XG4gICAgICBTZXNzaW9uLnNldCgnYWRtaW5fY29sbGVjdGlvbl9uYW1lJywgY29sbGVjdGlvbk5hbWUpO1xuICAgICAgcmV0dXJuIChyZWYgPSBjb2xsZWN0aW9uLnJvdXRlcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnZpZXcpICE9IG51bGwgPyByZWYxLm9uQWZ0ZXJBY3Rpb24gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICByZXR1cm4gXy5kZWZhdWx0cyhvcHRpb25zLCAocmVmID0gY29sbGVjdGlvbi5yb3V0ZXMpICE9IG51bGwgPyByZWYudmlldyA6IHZvaWQgMCk7XG59O1xuXG5hZG1pbkNyZWF0ZVJvdXRlTmV3ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWUpIHtcbiAgcmV0dXJuIFJvdXRlci5yb3V0ZShgYWRtaW5EYXNoYm9hcmQke2NvbGxlY3Rpb25OYW1lfU5ld2AsIGFkbWluQ3JlYXRlUm91dGVOZXdPcHRpb25zKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSk7XG59O1xuXG5hZG1pbkNyZWF0ZVJvdXRlTmV3T3B0aW9ucyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSB7XG4gIHZhciBvcHRpb25zLCByZWY7XG4gIG9wdGlvbnMgPSB7XG4gICAgcGF0aDogYC9hZG1pbi8ke2NvbGxlY3Rpb25OYW1lfS9uZXdgLFxuICAgIHRlbXBsYXRlOiBcIkFkbWluRGFzaGJvYXJkTmV3XCIsXG4gICAgY29udHJvbGxlcjogXCJBZG1pbkNvbnRyb2xsZXJcIixcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcbiAgICBvbkFmdGVyQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBTZXNzaW9uLnNldCgnYWRtaW5fdGl0bGUnLCBBZG1pbkRhc2hib2FyZC5jb2xsZWN0aW9uTGFiZWwoY29sbGVjdGlvbk5hbWUpKTtcbiAgICAgIFNlc3Npb24uc2V0KCdhZG1pbl9zdWJ0aXRsZScsICdDcmVhdGUgbmV3Jyk7XG4gICAgICBTZXNzaW9uLnNldCgnYWRtaW5fY29sbGVjdGlvbl9wYWdlJywgJ25ldycpO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2NvbGxlY3Rpb25fbmFtZScsIGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgIHJldHVybiAocmVmID0gY29sbGVjdGlvbi5yb3V0ZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5uZXcpICE9IG51bGwgPyByZWYxLm9uQWZ0ZXJBY3Rpb24gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFkbWluX2NvbGxlY3Rpb246IGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uTmFtZSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICByZXR1cm4gXy5kZWZhdWx0cyhvcHRpb25zLCAocmVmID0gY29sbGVjdGlvbi5yb3V0ZXMpICE9IG51bGwgPyByZWYubmV3IDogdm9pZCAwKTtcbn07XG5cbmFkbWluQ3JlYXRlUm91dGVFZGl0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWUpIHtcbiAgcmV0dXJuIFJvdXRlci5yb3V0ZShgYWRtaW5EYXNoYm9hcmQke2NvbGxlY3Rpb25OYW1lfUVkaXRgLCBhZG1pbkNyZWF0ZVJvdXRlRWRpdE9wdGlvbnMoY29sbGVjdGlvbiwgY29sbGVjdGlvbk5hbWUpKTtcbn07XG5cbmFkbWluQ3JlYXRlUm91dGVFZGl0T3B0aW9ucyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25OYW1lKSB7XG4gIHZhciBvcHRpb25zLCByZWY7XG4gIG9wdGlvbnMgPSB7XG4gICAgcGF0aDogYC9hZG1pbi8ke2NvbGxlY3Rpb25OYW1lfS86X2lkL2VkaXRgLFxuICAgIHRlbXBsYXRlOiBcIkFkbWluRGFzaGJvYXJkRWRpdFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiQWRtaW5Db250cm9sbGVyXCIsXG4gICAgd2FpdE9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBNZXRlb3Iuc3Vic2NyaWJlKCdhZG1pbkNvbGxlY3Rpb25Eb2MnLCBjb2xsZWN0aW9uTmFtZSwgcGFyc2VJRCh0aGlzLnBhcmFtcy5faWQpKTtcbiAgICAgIHJldHVybiAocmVmID0gY29sbGVjdGlvbi5yb3V0ZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5lZGl0KSAhPSBudWxsID8gcmVmMS53YWl0T24gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcbiAgICBvbkFmdGVyQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBTZXNzaW9uLnNldCgnYWRtaW5fdGl0bGUnLCBBZG1pbkRhc2hib2FyZC5jb2xsZWN0aW9uTGFiZWwoY29sbGVjdGlvbk5hbWUpKTtcbiAgICAgIFNlc3Npb24uc2V0KCdhZG1pbl9zdWJ0aXRsZScsICdFZGl0ICcgKyB0aGlzLnBhcmFtcy5faWQpO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2NvbGxlY3Rpb25fcGFnZScsICdlZGl0Jyk7XG4gICAgICBTZXNzaW9uLnNldCgnYWRtaW5fY29sbGVjdGlvbl9uYW1lJywgY29sbGVjdGlvbk5hbWUpO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2FkbWluX2lkJywgcGFyc2VJRCh0aGlzLnBhcmFtcy5faWQpKTtcbiAgICAgIFNlc3Npb24uc2V0KCdhZG1pbl9kb2MnLCBhZG1pbkNvbGxlY3Rpb25PYmplY3QoY29sbGVjdGlvbk5hbWUpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHBhcnNlSUQodGhpcy5wYXJhbXMuX2lkKVxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIChyZWYgPSBjb2xsZWN0aW9uLnJvdXRlcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLmVkaXQpICE9IG51bGwgPyByZWYxLm9uQWZ0ZXJBY3Rpb24gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFkbWluX2NvbGxlY3Rpb246IGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uTmFtZSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICByZXR1cm4gXy5kZWZhdWx0cyhvcHRpb25zLCAocmVmID0gY29sbGVjdGlvbi5yb3V0ZXMpICE9IG51bGwgPyByZWYuZWRpdCA6IHZvaWQgMCk7XG59O1xuXG5hZG1pblB1Ymxpc2hUYWJsZXMgPSBmdW5jdGlvbihjb2xsZWN0aW9ucykge1xuICByZXR1cm4gXy5lYWNoKGNvbGxlY3Rpb25zLCBmdW5jdGlvbihjb2xsZWN0aW9uLCBuYW1lKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLmNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICByZXR1cm4gTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoYWRtaW5UYWJsZVB1Yk5hbWUobmFtZSksIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMpIHtcbiAgICAgIHZhciBleHRyYUZpZWxkcztcbiAgICAgIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgICAgIGNoZWNrKGlkcywgQXJyYXkpO1xuICAgICAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgICAgIGV4dHJhRmllbGRzID0gXy5yZWR1Y2UoY29sbGVjdGlvbi5leHRyYUZpZWxkcywgZnVuY3Rpb24oZmllbGRzLCBuYW1lKSB7XG4gICAgICAgIGZpZWxkc1tuYW1lXSA9IDE7XG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICB9LCB7fSk7XG4gICAgICBfLmV4dGVuZChmaWVsZHMsIGV4dHJhRmllbGRzKTtcbiAgICAgIHRoaXMudW5ibG9jaygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgICAgcmV0dXJuIGFkbWluQ29sbGVjdGlvbk9iamVjdChuYW1lKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBjb2xsZWN0aW9uLmNoaWxkcmVuXG4gICAgICB9O1xuICAgIH0pO1xuICB9KTtcbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBhZG1pbkNyZWF0ZVRhYmxlcyh0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9ucyA6IHZvaWQgMCk7XG4gIGFkbWluQ3JlYXRlUm91dGVzKHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zIDogdm9pZCAwKTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGFkbWluUHVibGlzaFRhYmxlcyh0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9ucyA6IHZvaWQgMCk7XG4gIH1cbiAgaWYgKEFkbWluVGFibGVzLlVzZXJzKSB7XG4gICAgcmV0dXJuIHZvaWQgMDtcbiAgfVxuICByZXR1cm4gQWRtaW5UYWJsZXMuVXNlcnMgPSBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgLy8gTW9kaWZ5IHNlbGVjdG9yIHRvIGFsbG93IHNlYXJjaCBieSBlbWFpbFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgJG9yO1xuICAgICAgJG9yID0gc2VsZWN0b3JbJyRvciddO1xuICAgICAgJG9yICYmIChzZWxlY3RvclsnJG9yJ10gPSBfLm1hcCgkb3IsIGZ1bmN0aW9uKGV4cCkge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICBpZiAoKChyZWYgPSBleHAuZW1haWxzKSAhPSBudWxsID8gcmVmWyckcmVnZXgnXSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbWFpbHM6IHtcbiAgICAgICAgICAgICAgJGVsZW1NYXRjaDoge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV4cC5lbWFpbHNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGV4cDtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0sXG4gICAgbmFtZTogJ1VzZXJzJyxcbiAgICBjb2xsZWN0aW9uOiBNZXRlb3IudXNlcnMsXG4gICAgY29sdW1uczogXy51bmlvbihbXG4gICAgICB7XG4gICAgICAgIGRhdGE6ICdfaWQnLFxuICAgICAgICB0aXRsZTogJ0FkbWluJyxcbiAgICAgICAgLy8gVE9ETzogdXNlIGB0bXBsYFxuICAgICAgICBjcmVhdGVkQ2VsbDogZnVuY3Rpb24obm9kZSxcbiAgICAgIGNlbGxEYXRhLFxuICAgICAgcm93RGF0YSkge1xuICAgICAgICAgIHJldHVybiAkKG5vZGUpLmh0bWwoQmxhemUudG9IVE1MV2l0aERhdGEoVGVtcGxhdGUuYWRtaW5Vc2Vyc0lzQWRtaW4sXG4gICAgICB7XG4gICAgICAgICAgICBfaWQ6IGNlbGxEYXRhXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogJzQwcHgnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBkYXRhOiAnZW1haWxzJyxcbiAgICAgICAgdGl0bGU6ICdFbWFpbCcsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVbMF0uYWRkcmVzcztcbiAgICAgICAgfSxcbiAgICAgICAgc2VhcmNoYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGF0YTogJ2VtYWlscycsXG4gICAgICAgIHRpdGxlOiAnTWFpbCcsXG4gICAgICAgIC8vIFRPRE86IHVzZSBgdG1wbGBcbiAgICAgICAgY3JlYXRlZENlbGw6IGZ1bmN0aW9uKG5vZGUsXG4gICAgICBjZWxsRGF0YSxcbiAgICAgIHJvd0RhdGEpIHtcbiAgICAgICAgICByZXR1cm4gJChub2RlKS5odG1sKEJsYXplLnRvSFRNTFdpdGhEYXRhKFRlbXBsYXRlLmFkbWluVXNlcnNNYWlsQnRuLFxuICAgICAge1xuICAgICAgICAgICAgZW1haWxzOiBjZWxsRGF0YVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6ICc0MHB4J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGF0YTogJ2NyZWF0ZWRBdCcsXG4gICAgICAgIHRpdGxlOiAnSm9pbmVkJ1xuICAgICAgfVxuICAgIF0sIGFkbWluRWRpdERlbEJ1dHRvbnMpLFxuICAgIGRvbTogYWRtaW5UYWJsZXNEb21cbiAgfSk7XG59KTtcbiIsIkBBZG1pbkNvbGxlY3Rpb25zQ291bnQgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbiAnYWRtaW5Db2xsZWN0aW9uc0NvdW50JyIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlICdhZG1pbkNvbGxlY3Rpb25Eb2MnLCAoY29sbGVjdGlvbiwgaWQpIC0+XG5cdGNoZWNrIGNvbGxlY3Rpb24sIFN0cmluZ1xuXHRjaGVjayBpZCwgTWF0Y2guT25lT2YoU3RyaW5nLCBNb25nby5PYmplY3RJRClcblx0aWYgUm9sZXMudXNlcklzSW5Sb2xlIHRoaXMudXNlcklkLCBbJ2FkbWluJ11cblx0XHRmaW5kOiAtPlxuXHRcdFx0YWRtaW5Db2xsZWN0aW9uT2JqZWN0KGNvbGxlY3Rpb24pLmZpbmQoaWQpXG5cdFx0Y2hpbGRyZW46IEFkbWluQ29uZmlnPy5jb2xsZWN0aW9ucz9bY29sbGVjdGlvbl0/LmNoaWxkcmVuIG9yIFtdXG5cdGVsc2Vcblx0XHRAcmVhZHkoKVxuXG5NZXRlb3IucHVibGlzaCAnYWRtaW5Vc2VycycsIC0+XG5cdGlmIFJvbGVzLnVzZXJJc0luUm9sZSBAdXNlcklkLCBbJ2FkbWluJ11cblx0XHRNZXRlb3IudXNlcnMuZmluZCgpXG5cdGVsc2Vcblx0XHRAcmVhZHkoKVxuXG5NZXRlb3IucHVibGlzaCAnYWRtaW5Vc2VyJywgLT5cblx0TWV0ZW9yLnVzZXJzLmZpbmQgQHVzZXJJZFxuXG5NZXRlb3IucHVibGlzaCAnYWRtaW5Db2xsZWN0aW9uc0NvdW50JywgLT5cblx0aGFuZGxlcyA9IFtdXG5cdHNlbGYgPSBAXG5cblx0Xy5lYWNoIEFkbWluVGFibGVzLCAodGFibGUsIG5hbWUpIC0+XG5cdFx0aWQgPSBuZXcgTW9uZ28uT2JqZWN0SURcblx0XHRjb3VudCA9IDBcblx0XHR0YWJsZSA9IEFkbWluVGFibGVzW25hbWVdXG5cdFx0cmVhZHkgPSBmYWxzZVxuXHRcdHNlbGVjdG9yID0gaWYgdGFibGUuc2VsZWN0b3IgdGhlbiB0YWJsZS5zZWxlY3RvcihzZWxmLnVzZXJJZCkgZWxzZSB7fVxuXHRcdGhhbmRsZXMucHVzaCB0YWJsZS5jb2xsZWN0aW9uLmZpbmQoKS5vYnNlcnZlQ2hhbmdlc1xuXHRcdFx0YWRkZWQ6IC0+XG5cdFx0XHRcdGNvdW50ICs9IDFcblx0XHRcdFx0cmVhZHkgYW5kIHNlbGYuY2hhbmdlZCAnYWRtaW5Db2xsZWN0aW9uc0NvdW50JywgaWQsIHtjb3VudDogY291bnR9XG5cdFx0XHRyZW1vdmVkOiAtPlxuXHRcdFx0XHRjb3VudCAtPSAxXG5cdFx0XHRcdHJlYWR5IGFuZCBzZWxmLmNoYW5nZWQgJ2FkbWluQ29sbGVjdGlvbnNDb3VudCcsIGlkLCB7Y291bnQ6IGNvdW50fVxuXHRcdHJlYWR5ID0gdHJ1ZVxuXG5cdFx0c2VsZi5hZGRlZCAnYWRtaW5Db2xsZWN0aW9uc0NvdW50JywgaWQsIHtjb2xsZWN0aW9uOiBuYW1lLCBjb3VudDogY291bnR9XG5cblx0c2VsZi5vblN0b3AgLT5cblx0XHRfLmVhY2ggaGFuZGxlcywgKGhhbmRsZSkgLT4gaGFuZGxlLnN0b3AoKVxuXHRzZWxmLnJlYWR5KClcblxuTWV0ZW9yLnB1Ymxpc2ggbnVsbCwgLT5cblx0TWV0ZW9yLnJvbGVzLmZpbmQoe30pXG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSgnYWRtaW5Db2xsZWN0aW9uRG9jJywgZnVuY3Rpb24oY29sbGVjdGlvbiwgaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgY2hlY2soY29sbGVjdGlvbiwgU3RyaW5nKTtcbiAgY2hlY2soaWQsIE1hdGNoLk9uZU9mKFN0cmluZywgTW9uZ28uT2JqZWN0SUQpKTtcbiAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uKS5maW5kKGlkKTtcbiAgICAgIH0sXG4gICAgICBjaGlsZHJlbjogKHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IChyZWYgPSBBZG1pbkNvbmZpZy5jb2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2NvbGxlY3Rpb25dKSAhPSBudWxsID8gcmVmMS5jaGlsZHJlbiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgW11cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbn0pO1xuXG5NZXRlb3IucHVibGlzaCgnYWRtaW5Vc2VycycsIGZ1bmN0aW9uKCkge1xuICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxufSk7XG5cbk1ldGVvci5wdWJsaXNoKCdhZG1pblVzZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHRoaXMudXNlcklkKTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaCgnYWRtaW5Db2xsZWN0aW9uc0NvdW50JywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGVzLCBzZWxmO1xuICBoYW5kbGVzID0gW107XG4gIHNlbGYgPSB0aGlzO1xuICBfLmVhY2goQWRtaW5UYWJsZXMsIGZ1bmN0aW9uKHRhYmxlLCBuYW1lKSB7XG4gICAgdmFyIGNvdW50LCBpZCwgcmVhZHksIHNlbGVjdG9yO1xuICAgIGlkID0gbmV3IE1vbmdvLk9iamVjdElEO1xuICAgIGNvdW50ID0gMDtcbiAgICB0YWJsZSA9IEFkbWluVGFibGVzW25hbWVdO1xuICAgIHJlYWR5ID0gZmFsc2U7XG4gICAgc2VsZWN0b3IgPSB0YWJsZS5zZWxlY3RvciA/IHRhYmxlLnNlbGVjdG9yKHNlbGYudXNlcklkKSA6IHt9O1xuICAgIGhhbmRsZXMucHVzaCh0YWJsZS5jb2xsZWN0aW9uLmZpbmQoKS5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIHJldHVybiByZWFkeSAmJiBzZWxmLmNoYW5nZWQoJ2FkbWluQ29sbGVjdGlvbnNDb3VudCcsIGlkLCB7XG4gICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb3VudCAtPSAxO1xuICAgICAgICByZXR1cm4gcmVhZHkgJiYgc2VsZi5jaGFuZ2VkKCdhZG1pbkNvbGxlY3Rpb25zQ291bnQnLCBpZCwge1xuICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJldHVybiBzZWxmLmFkZGVkKCdhZG1pbkNvbGxlY3Rpb25zQ291bnQnLCBpZCwge1xuICAgICAgY29sbGVjdGlvbjogbmFtZSxcbiAgICAgIGNvdW50OiBjb3VudFxuICAgIH0pO1xuICB9KTtcbiAgc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8uZWFjaChoYW5kbGVzLCBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgIHJldHVybiBoYW5kbGUuc3RvcCgpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHNlbGYucmVhZHkoKTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaChudWxsLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1ldGVvci5yb2xlcy5maW5kKHt9KTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0YWRtaW5JbnNlcnREb2M6IChkb2MsY29sbGVjdGlvbiktPlxuXHRcdGNoZWNrIGFyZ3VtZW50cywgW01hdGNoLkFueV1cblx0XHRpZiBSb2xlcy51c2VySXNJblJvbGUgdGhpcy51c2VySWQsIFsnYWRtaW4nXVxuXHRcdFx0dGhpcy51bmJsb2NrKClcblx0XHRcdHJlc3VsdCA9IGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uKS5pbnNlcnQgZG9jXG5cdFx0XHRcdFxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXG5cdGFkbWluVXBkYXRlRG9jOiAobW9kaWZpZXIsY29sbGVjdGlvbixfaWQpLT5cblx0XHRjaGVjayBhcmd1bWVudHMsIFtNYXRjaC5BbnldXG5cdFx0aWYgUm9sZXMudXNlcklzSW5Sb2xlIHRoaXMudXNlcklkLCBbJ2FkbWluJ11cblx0XHRcdHRoaXMudW5ibG9jaygpXG5cdFx0XHRyZXN1bHQgPSBhZG1pbkNvbGxlY3Rpb25PYmplY3QoY29sbGVjdGlvbikudXBkYXRlIHtfaWQ6X2lkfSxtb2RpZmllclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXG5cdGFkbWluUmVtb3ZlRG9jOiAoY29sbGVjdGlvbixfaWQpLT5cblx0XHRjaGVjayBhcmd1bWVudHMsIFtNYXRjaC5BbnldXG5cdFx0aWYgUm9sZXMudXNlcklzSW5Sb2xlIHRoaXMudXNlcklkLCBbJ2FkbWluJ11cblx0XHRcdGlmIGNvbGxlY3Rpb24gPT0gJ1VzZXJzJ1xuXHRcdFx0XHRNZXRlb3IudXNlcnMucmVtb3ZlIHtfaWQ6X2lkfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIGdsb2JhbFtjb2xsZWN0aW9uXS5yZW1vdmUge19pZDpfaWR9XG5cdFx0XHRcdGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uKS5yZW1vdmUge19pZDogX2lkfVxuXG5cblx0YWRtaW5OZXdVc2VyOiAoZG9jKSAtPlxuXHRcdGNoZWNrIGFyZ3VtZW50cywgW01hdGNoLkFueV1cblx0XHRpZiBSb2xlcy51c2VySXNJblJvbGUgdGhpcy51c2VySWQsIFsnYWRtaW4nXVxuXHRcdFx0ZW1haWxzID0gZG9jLmVtYWlsLnNwbGl0KCcsJylcblx0XHRcdF8uZWFjaCBlbWFpbHMsIChlbWFpbCktPlxuXHRcdFx0XHR1c2VyID0ge31cblx0XHRcdFx0dXNlci5lbWFpbCA9IGVtYWlsXG5cdFx0XHRcdHVzZXIucGFzc3dvcmQgPSBkb2MucGFzc3dvcmRcblxuXHRcdFx0XHRfaWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyIHVzZXJcblxuXHRcdFx0XHRpZiBkb2Muc2VuZFBhc3N3b3JkIGFuZCBBZG1pbkNvbmZpZy5mcm9tRW1haWw/XG5cdFx0XHRcdFx0RW1haWwuc2VuZFxuXHRcdFx0XHRcdFx0dG86IHVzZXIuZW1haWxcblx0XHRcdFx0XHRcdGZyb206IEFkbWluQ29uZmlnLmZyb21FbWFpbFxuXHRcdFx0XHRcdFx0c3ViamVjdDogJ1lvdXIgYWNjb3VudCBoYXMgYmVlbiBjcmVhdGVkJ1xuXHRcdFx0XHRcdFx0aHRtbDogJ1lvdVxcJ3ZlIGp1c3QgaGFkIGFuIGFjY291bnQgY3JlYXRlZCBmb3IgJyArIE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJyB3aXRoIHBhc3N3b3JkICcgKyBkb2MucGFzc3dvcmRcblxuXHRcdFx0XHRpZiBub3QgZG9jLnNlbmRQYXNzd29yZFxuXHRcdFx0XHRcdEFjY291bnRzLnNlbmRFbnJvbGxtZW50RW1haWwgX2lkXG5cblx0YWRtaW5VcGRhdGVVc2VyOiAobW9kaWZpZXIsX2lkKS0+XG5cdFx0Y2hlY2sgYXJndW1lbnRzLCBbTWF0Y2guQW55XVxuXHRcdGlmIFJvbGVzLnVzZXJJc0luUm9sZSB0aGlzLnVzZXJJZCwgWydhZG1pbiddXG5cdFx0XHR0aGlzLnVuYmxvY2soKVxuXHRcdFx0cmVzdWx0ID0gTWV0ZW9yLnVzZXJzLnVwZGF0ZSB7X2lkOl9pZH0sIG1vZGlmaWVyXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cblx0YWRtaW5TZW5kUmVzZXRQYXNzd29yZEVtYWlsOiAoZG9jKS0+XG5cdFx0Y2hlY2sgYXJndW1lbnRzLCBbTWF0Y2guQW55XVxuXHRcdGlmIFJvbGVzLnVzZXJJc0luUm9sZSB0aGlzLnVzZXJJZCwgWydhZG1pbiddXG5cdFx0XHRjb25zb2xlLmxvZyAnQ2hhbmdpbmcgcGFzc3dvcmQgZm9yIHVzZXIgJyArIGRvYy5faWRcblx0XHRcdEFjY291bnRzLnNlbmRSZXNldFBhc3N3b3JkRW1haWwoZG9jLl9pZClcblxuXHRhZG1pbkNoYW5nZVBhc3N3b3JkOiAoZG9jKS0+XG5cdFx0Y2hlY2sgYXJndW1lbnRzLCBbTWF0Y2guQW55XVxuXHRcdGlmIFJvbGVzLnVzZXJJc0luUm9sZSB0aGlzLnVzZXJJZCwgWydhZG1pbiddXG5cdFx0XHRjb25zb2xlLmxvZyAnQ2hhbmdpbmcgcGFzc3dvcmQgZm9yIHVzZXIgJyArIGRvYy5faWRcblx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKGRvYy5faWQsIGRvYy5wYXNzd29yZClcblx0XHRcdGxhYmVsOiAnRW1haWwgdXNlciB0aGVpciBuZXcgcGFzc3dvcmQnXG5cblx0YWRtaW5DaGVja0FkbWluOiAtPlxuXHRcdGNoZWNrIGFyZ3VtZW50cywgW01hdGNoLkFueV1cblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoX2lkOnRoaXMudXNlcklkKVxuXHRcdGlmIHRoaXMudXNlcklkIGFuZCAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pIGFuZCAodXNlci5lbWFpbHMubGVuZ3RoID4gMClcblx0XHRcdGVtYWlsID0gdXNlci5lbWFpbHNbMF0uYWRkcmVzc1xuXHRcdFx0aWYgdHlwZW9mIE1ldGVvci5zZXR0aW5ncy5hZG1pbkVtYWlscyAhPSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRhZG1pbkVtYWlscyA9IE1ldGVvci5zZXR0aW5ncy5hZG1pbkVtYWlsc1xuXHRcdFx0XHRpZiBhZG1pbkVtYWlscy5pbmRleE9mKGVtYWlsKSA+IC0xXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FkZGluZyBhZG1pbiB1c2VyOiAnICsgZW1haWxcblx0XHRcdFx0XHRSb2xlcy5hZGRVc2Vyc1RvUm9sZXMgdGhpcy51c2VySWQsIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBBZG1pbkNvbmZpZyAhPSAndW5kZWZpbmVkJyBhbmQgdHlwZW9mIEFkbWluQ29uZmlnLmFkbWluRW1haWxzID09ICdvYmplY3QnXG5cdFx0XHRcdGFkbWluRW1haWxzID0gQWRtaW5Db25maWcuYWRtaW5FbWFpbHNcblx0XHRcdFx0aWYgYWRtaW5FbWFpbHMuaW5kZXhPZihlbWFpbCkgPiAtMVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nICdBZGRpbmcgYWRtaW4gdXNlcjogJyArIGVtYWlsXG5cdFx0XHRcdFx0Um9sZXMuYWRkVXNlcnNUb1JvbGVzIHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUFxuXHRcdFx0ZWxzZSBpZiB0aGlzLnVzZXJJZCA9PSBNZXRlb3IudXNlcnMuZmluZE9uZSh7fSx7c29ydDp7Y3JlYXRlZEF0OjF9fSkuX2lkXG5cdFx0XHRcdGNvbnNvbGUubG9nICdNYWtpbmcgZmlyc3QgdXNlciBhZG1pbjogJyArIGVtYWlsXG5cdFx0XHRcdFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyB0aGlzLnVzZXJJZCwgWydhZG1pbiddXG5cblx0YWRtaW5BZGRVc2VyVG9Sb2xlOiAoX2lkLHJvbGUpLT5cblx0XHRjaGVjayBhcmd1bWVudHMsIFtNYXRjaC5BbnldXG5cdFx0aWYgUm9sZXMudXNlcklzSW5Sb2xlIHRoaXMudXNlcklkLCBbJ2FkbWluJ11cblx0XHRcdFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyBfaWQsIHJvbGUsIFJvbGVzLkdMT0JBTF9HUk9VUFxuXG5cdGFkbWluUmVtb3ZlVXNlclRvUm9sZTogKF9pZCxyb2xlKS0+XG5cdFx0Y2hlY2sgYXJndW1lbnRzLCBbTWF0Y2guQW55XVxuXHRcdGlmIFJvbGVzLnVzZXJJc0luUm9sZSB0aGlzLnVzZXJJZCwgWydhZG1pbiddXG5cdFx0XHRSb2xlcy5yZW1vdmVVc2Vyc0Zyb21Sb2xlcyBfaWQsIHJvbGUsIFJvbGVzLkdMT0JBTF9HUk9VUFxuXG5cdGFkbWluU2V0Q29sbGVjdGlvblNvcnQ6IChjb2xsZWN0aW9uLCBfc29ydCkgLT5cblx0XHRjaGVjayBhcmd1bWVudHMsIFtNYXRjaC5BbnldXG5cdFx0Z2xvYmFsLkFkbWluUGFnZXNbY29sbGVjdGlvbl0uc2V0XG5cdFx0XHRzb3J0OiBfc29ydFxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBhZG1pbkluc2VydERvYzogZnVuY3Rpb24oZG9jLCBjb2xsZWN0aW9uKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBjaGVjayhhcmd1bWVudHMsIFtNYXRjaC5BbnldKTtcbiAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgIHJlc3VsdCA9IGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uKS5pbnNlcnQoZG9jKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9LFxuICBhZG1pblVwZGF0ZURvYzogZnVuY3Rpb24obW9kaWZpZXIsIGNvbGxlY3Rpb24sIF9pZCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICByZXN1bHQgPSBhZG1pbkNvbGxlY3Rpb25PYmplY3QoY29sbGVjdGlvbikudXBkYXRlKHtcbiAgICAgICAgX2lkOiBfaWRcbiAgICAgIH0sIG1vZGlmaWVyKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9LFxuICBhZG1pblJlbW92ZURvYzogZnVuY3Rpb24oY29sbGVjdGlvbiwgX2lkKSB7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgaWYgKGNvbGxlY3Rpb24gPT09ICdVc2VycycpIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5yZW1vdmUoe1xuICAgICAgICAgIF9pZDogX2lkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2xvYmFsW2NvbGxlY3Rpb25dLnJlbW92ZSB7X2lkOl9pZH1cbiAgICAgICAgcmV0dXJuIGFkbWluQ29sbGVjdGlvbk9iamVjdChjb2xsZWN0aW9uKS5yZW1vdmUoe1xuICAgICAgICAgIF9pZDogX2lkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYWRtaW5OZXdVc2VyOiBmdW5jdGlvbihkb2MpIHtcbiAgICB2YXIgZW1haWxzO1xuICAgIGNoZWNrKGFyZ3VtZW50cywgW01hdGNoLkFueV0pO1xuICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICAgIGVtYWlscyA9IGRvYy5lbWFpbC5zcGxpdCgnLCcpO1xuICAgICAgcmV0dXJuIF8uZWFjaChlbWFpbHMsIGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICAgIHZhciBfaWQsIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgdXNlci5lbWFpbCA9IGVtYWlsO1xuICAgICAgICB1c2VyLnBhc3N3b3JkID0gZG9jLnBhc3N3b3JkO1xuICAgICAgICBfaWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHVzZXIpO1xuICAgICAgICBpZiAoZG9jLnNlbmRQYXNzd29yZCAmJiAoQWRtaW5Db25maWcuZnJvbUVtYWlsICE9IG51bGwpKSB7XG4gICAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgICB0bzogdXNlci5lbWFpbCxcbiAgICAgICAgICAgIGZyb206IEFkbWluQ29uZmlnLmZyb21FbWFpbCxcbiAgICAgICAgICAgIHN1YmplY3Q6ICdZb3VyIGFjY291bnQgaGFzIGJlZW4gY3JlYXRlZCcsXG4gICAgICAgICAgICBodG1sOiAnWW91XFwndmUganVzdCBoYWQgYW4gYWNjb3VudCBjcmVhdGVkIGZvciAnICsgTWV0ZW9yLmFic29sdXRlVXJsKCkgKyAnIHdpdGggcGFzc3dvcmQgJyArIGRvYy5wYXNzd29yZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZG9jLnNlbmRQYXNzd29yZCkge1xuICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZW5kRW5yb2xsbWVudEVtYWlsKF9pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgYWRtaW5VcGRhdGVVc2VyOiBmdW5jdGlvbihtb2RpZmllciwgX2lkKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBjaGVjayhhcmd1bWVudHMsIFtNYXRjaC5BbnldKTtcbiAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgIHJlc3VsdCA9IE1ldGVvci51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IF9pZFxuICAgICAgfSwgbW9kaWZpZXIpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sXG4gIGFkbWluU2VuZFJlc2V0UGFzc3dvcmRFbWFpbDogZnVuY3Rpb24oZG9jKSB7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgY29uc29sZS5sb2coJ0NoYW5naW5nIHBhc3N3b3JkIGZvciB1c2VyICcgKyBkb2MuX2lkKTtcbiAgICAgIHJldHVybiBBY2NvdW50cy5zZW5kUmVzZXRQYXNzd29yZEVtYWlsKGRvYy5faWQpO1xuICAgIH1cbiAgfSxcbiAgYWRtaW5DaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgY29uc29sZS5sb2coJ0NoYW5naW5nIHBhc3N3b3JkIGZvciB1c2VyICcgKyBkb2MuX2lkKTtcbiAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKGRvYy5faWQsIGRvYy5wYXNzd29yZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsYWJlbDogJ0VtYWlsIHVzZXIgdGhlaXIgbmV3IHBhc3N3b3JkJ1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIGFkbWluQ2hlY2tBZG1pbjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFkbWluRW1haWxzLCBlbWFpbCwgdXNlcjtcbiAgICBjaGVjayhhcmd1bWVudHMsIFtNYXRjaC5BbnldKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0pO1xuICAgIGlmICh0aGlzLnVzZXJJZCAmJiAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pICYmICh1c2VyLmVtYWlscy5sZW5ndGggPiAwKSkge1xuICAgICAgZW1haWwgPSB1c2VyLmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgaWYgKHR5cGVvZiBNZXRlb3Iuc2V0dGluZ3MuYWRtaW5FbWFpbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGFkbWluRW1haWxzID0gTWV0ZW9yLnNldHRpbmdzLmFkbWluRW1haWxzO1xuICAgICAgICBpZiAoYWRtaW5FbWFpbHMuaW5kZXhPZihlbWFpbCkgPiAtMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgYWRtaW4gdXNlcjogJyArIGVtYWlsKTtcbiAgICAgICAgICByZXR1cm4gUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIEFkbWluQ29uZmlnICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQWRtaW5Db25maWcuYWRtaW5FbWFpbHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGFkbWluRW1haWxzID0gQWRtaW5Db25maWcuYWRtaW5FbWFpbHM7XG4gICAgICAgIGlmIChhZG1pbkVtYWlscy5pbmRleE9mKGVtYWlsKSA+IC0xKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0FkZGluZyBhZG1pbiB1c2VyOiAnICsgZW1haWwpO1xuICAgICAgICAgIHJldHVybiBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModGhpcy51c2VySWQsIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnVzZXJJZCA9PT0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe30sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGNyZWF0ZWRBdDogMVxuICAgICAgICB9XG4gICAgICB9KS5faWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ01ha2luZyBmaXJzdCB1c2VyIGFkbWluOiAnICsgZW1haWwpO1xuICAgICAgICByZXR1cm4gUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYWRtaW5BZGRVc2VyVG9Sb2xlOiBmdW5jdGlvbihfaWQsIHJvbGUpIHtcbiAgICBjaGVjayhhcmd1bWVudHMsIFtNYXRjaC5BbnldKTtcbiAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICByZXR1cm4gUm9sZXMuYWRkVXNlcnNUb1JvbGVzKF9pZCwgcm9sZSwgUm9sZXMuR0xPQkFMX0dST1VQKTtcbiAgICB9XG4gIH0sXG4gIGFkbWluUmVtb3ZlVXNlclRvUm9sZTogZnVuY3Rpb24oX2lkLCByb2xlKSB7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgcmV0dXJuIFJvbGVzLnJlbW92ZVVzZXJzRnJvbVJvbGVzKF9pZCwgcm9sZSwgUm9sZXMuR0xPQkFMX0dST1VQKTtcbiAgICB9XG4gIH0sXG4gIGFkbWluU2V0Q29sbGVjdGlvblNvcnQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIF9zb3J0KSB7XG4gICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgcmV0dXJuIGdsb2JhbC5BZG1pblBhZ2VzW2NvbGxlY3Rpb25dLnNldCh7XG4gICAgICBzb3J0OiBfc29ydFxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
