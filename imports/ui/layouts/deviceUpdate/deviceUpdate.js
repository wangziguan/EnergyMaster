import { Template } from 'meteor/templating';

import './deviceUpdate.html';
import '../../components/page/page.js';
import '../../../startup/both/schemas.js';
import '../../../api/devices/lists.js';
import '../../../api/devices/methods.js'

Template.deviceUpdate.onRendered(function () {
    Session.set("SearchKey", null);
    PageTools.init();  

    var self=this;
    this.autorun(function () {
        PageTools.getCollectionCount("deviceListCount", Session.get("SearchKey"));
        self.subscribe("currentDeviceList", Meteor.userId(), Session.get("SearchKey"), Session.get("TableLimitKey"), Session.get("TableSkipKey"));
    });
    PageTools.refresh()
});

Template.deviceUpdate.helpers({
    "deviceListInfo": function () {
        var search = Session.get("SearchKey");
        var select = {};
        if (search) {
        }
        return DeviceList.find(select);
    },   
});

Template.deviceUpdate.events({
    "change #limitShow": function () {
        const limitShow = $("#limitShow option:selected").val();
        PageTools.setLimit(parseInt(limitShow));
        PageTools.setSkip(0);
    },
    
    'click #uploadOTA': function (event) {
        // alert($(':input[name=OTAfile]').val());   
    },
    'click #downloadOTA': function (event) {

    },
    
    'click #searchDevice': function (event) {
        deviceInfoSearch();
    },
    'click #viewAllDevice': function (event) {
        deviceInfoAll();
    },

    'click #downloadFirmware': function (event) {
        const param = JSON.stringify(Session.get("SearchKey"));
        window.open("/download" );
    },
});

const deviceInfoSearch = function () {
    const eImei = $("#cIMEI").val();
    Session.set("SearchKey", {
        "imei": eImei,
    });
    PageTools.setSkip(0);
};

const deviceInfoAll = function () {
    Session.set("SearchKey", null);
    PageTools.setSkip(0);
};