import { Meteor } from 'meteor/meteor';

Meteor.publish("mqtt_messages", function () {
    return MqttMessages.find();
});

Meteor.publish("general_messages", function () {
    return GeneralMessages.find();
});

Meteor.publish("energy_messages", function () {
    return EnergyMessages.find();
});

Meteor.publish("wavesample_messages", function () {
    return WavesampleMessages.find();
});