import { Mongo } from 'meteor/mongo';

MqttMessages = new Mongo.Collection("mqtt_messages")

DeviceList = new Mongo.Collection("deviceList");

// Meteor.startup(() => {
//     DeviceList.insert({
//         "id": "1",
//         "sn": "CXZvd1jExgW5rRwU9yMb",
//         "mac": "009569987c08",
//         "location": "上海交通大学电信裙楼4-325",
//         "state": "on",
//         "voltage": "220V",
//         "current": "1.5A",
//         "power": "330W",
//         "lastUpdateTime": "2018-05-16 16:08:00",
//     })
// });
