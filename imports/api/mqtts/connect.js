import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

export const connect = new ValidatedMethod({
    name: 'mqtts.connect',
    validate: new SimpleSchema({
        topic: String,
    }).validator(),

    run({ topic }) {
        this.unblock();
        MqttMessages.mqttConnect(Meteor.settings.mqttURL, topic, {
            insert: true,
            raw: false
        })
    },
})
