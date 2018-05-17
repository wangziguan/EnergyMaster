Meteor.publish("deviceList", function () {
    return DeviceList.find();
});

Meteor.publish("mqtt_messages", function () {
    return MqttMessages.find();
});