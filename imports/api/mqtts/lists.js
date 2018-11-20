import { Mongo } from 'meteor/mongo';

MqttMessages = new Mongo.Collection("mqtt_messages");
/**
{
    _id:
    "topic": "ADE7953/012345678901234/out",   
    "payload": "01010203040102030401020304010203040102030401020102fe",
    "payload": "02010203040102030401020304fe",
    "payload": "03(010203)x280...fe",
    "createAt": new Date(),
}
*/

GeneralMessages = new Mongo.Collection("general_messages");
/**
{
    _id:
    "imei": "012345678901234",
    "voltage": "220.05",
    "current": "1.05",
    "watt": "220.05",
    "var": "1.05",
    "va": "223.10",
    "f": "50.02",
    "period": "19.98",
    "createAt": new Date(),
}
*/

EnergyMessages = new Mongo.Collection("energy_messages");
/**
{
    _id:
    "imei": "012345678901234",
    "aenergy": "100.59",
    "renergy": "10.32",
    "apenergy": "110.03",
    "createAt": new Date(),
}
*/

WavesampleMessages = new Mongo.Collection("wavesample_messages");
/**
{
    _id:
    "imei": "012345678901234",
    "samples": [1.00, 1.01, ..., 1.03], // 280
    "createAt": new Date(),
}
*/