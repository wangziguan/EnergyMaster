import './deviceList.html';
import '../../api/page/page.js';

Template.deviceList.onRendered(function () {
    //insertTransactionRecord({uid: Meteor.userId()}, "deviceList", "view deviceList", {});
    //Session.set(SearchKey, {});
    // PageTools.init();

    // this.autorun(function () {
    //     PageTools.getCollectionCount("deviceListCount", Session.get(SearchKey))
    // });
});

Template.deviceList.helpers({
    /**
     * Device list 列表
     * @returns {*}
     */
    deviceListInfo: function () {
        var deviceArr = [];     

        DeviceList.find().forEach(function (device) {
            deviceArr.push(device);
        });

        MqttMessages.find().forEach(function (mqtt_message) {
            deviceArr.push(mqtt_message.message);
        });
        return deviceArr;
    },

    "change #limitShow": function () {
        var limitShow = $("#limitShow option:selected").val();
        PageTools.setLimt(parseInt(limitShow));
        PageTools.setSkip(0);
    },
});

Template.deviceList.events({
    'click .backBtn': function (event) {
    }
});