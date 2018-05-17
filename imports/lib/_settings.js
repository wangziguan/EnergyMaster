if (typeof Meteor.settings === 'undefined'){
  Meteor.settings = {};
}

_.defaults(Meteor.settings, {
  mqttURL: "http://47.106.72.131:1883"
})