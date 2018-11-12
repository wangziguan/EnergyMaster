// Meteor.settings默认设置

import { Meteor } from 'meteor/meteor';

if (typeof Meteor.settings === 'undefined'){
  Meteor.settings = {};
}

_.defaults(Meteor.settings, {
  // MAIL_URL: "smtp://490842289:vymrsayggankbgge@qq.com:587",
  // mqttURL: "http://47.106.72.131:1883",
  // ROOT_URL: "http://47.106.72.131:3000",
  // MONGO_URL: "mongodb://47.106.72.131:27017",
  mqttURL: "http://58.196.128.13:1883",
  // ROOT_URL: "http://58.196.128.13:3000",
  // MONGO_URL: "mongodb://58.196.128.13:27017",
})