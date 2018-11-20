import { Mongo } from 'meteor/mongo';

DeviceList = new Mongo.Collection("deviceList");
/**
{
    _id:
    "clientId": "1",
    "location": "上海交通大学电信裙楼4-325",
    "imei": "012345678901234",
    "createAt": new Date(),
}
*/