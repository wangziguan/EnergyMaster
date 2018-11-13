import { Meteor } from 'meteor/meteor';

Meteor.publish("deviceList", function () {
    return DeviceList.find();
});

Meteor.publish("currentDeviceList", function (uid, search, limit, skip) {
    var select = {};
    if (search) {
    }
    return DeviceList.find(select, {limit: limit, skip: skip});
});

Meteor.publish("mqtt_messages", function () {
    return MqttMessages.find();
});