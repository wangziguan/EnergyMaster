import { Meteor } from 'meteor/meteor';

Meteor.publish("deviceList", function () {
    return DeviceList.find();
});

Meteor.publish("currentDeviceList", function (uid, search, limit, skip) {
    const select = {};
    if (search) {
        if(search.imei) {
            console.log(search.imei);
            select.imei = search.imei;
        }    
    }
    
    return DeviceList.find(select, {limit: limit, skip: skip});
});