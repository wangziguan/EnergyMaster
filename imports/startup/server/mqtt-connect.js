import { Meteor } from 'meteor/meteor';

import '../../api/mqtts/methods.js';

Meteor.startup(() => {
    // code to run on server at startup
    connect.call({topic: Meteor.settings.mqttTopic});
});