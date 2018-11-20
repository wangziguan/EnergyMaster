// Meteor.settings默认设置
import { Meteor } from 'meteor/meteor';

if (typeof Meteor.settings === 'undefined'){
  Meteor.settings = {};
}

_.defaults(Meteor.settings, {
  mqttTopic: "ADE7953/#",
  // mqttURL: "http://47.106.72.131:1883",
  mqttURL: "http://58.196.128.13:1883",
  elasticSearchURL: "http://47.106.72.131:9200",
  AppURL: "http://47.106.72.131:3000/",
})