import './deviceList.html';
import '../../api/page/page.js';

Template.deviceList.onRendered(function () {
    Session.set("SearchKey", null);
    PageTools.init();
    PageTools.setTotal(50);
    

    var self=this;
    this.autorun(function () {
        // PageTools.getCollectionCount("deviceListCount", Session.get("SearchKey"))
        // PageTools.setTotal(50);
    });
    this.autorun(function () {
        self.subscribe("currentDeviceList", Meteor.userId(), Session.get("SearchKey"), Session.get("TableLimitKey"), Session.get("TableSkipKey"));
    });
    PageTools.refresh()
});

Template.deviceList.helpers({
    /**
     * Device list 列表
     * @returns {*}
     */
    deviceListInfo: function () {
        var search = Session.get("SearchKey");
        var select = {};
        if (search) {
        }
        return DeviceList.find(select);
    },
});

Template.deviceList.events({
    "change #limitShow": function () {
        var limitShow = $("#limitShow option:selected").val();
        PageTools.setLimit(parseInt(limitShow));
        PageTools.setSkip(0);
    },
    'click .backBtn': function (event) {
    },
});