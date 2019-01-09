(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var enableDebugLogging, publishComposite;

var require = meteorInstall({"node_modules":{"meteor":{"reywood:publish-composite":{"lib":{"publish_composite.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publish_composite.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  enableDebugLogging: () => enableDebugLogging,
  publishComposite: () => publishComposite
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Publication;
module.link("./publication", {
  default(v) {
    Publication = v;
  }

}, 2);
let Subscription;
module.link("./subscription", {
  default(v) {
    Subscription = v;
  }

}, 3);
let debugLog, enableDebugLogging;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  },

  enableDebugLogging(v) {
    enableDebugLogging = v;
  }

}, 4);

function publishComposite(name, options) {
  return Meteor.publish(name, function publish(...args) {
    const subscription = new Subscription(this);
    const instanceOptions = prepareOptions.call(this, options, args);
    const publications = [];
    instanceOptions.forEach(opt => {
      const pub = new Publication(subscription, opt);
      pub.publish();
      publications.push(pub);
    });
    this.onStop(() => {
      publications.forEach(pub => pub.unpublish());
    });
    debugLog('Meteor.publish', 'ready');
    this.ready();
  });
} // For backwards compatibility


Meteor.publishComposite = publishComposite;

function prepareOptions(options, args) {
  let preparedOptions = options;

  if (typeof preparedOptions === 'function') {
    preparedOptions = preparedOptions.apply(this, args);
  }

  if (!preparedOptions) {
    return [];
  }

  if (!_.isArray(preparedOptions)) {
    preparedOptions = [preparedOptions];
  }

  return preparedOptions;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_ref_counter.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/doc_ref_counter.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class DocumentRefCounter {
  constructor(observer) {
    this.heap = {};
    this.observer = observer;
  }

  increment(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (!this.heap[key]) {
      this.heap[key] = 0;
    }

    this.heap[key] += 1;
  }

  decrement(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (this.heap[key]) {
      this.heap[key] -= 1;
      this.observer.onChange(collectionName, docId, this.heap[key]);
    }
  }

}

module.exportDefault(DocumentRefCounter);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"logging.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/logging.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  debugLog: () => debugLog,
  enableDebugLogging: () => enableDebugLogging
});

/* eslint-disable no-console */
let debugLoggingEnabled = false;

function debugLog(source, message) {
  if (!debugLoggingEnabled) {
    return;
  }

  let paddedSource = source;

  while (paddedSource.length < 35) {
    paddedSource += ' ';
  }

  console.log(`[${paddedSource}] ${message}`);
}

function enableDebugLogging() {
  debugLoggingEnabled = true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publication.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publication.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Match, check;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  },

  check(v) {
    check = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let debugLog;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  }

}, 3);
let PublishedDocumentList;
module.link("./published_document_list", {
  default(v) {
    PublishedDocumentList = v;
  }

}, 4);

class Publication {
  constructor(subscription, options, args) {
    check(options, {
      find: Function,
      children: Match.Optional(Match.OneOf([Object], Function)),
      collectionName: Match.Optional(String)
    });
    this.subscription = subscription;
    this.options = options;
    this.args = args || [];
    this.childrenOptions = options.children || [];
    this.publishedDocs = new PublishedDocumentList();
    this.collectionName = options.collectionName;
  }

  publish() {
    this.cursor = this._getCursor();

    if (!this.cursor) {
      return;
    }

    const collectionName = this._getCollectionName(); // Use Meteor.bindEnvironment to make sure the callbacks are run with the same
    // environmentVariables as when publishing the "parent".
    // It's only needed when publish is being recursively run.


    this.observeHandle = this.cursor.observe({
      added: Meteor.bindEnvironment(doc => {
        const alreadyPublished = this.publishedDocs.has(doc._id);

        if (alreadyPublished) {
          debugLog('Publication.observeHandle.added', `${collectionName}:${doc._id} already published`);
          this.publishedDocs.unflagForRemoval(doc._id);

          this._republishChildrenOf(doc);

          this.subscription.changed(collectionName, doc._id, doc);
        } else {
          this.publishedDocs.add(collectionName, doc._id);

          this._publishChildrenOf(doc);

          this.subscription.added(collectionName, doc);
        }
      }),
      changed: Meteor.bindEnvironment(newDoc => {
        debugLog('Publication.observeHandle.changed', `${collectionName}:${newDoc._id}`);

        this._republishChildrenOf(newDoc);
      }),
      removed: doc => {
        debugLog('Publication.observeHandle.removed', `${collectionName}:${doc._id}`);

        this._removeDoc(collectionName, doc._id);
      }
    });
    this.observeChangesHandle = this.cursor.observeChanges({
      changed: (id, fields) => {
        debugLog('Publication.observeChangesHandle.changed', `${collectionName}:${id}`);
        this.subscription.changed(collectionName, id, fields);
      }
    });
  }

  unpublish() {
    debugLog('Publication.unpublish', this._getCollectionName());

    this._stopObservingCursor();

    this._unpublishAllDocuments();
  }

  _republish() {
    this._stopObservingCursor();

    this.publishedDocs.flagAllForRemoval();
    debugLog('Publication._republish', 'run .publish again');
    this.publish();
    debugLog('Publication._republish', 'unpublish docs from old cursor');

    this._removeFlaggedDocs();
  }

  _getCursor() {
    return this.options.find.apply(this.subscription.meteorSub, this.args);
  }

  _getCollectionName() {
    return this.collectionName || this.cursor && this.cursor._getCollectionName();
  }

  _publishChildrenOf(doc) {
    const children = _.isFunction(this.childrenOptions) ? this.childrenOptions(doc, ...this.args) : this.childrenOptions;

    _.each(children, function createChildPublication(options) {
      const pub = new Publication(this.subscription, options, [doc].concat(this.args));
      this.publishedDocs.addChildPub(doc._id, pub);
      pub.publish();
    }, this);
  }

  _republishChildrenOf(doc) {
    this.publishedDocs.eachChildPub(doc._id, publication => {
      publication.args[0] = doc;

      publication._republish();
    });
  }

  _unpublishAllDocuments() {
    this.publishedDocs.eachDocument(doc => {
      this._removeDoc(doc.collectionName, doc.docId);
    }, this);
  }

  _stopObservingCursor() {
    debugLog('Publication._stopObservingCursor', 'stop observing cursor');

    if (this.observeHandle) {
      this.observeHandle.stop();
      delete this.observeHandle;
    }

    if (this.observeChangesHandle) {
      this.observeChangesHandle.stop();
      delete this.observeChangesHandle;
    }
  }

  _removeFlaggedDocs() {
    this.publishedDocs.eachDocument(doc => {
      if (doc.isFlaggedForRemoval()) {
        this._removeDoc(doc.collectionName, doc.docId);
      }
    }, this);
  }

  _removeDoc(collectionName, docId) {
    this.subscription.removed(collectionName, docId);

    this._unpublishChildrenOf(docId);

    this.publishedDocs.remove(docId);
  }

  _unpublishChildrenOf(docId) {
    debugLog('Publication._unpublishChildrenOf', `unpublishing children of ${this._getCollectionName()}:${docId}`);
    this.publishedDocs.eachChildPub(docId, publication => {
      publication.unpublish();
    });
  }

}

module.exportDefault(Publication);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"subscription.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/subscription.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let DocumentRefCounter;
module.link("./doc_ref_counter", {
  default(v) {
    DocumentRefCounter = v;
  }

}, 1);
let debugLog;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  }

}, 2);

class Subscription {
  constructor(meteorSub) {
    this.meteorSub = meteorSub;
    this.docHash = {};
    this.refCounter = new DocumentRefCounter({
      onChange: (collectionName, docId, refCount) => {
        debugLog('Subscription.refCounter.onChange', `${collectionName}:${docId.valueOf()} ${refCount}`);

        if (refCount <= 0) {
          meteorSub.removed(collectionName, docId);

          this._removeDocHash(collectionName, docId);
        }
      }
    });
  }

  added(collectionName, doc) {
    this.refCounter.increment(collectionName, doc._id);

    if (this._hasDocChanged(collectionName, doc._id, doc)) {
      debugLog('Subscription.added', `${collectionName}:${doc._id}`);
      this.meteorSub.added(collectionName, doc._id, doc);

      this._addDocHash(collectionName, doc);
    }
  }

  changed(collectionName, id, changes) {
    if (this._shouldSendChanges(collectionName, id, changes)) {
      debugLog('Subscription.changed', `${collectionName}:${id}`);
      this.meteorSub.changed(collectionName, id, changes);

      this._updateDocHash(collectionName, id, changes);
    }
  }

  removed(collectionName, id) {
    debugLog('Subscription.removed', `${collectionName}:${id.valueOf()}`);
    this.refCounter.decrement(collectionName, id);
  }

  _addDocHash(collectionName, doc) {
    this.docHash[buildHashKey(collectionName, doc._id)] = doc;
  }

  _updateDocHash(collectionName, id, changes) {
    const key = buildHashKey(collectionName, id);
    const existingDoc = this.docHash[key] || {};
    this.docHash[key] = _.extend(existingDoc, changes);
  }

  _shouldSendChanges(collectionName, id, changes) {
    return this._isDocPublished(collectionName, id) && this._hasDocChanged(collectionName, id, changes);
  }

  _isDocPublished(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    return !!this.docHash[key];
  }

  _hasDocChanged(collectionName, id, doc) {
    const existingDoc = this.docHash[buildHashKey(collectionName, id)];

    if (!existingDoc) {
      return true;
    }

    return _.any(_.keys(doc), key => !_.isEqual(doc[key], existingDoc[key]));
  }

  _removeDocHash(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    delete this.docHash[key];
  }

}

function buildHashKey(collectionName, id) {
  return `${collectionName}::${id.valueOf()}`;
}

module.exportDefault(Subscription);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document.js                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class PublishedDocument {
  constructor(collectionName, docId) {
    this.collectionName = collectionName;
    this.docId = docId;
    this.childPublications = [];
    this._isFlaggedForRemoval = false;
  }

  addChildPub(childPublication) {
    this.childPublications.push(childPublication);
  }

  eachChildPub(callback) {
    this.childPublications.forEach(callback);
  }

  isFlaggedForRemoval() {
    return this._isFlaggedForRemoval;
  }

  unflagForRemoval() {
    this._isFlaggedForRemoval = false;
  }

  flagForRemoval() {
    this._isFlaggedForRemoval = true;
  }

}

module.exportDefault(PublishedDocument);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document_list.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document_list.js                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let PublishedDocument;
module.link("./published_document", {
  default(v) {
    PublishedDocument = v;
  }

}, 1);

class PublishedDocumentList {
  constructor() {
    this.documents = {};
  }

  add(collectionName, docId) {
    const key = valueOfId(docId);

    if (!this.documents[key]) {
      this.documents[key] = new PublishedDocument(collectionName, docId);
    }
  }

  addChildPub(docId, publication) {
    if (!publication) {
      return;
    }

    const key = valueOfId(docId);
    const doc = this.documents[key];

    if (typeof doc === 'undefined') {
      throw new Error(`Doc not found in list: ${key}`);
    }

    this.documents[key].addChildPub(publication);
  }

  get(docId) {
    const key = valueOfId(docId);
    return this.documents[key];
  }

  remove(docId) {
    const key = valueOfId(docId);
    delete this.documents[key];
  }

  has(docId) {
    return !!this.get(docId);
  }

  eachDocument(callback, context) {
    _.each(this.documents, function execCallbackOnDoc(doc) {
      callback.call(this, doc);
    }, context || this);
  }

  eachChildPub(docId, callback) {
    const doc = this.get(docId);

    if (doc) {
      doc.eachChildPub(callback);
    }
  }

  getIds() {
    const docIds = [];
    this.eachDocument(doc => {
      docIds.push(doc.docId);
    });
    return docIds;
  }

  unflagForRemoval(docId) {
    const doc = this.get(docId);

    if (doc) {
      doc.unflagForRemoval();
    }
  }

  flagAllForRemoval() {
    this.eachDocument(doc => {
      doc.flagForRemoval();
    });
  }

}

function valueOfId(docId) {
  if (docId === null) {
    throw new Error('Document ID is null');
  }

  if (typeof docId === 'undefined') {
    throw new Error('Document ID is undefined');
  }

  return docId.valueOf();
}

module.exportDefault(PublishedDocumentList);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/reywood:publish-composite/lib/publish_composite.js");
require("/node_modules/meteor/reywood:publish-composite/lib/doc_ref_counter.js");
require("/node_modules/meteor/reywood:publish-composite/lib/logging.js");
require("/node_modules/meteor/reywood:publish-composite/lib/publication.js");
require("/node_modules/meteor/reywood:publish-composite/lib/subscription.js");

/* Exports */
Package._define("reywood:publish-composite", exports, {
  enableDebugLogging: enableDebugLogging,
  publishComposite: publishComposite
});

})();

//# sourceURL=meteor://💻app/packages/reywood_publish-composite.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaF9jb21wb3NpdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL2RvY19yZWZfY291bnRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvbG9nZ2luZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL3N1YnNjcmlwdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaGVkX2RvY3VtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9yZXl3b29kOnB1Ymxpc2gtY29tcG9zaXRlL2xpYi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJlbmFibGVEZWJ1Z0xvZ2dpbmciLCJwdWJsaXNoQ29tcG9zaXRlIiwiXyIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwiUHVibGljYXRpb24iLCJkZWZhdWx0IiwiU3Vic2NyaXB0aW9uIiwiZGVidWdMb2ciLCJuYW1lIiwib3B0aW9ucyIsInB1Ymxpc2giLCJhcmdzIiwic3Vic2NyaXB0aW9uIiwiaW5zdGFuY2VPcHRpb25zIiwicHJlcGFyZU9wdGlvbnMiLCJjYWxsIiwicHVibGljYXRpb25zIiwiZm9yRWFjaCIsIm9wdCIsInB1YiIsInB1c2giLCJvblN0b3AiLCJ1bnB1Ymxpc2giLCJyZWFkeSIsInByZXBhcmVkT3B0aW9ucyIsImFwcGx5IiwiaXNBcnJheSIsIkRvY3VtZW50UmVmQ291bnRlciIsImNvbnN0cnVjdG9yIiwib2JzZXJ2ZXIiLCJoZWFwIiwiaW5jcmVtZW50IiwiY29sbGVjdGlvbk5hbWUiLCJkb2NJZCIsImtleSIsInZhbHVlT2YiLCJkZWNyZW1lbnQiLCJvbkNoYW5nZSIsImV4cG9ydERlZmF1bHQiLCJkZWJ1Z0xvZ2dpbmdFbmFibGVkIiwic291cmNlIiwibWVzc2FnZSIsInBhZGRlZFNvdXJjZSIsImxlbmd0aCIsImNvbnNvbGUiLCJsb2ciLCJNYXRjaCIsImNoZWNrIiwiUHVibGlzaGVkRG9jdW1lbnRMaXN0IiwiZmluZCIsIkZ1bmN0aW9uIiwiY2hpbGRyZW4iLCJPcHRpb25hbCIsIk9uZU9mIiwiT2JqZWN0IiwiU3RyaW5nIiwiY2hpbGRyZW5PcHRpb25zIiwicHVibGlzaGVkRG9jcyIsImN1cnNvciIsIl9nZXRDdXJzb3IiLCJfZ2V0Q29sbGVjdGlvbk5hbWUiLCJvYnNlcnZlSGFuZGxlIiwib2JzZXJ2ZSIsImFkZGVkIiwiYmluZEVudmlyb25tZW50IiwiZG9jIiwiYWxyZWFkeVB1Ymxpc2hlZCIsImhhcyIsIl9pZCIsInVuZmxhZ0ZvclJlbW92YWwiLCJfcmVwdWJsaXNoQ2hpbGRyZW5PZiIsImNoYW5nZWQiLCJhZGQiLCJfcHVibGlzaENoaWxkcmVuT2YiLCJuZXdEb2MiLCJyZW1vdmVkIiwiX3JlbW92ZURvYyIsIm9ic2VydmVDaGFuZ2VzSGFuZGxlIiwib2JzZXJ2ZUNoYW5nZXMiLCJpZCIsImZpZWxkcyIsIl9zdG9wT2JzZXJ2aW5nQ3Vyc29yIiwiX3VucHVibGlzaEFsbERvY3VtZW50cyIsIl9yZXB1Ymxpc2giLCJmbGFnQWxsRm9yUmVtb3ZhbCIsIl9yZW1vdmVGbGFnZ2VkRG9jcyIsIm1ldGVvclN1YiIsImlzRnVuY3Rpb24iLCJlYWNoIiwiY3JlYXRlQ2hpbGRQdWJsaWNhdGlvbiIsImNvbmNhdCIsImFkZENoaWxkUHViIiwiZWFjaENoaWxkUHViIiwicHVibGljYXRpb24iLCJlYWNoRG9jdW1lbnQiLCJzdG9wIiwiaXNGbGFnZ2VkRm9yUmVtb3ZhbCIsIl91bnB1Ymxpc2hDaGlsZHJlbk9mIiwicmVtb3ZlIiwiZG9jSGFzaCIsInJlZkNvdW50ZXIiLCJyZWZDb3VudCIsIl9yZW1vdmVEb2NIYXNoIiwiX2hhc0RvY0NoYW5nZWQiLCJfYWRkRG9jSGFzaCIsImNoYW5nZXMiLCJfc2hvdWxkU2VuZENoYW5nZXMiLCJfdXBkYXRlRG9jSGFzaCIsImJ1aWxkSGFzaEtleSIsImV4aXN0aW5nRG9jIiwiZXh0ZW5kIiwiX2lzRG9jUHVibGlzaGVkIiwiYW55Iiwia2V5cyIsImlzRXF1YWwiLCJQdWJsaXNoZWREb2N1bWVudCIsImNoaWxkUHVibGljYXRpb25zIiwiX2lzRmxhZ2dlZEZvclJlbW92YWwiLCJjaGlsZFB1YmxpY2F0aW9uIiwiY2FsbGJhY2siLCJmbGFnRm9yUmVtb3ZhbCIsImRvY3VtZW50cyIsInZhbHVlT2ZJZCIsIkVycm9yIiwiZ2V0IiwiY29udGV4dCIsImV4ZWNDYWxsYmFja09uRG9jIiwiZ2V0SWRzIiwiZG9jSWRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLG9CQUFrQixFQUFDLE1BQUlBLGtCQUF4QjtBQUEyQ0Msa0JBQWdCLEVBQUMsTUFBSUE7QUFBaEUsQ0FBZDs7QUFBaUcsSUFBSUMsQ0FBSjs7QUFBTUosTUFBTSxDQUFDSyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ0QsR0FBQyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsS0FBQyxHQUFDRSxDQUFGO0FBQUk7O0FBQVYsQ0FBaEMsRUFBNEMsQ0FBNUM7QUFBK0MsSUFBSUMsTUFBSjtBQUFXUCxNQUFNLENBQUNLLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJRSxXQUFKO0FBQWdCUixNQUFNLENBQUNLLElBQVAs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LEdBQUQsSUFBUztBQUN2QkEsU0FBRyxDQUFDdUQsY0FBSjtBQUNILEtBRkQ7QUFHSDs7QUE1RXVCOztBQStFNUIsU0FBU0UsU0FBVCxDQUFtQnpGLEtBQW5CLEVBQTBCO0FBQ3RCLE1BQUlBLEtBQUssS0FBSyxJQUFkLEVBQW9CO0FBQ2hCLFVBQU0sSUFBSTBGLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQ0g7O0FBQ0QsTUFBSSxPQUFPMUYsS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUM5QixVQUFNLElBQUkwRixLQUFKLENBQVUsMEJBQVYsQ0FBTjtBQUNIOztBQUNELFNBQU8xRixLQUFLLENBQUNFLE9BQU4sRUFBUDtBQUNIOztBQTVGRHZDLE1BQU0sQ0FBQzBDLGFBQVAsQ0E4RmVVLHFCQTlGZixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9yZXl3b29kX3B1Ymxpc2gtY29tcG9zaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5pbXBvcnQgUHVibGljYXRpb24gZnJvbSAnLi9wdWJsaWNhdGlvbic7XG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gJy4vc3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGRlYnVnTG9nLCBlbmFibGVEZWJ1Z0xvZ2dpbmcgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5cbmZ1bmN0aW9uIHB1Ymxpc2hDb21wb3NpdGUobmFtZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBNZXRlb3IucHVibGlzaChuYW1lLCBmdW5jdGlvbiBwdWJsaXNoKC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih0aGlzKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VPcHRpb25zID0gcHJlcGFyZU9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgY29uc3QgcHVibGljYXRpb25zID0gW107XG5cbiAgICAgICAgaW5zdGFuY2VPcHRpb25zLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHViID0gbmV3IFB1YmxpY2F0aW9uKHN1YnNjcmlwdGlvbiwgb3B0KTtcbiAgICAgICAgICAgIHB1Yi5wdWJsaXNoKCk7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbnMucHVzaChwdWIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uU3RvcCgoKSA9PiB7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbnMuZm9yRWFjaChwdWIgPT4gcHViLnVucHVibGlzaCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVidWdMb2coJ01ldGVvci5wdWJsaXNoJywgJ3JlYWR5Jyk7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9KTtcbn1cblxuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSA9IHB1Ymxpc2hDb21wb3NpdGU7XG5cbmZ1bmN0aW9uIHByZXBhcmVPcHRpb25zKG9wdGlvbnMsIGFyZ3MpIHtcbiAgICBsZXQgcHJlcGFyZWRPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmICh0eXBlb2YgcHJlcGFyZWRPcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByZXBhcmVkT3B0aW9ucyA9IHByZXBhcmVkT3B0aW9ucy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAoIXByZXBhcmVkT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzQXJyYXkocHJlcGFyZWRPcHRpb25zKSkge1xuICAgICAgICBwcmVwYXJlZE9wdGlvbnMgPSBbcHJlcGFyZWRPcHRpb25zXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlcGFyZWRPcHRpb25zO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgZW5hYmxlRGVidWdMb2dnaW5nLFxuICAgIHB1Ymxpc2hDb21wb3NpdGUsXG59O1xuIiwiY2xhc3MgRG9jdW1lbnRSZWZDb3VudGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvYnNlcnZlcikge1xuICAgICAgICB0aGlzLmhlYXAgPSB7fTtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG9ic2VydmVyO1xuICAgIH1cblxuICAgIGluY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfWA7XG4gICAgICAgIGlmICghdGhpcy5oZWFwW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuaGVhcFtrZXldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYXBba2V5XSArPSAxO1xuICAgIH1cblxuICAgIGRlY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfWA7XG4gICAgICAgIGlmICh0aGlzLmhlYXBba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5oZWFwW2tleV0gLT0gMTtcblxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlci5vbkNoYW5nZShjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIHRoaXMuaGVhcFtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9jdW1lbnRSZWZDb3VudGVyO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG5sZXQgZGVidWdMb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkZWJ1Z0xvZyhzb3VyY2UsIG1lc3NhZ2UpIHtcbiAgICBpZiAoIWRlYnVnTG9nZ2luZ0VuYWJsZWQpIHsgcmV0dXJuOyB9XG4gICAgbGV0IHBhZGRlZFNvdXJjZSA9IHNvdXJjZTtcbiAgICB3aGlsZSAocGFkZGVkU291cmNlLmxlbmd0aCA8IDM1KSB7IHBhZGRlZFNvdXJjZSArPSAnICc7IH1cbiAgICBjb25zb2xlLmxvZyhgWyR7cGFkZGVkU291cmNlfV0gJHttZXNzYWdlfWApO1xufVxuXG5mdW5jdGlvbiBlbmFibGVEZWJ1Z0xvZ2dpbmcoKSB7XG4gICAgZGVidWdMb2dnaW5nRW5hYmxlZCA9IHRydWU7XG59XG5cbmV4cG9ydCB7XG4gICAgZGVidWdMb2csXG4gICAgZW5hYmxlRGVidWdMb2dnaW5nLFxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTWF0Y2gsIGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmltcG9ydCB7IGRlYnVnTG9nIH0gZnJvbSAnLi9sb2dnaW5nJztcbmltcG9ydCBQdWJsaXNoZWREb2N1bWVudExpc3QgZnJvbSAnLi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdCc7XG5cblxuY2xhc3MgUHVibGljYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbiwgb3B0aW9ucywgYXJncykge1xuICAgICAgICBjaGVjayhvcHRpb25zLCB7XG4gICAgICAgICAgICBmaW5kOiBGdW5jdGlvbixcbiAgICAgICAgICAgIGNoaWxkcmVuOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihbT2JqZWN0XSwgRnVuY3Rpb24pKSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb25OYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncyB8fCBbXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbk9wdGlvbnMgPSBvcHRpb25zLmNoaWxkcmVuIHx8IFtdO1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MgPSBuZXcgUHVibGlzaGVkRG9jdW1lbnRMaXN0KCk7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbk5hbWUgPSBvcHRpb25zLmNvbGxlY3Rpb25OYW1lO1xuICAgIH1cblxuICAgIHB1Ymxpc2goKSB7XG4gICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5fZ2V0Q3Vyc29yKCk7XG4gICAgICAgIGlmICghdGhpcy5jdXJzb3IpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSB0aGlzLl9nZXRDb2xsZWN0aW9uTmFtZSgpO1xuXG4gICAgICAgIC8vIFVzZSBNZXRlb3IuYmluZEVudmlyb25tZW50IHRvIG1ha2Ugc3VyZSB0aGUgY2FsbGJhY2tzIGFyZSBydW4gd2l0aCB0aGUgc2FtZVxuICAgICAgICAvLyBlbnZpcm9ubWVudFZhcmlhYmxlcyBhcyB3aGVuIHB1Ymxpc2hpbmcgdGhlIFwicGFyZW50XCIuXG4gICAgICAgIC8vIEl0J3Mgb25seSBuZWVkZWQgd2hlbiBwdWJsaXNoIGlzIGJlaW5nIHJlY3Vyc2l2ZWx5IHJ1bi5cbiAgICAgICAgdGhpcy5vYnNlcnZlSGFuZGxlID0gdGhpcy5jdXJzb3Iub2JzZXJ2ZSh7XG4gICAgICAgICAgICBhZGRlZDogTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxyZWFkeVB1Ymxpc2hlZCA9IHRoaXMucHVibGlzaGVkRG9jcy5oYXMoZG9jLl9pZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeVB1Ymxpc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUhhbmRsZS5hZGRlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2RvYy5faWR9IGFscmVhZHkgcHVibGlzaGVkYCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy51bmZsYWdGb3JSZW1vdmFsKGRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXB1Ymxpc2hDaGlsZHJlbk9mKGRvYyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmFkZChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hDaGlsZHJlbk9mKGRvYyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZGVkKGNvbGxlY3Rpb25OYW1lLCBkb2MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY2hhbmdlZDogTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgobmV3RG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLm9ic2VydmVIYW5kbGUuY2hhbmdlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke25ld0RvYy5faWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVwdWJsaXNoQ2hpbGRyZW5PZihuZXdEb2MpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICByZW1vdmVkOiAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLm9ic2VydmVIYW5kbGUucmVtb3ZlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2RvYy5faWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRG9jKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub2JzZXJ2ZUNoYW5nZXNIYW5kbGUgPSB0aGlzLmN1cnNvci5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgICAgICAgICBjaGFuZ2VkOiAoaWQsIGZpZWxkcykgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5vYnNlcnZlQ2hhbmdlc0hhbmRsZS5jaGFuZ2VkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7aWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24uY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bnB1Ymxpc2goKSB7XG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi51bnB1Ymxpc2gnLCB0aGlzLl9nZXRDb2xsZWN0aW9uTmFtZSgpKTtcbiAgICAgICAgdGhpcy5fc3RvcE9ic2VydmluZ0N1cnNvcigpO1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2hBbGxEb2N1bWVudHMoKTtcbiAgICB9XG5cbiAgICBfcmVwdWJsaXNoKCkge1xuICAgICAgICB0aGlzLl9zdG9wT2JzZXJ2aW5nQ3Vyc29yKCk7XG5cbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmZsYWdBbGxGb3JSZW1vdmFsKCk7XG5cbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLl9yZXB1Ymxpc2gnLCAncnVuIC5wdWJsaXNoIGFnYWluJyk7XG4gICAgICAgIHRoaXMucHVibGlzaCgpO1xuXG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5fcmVwdWJsaXNoJywgJ3VucHVibGlzaCBkb2NzIGZyb20gb2xkIGN1cnNvcicpO1xuICAgICAgICB0aGlzLl9yZW1vdmVGbGFnZ2VkRG9jcygpO1xuICAgIH1cblxuICAgIF9nZXRDdXJzb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZC5hcHBseSh0aGlzLnN1YnNjcmlwdGlvbi5tZXRlb3JTdWIsIHRoaXMuYXJncyk7XG4gICAgfVxuXG4gICAgX2dldENvbGxlY3Rpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uTmFtZSB8fCAodGhpcy5jdXJzb3IgJiYgdGhpcy5jdXJzb3IuX2dldENvbGxlY3Rpb25OYW1lKCkpO1xuICAgIH1cblxuICAgIF9wdWJsaXNoQ2hpbGRyZW5PZihkb2MpIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBfLmlzRnVuY3Rpb24odGhpcy5jaGlsZHJlbk9wdGlvbnMpID9cbiAgICAgICAgdGhpcy5jaGlsZHJlbk9wdGlvbnMoZG9jLCAuLi50aGlzLmFyZ3MpIDogdGhpcy5jaGlsZHJlbk9wdGlvbnM7XG4gICAgICAgIF8uZWFjaChjaGlsZHJlbiwgZnVuY3Rpb24gY3JlYXRlQ2hpbGRQdWJsaWNhdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBwdWIgPSBuZXcgUHVibGljYXRpb24odGhpcy5zdWJzY3JpcHRpb24sIG9wdGlvbnMsIFtkb2NdLmNvbmNhdCh0aGlzLmFyZ3MpKTtcbiAgICAgICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5hZGRDaGlsZFB1Yihkb2MuX2lkLCBwdWIpO1xuICAgICAgICAgICAgcHViLnB1Ymxpc2goKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3JlcHVibGlzaENoaWxkcmVuT2YoZG9jKSB7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoQ2hpbGRQdWIoZG9jLl9pZCwgKHB1YmxpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbi5hcmdzWzBdID0gZG9jO1xuICAgICAgICAgICAgcHVibGljYXRpb24uX3JlcHVibGlzaCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfdW5wdWJsaXNoQWxsRG9jdW1lbnRzKCkge1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZWFjaERvY3VtZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvYyhkb2MuY29sbGVjdGlvbk5hbWUsIGRvYy5kb2NJZCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIF9zdG9wT2JzZXJ2aW5nQ3Vyc29yKCkge1xuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3N0b3BPYnNlcnZpbmdDdXJzb3InLCAnc3RvcCBvYnNlcnZpbmcgY3Vyc29yJyk7XG5cbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZUhhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVIYW5kbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZS5zdG9wKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW1vdmVGbGFnZ2VkRG9jcygpIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICBpZiAoZG9jLmlzRmxhZ2dlZEZvclJlbW92YWwoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvYyhkb2MuY29sbGVjdGlvbk5hbWUsIGRvYy5kb2NJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIF9yZW1vdmVEb2MoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoQ2hpbGRyZW5PZihkb2NJZCk7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5yZW1vdmUoZG9jSWQpO1xuICAgIH1cblxuICAgIF91bnB1Ymxpc2hDaGlsZHJlbk9mKGRvY0lkKSB7XG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5fdW5wdWJsaXNoQ2hpbGRyZW5PZicsIGB1bnB1Ymxpc2hpbmcgY2hpbGRyZW4gb2YgJHt0aGlzLl9nZXRDb2xsZWN0aW9uTmFtZSgpfToke2RvY0lkfWApO1xuXG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoQ2hpbGRQdWIoZG9jSWQsIChwdWJsaWNhdGlvbikgPT4ge1xuICAgICAgICAgICAgcHVibGljYXRpb24udW5wdWJsaXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHVibGljYXRpb247XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgRG9jdW1lbnRSZWZDb3VudGVyIGZyb20gJy4vZG9jX3JlZl9jb3VudGVyJztcbmltcG9ydCB7IGRlYnVnTG9nIH0gZnJvbSAnLi9sb2dnaW5nJztcblxuXG5jbGFzcyBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG1ldGVvclN1Yikge1xuICAgICAgICB0aGlzLm1ldGVvclN1YiA9IG1ldGVvclN1YjtcbiAgICAgICAgdGhpcy5kb2NIYXNoID0ge307XG4gICAgICAgIHRoaXMucmVmQ291bnRlciA9IG5ldyBEb2N1bWVudFJlZkNvdW50ZXIoe1xuICAgICAgICAgICAgb25DaGFuZ2U6IChjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIHJlZkNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1N1YnNjcmlwdGlvbi5yZWZDb3VudGVyLm9uQ2hhbmdlJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfSAke3JlZkNvdW50fWApO1xuICAgICAgICAgICAgICAgIGlmIChyZWZDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGVvclN1Yi5yZW1vdmVkKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRlZChjb2xsZWN0aW9uTmFtZSwgZG9jKSB7XG4gICAgICAgIHRoaXMucmVmQ291bnRlci5pbmNyZW1lbnQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNEb2NDaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkLCBkb2MpKSB7XG4gICAgICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLmFkZGVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWV0ZW9yU3ViLmFkZGVkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgICAgdGhpcy5fYWRkRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaG91bGRTZW5kQ2hhbmdlcyhjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpKSB7XG4gICAgICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLmNoYW5nZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtpZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWV0ZW9yU3ViLmNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgICAgIGRlYnVnTG9nKCdTdWJzY3JpcHRpb24ucmVtb3ZlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2lkLnZhbHVlT2YoKX1gKTtcbiAgICAgICAgdGhpcy5yZWZDb3VudGVyLmRlY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgIH1cblxuICAgIF9hZGREb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBkb2MpIHtcbiAgICAgICAgdGhpcy5kb2NIYXNoW2J1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCldID0gZG9jO1xuICAgIH1cblxuICAgIF91cGRhdGVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykge1xuICAgICAgICBjb25zdCBrZXkgPSBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdEb2MgPSB0aGlzLmRvY0hhc2hba2V5XSB8fCB7fTtcbiAgICAgICAgdGhpcy5kb2NIYXNoW2tleV0gPSBfLmV4dGVuZChleGlzdGluZ0RvYywgY2hhbmdlcyk7XG4gICAgfVxuXG4gICAgX3Nob3VsZFNlbmRDaGFuZ2VzKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEb2NQdWJsaXNoZWQoY29sbGVjdGlvbk5hbWUsIGlkKSAmJlxuICAgICAgICAgICAgdGhpcy5faGFzRG9jQ2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpO1xuICAgIH1cblxuICAgIF9pc0RvY1B1Ymxpc2hlZChjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZG9jSGFzaFtrZXldO1xuICAgIH1cblxuICAgIF9oYXNEb2NDaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgZG9jKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nRG9jID0gdGhpcy5kb2NIYXNoW2J1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpXTtcblxuICAgICAgICBpZiAoIWV4aXN0aW5nRG9jKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgcmV0dXJuIF8uYW55KF8ua2V5cyhkb2MpLCBrZXkgPT4gIV8uaXNFcXVhbChkb2Nba2V5XSwgZXhpc3RpbmdEb2Nba2V5XSkpO1xuICAgIH1cblxuICAgIF9yZW1vdmVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZG9jSGFzaFtrZXldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgIHJldHVybiBgJHtjb2xsZWN0aW9uTmFtZX06OiR7aWQudmFsdWVPZigpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN1YnNjcmlwdGlvbjtcbiIsImNsYXNzIFB1Ymxpc2hlZERvY3VtZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLmRvY0lkID0gZG9jSWQ7XG4gICAgICAgIHRoaXMuY2hpbGRQdWJsaWNhdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFkZENoaWxkUHViKGNoaWxkUHVibGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5jaGlsZFB1YmxpY2F0aW9ucy5wdXNoKGNoaWxkUHVibGljYXRpb24pO1xuICAgIH1cblxuICAgIGVhY2hDaGlsZFB1YihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmNoaWxkUHVibGljYXRpb25zLmZvckVhY2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlzRmxhZ2dlZEZvclJlbW92YWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0ZsYWdnZWRGb3JSZW1vdmFsO1xuICAgIH1cblxuICAgIHVuZmxhZ0ZvclJlbW92YWwoKSB7XG4gICAgICAgIHRoaXMuX2lzRmxhZ2dlZEZvclJlbW92YWwgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmbGFnRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbCA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaXNoZWREb2N1bWVudDtcbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmltcG9ydCBQdWJsaXNoZWREb2N1bWVudCBmcm9tICcuL3B1Ymxpc2hlZF9kb2N1bWVudCc7XG5cblxuY2xhc3MgUHVibGlzaGVkRG9jdW1lbnRMaXN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudHMgPSB7fTtcbiAgICB9XG5cbiAgICBhZGQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50c1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50c1trZXldID0gbmV3IFB1Ymxpc2hlZERvY3VtZW50KGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDaGlsZFB1Yihkb2NJZCwgcHVibGljYXRpb24pIHtcbiAgICAgICAgaWYgKCFwdWJsaWNhdGlvbikgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmRvY3VtZW50c1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb2Mgbm90IGZvdW5kIGluIGxpc3Q6ICR7a2V5fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudHNba2V5XS5hZGRDaGlsZFB1YihwdWJsaWNhdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0KGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50c1trZXldO1xuICAgIH1cblxuICAgIHJlbW92ZShkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuICAgICAgICBkZWxldGUgdGhpcy5kb2N1bWVudHNba2V5XTtcbiAgICB9XG5cbiAgICBoYXMoZG9jSWQpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5nZXQoZG9jSWQpO1xuICAgIH1cblxuICAgIGVhY2hEb2N1bWVudChjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICBfLmVhY2godGhpcy5kb2N1bWVudHMsIGZ1bmN0aW9uIGV4ZWNDYWxsYmFja09uRG9jKGRvYykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBkb2MpO1xuICAgICAgICB9LCBjb250ZXh0IHx8IHRoaXMpO1xuICAgIH1cblxuICAgIGVhY2hDaGlsZFB1Yihkb2NJZCwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXQoZG9jSWQpO1xuXG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIGRvYy5lYWNoQ2hpbGRQdWIoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SWRzKCkge1xuICAgICAgICBjb25zdCBkb2NJZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICBkb2NJZHMucHVzaChkb2MuZG9jSWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZG9jSWRzO1xuICAgIH1cblxuICAgIHVuZmxhZ0ZvclJlbW92YWwoZG9jSWQpIHtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXQoZG9jSWQpO1xuXG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIGRvYy51bmZsYWdGb3JSZW1vdmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmbGFnQWxsRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgdGhpcy5lYWNoRG9jdW1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgZG9jLmZsYWdGb3JSZW1vdmFsKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdmFsdWVPZklkKGRvY0lkKSB7XG4gICAgaWYgKGRvY0lkID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgSUQgaXMgbnVsbCcpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRvY0lkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY3VtZW50IElEIGlzIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jSWQudmFsdWVPZigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaXNoZWREb2N1bWVudExpc3Q7XG4iXX0=
