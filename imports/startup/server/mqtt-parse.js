import { Meteor } from 'meteor/meteor';

import { connect } from '../../api/mqtts/connect.js';

Meteor.startup(() => {
    // code to run on server at startup
    connect.call({topic:"wangziguan/#"});
});