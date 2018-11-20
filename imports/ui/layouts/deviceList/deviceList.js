import { Template } from 'meteor/templating';
import { Collection2 } from 'meteor/aldeed:collection2';
import { AutoForm } from 'meteor/aldeed:autoform';

import SimpleSchema from 'simpl-schema';

import './deviceList.html';
import '../../components/page/page.js';
import '../../../startup/both/schemas.js';
import '../../../api/devices/lists.js';
import '../../../api/devices/methods.js';

Template.deviceList.onRendered(function () {
    Session.set("SearchKey", null);
    PageTools.init();  

    var self=this;
    this.autorun(function () {
        PageTools.getCollectionCount("deviceListCount", Session.get("SearchKey"));
        self.subscribe("currentDeviceList", Meteor.userId(), Session.get("SearchKey"), Session.get("TableLimitKey"), Session.get("TableSkipKey"));
    });
    Session.set("userStatus", null);
    PageTools.refresh()
});

Template.deviceList.helpers({
    /**
     * Device list 列表
     * @returns {*}
     */
    "deviceListInfo": function () {
        var search = Session.get("SearchKey");
        var select = {};
        if (search) {
        }
        return DeviceList.find(select);
    },
    
    "submitButtonStatus": function () {
        if (Session.get("userStatus")) {
            return false;
        } else {
            return true;
        }
    },
});

Template.deviceList.events({
    "change #limitShow": function () {
        const limitShow = $("#limitShow option:selected").val();
        PageTools.setLimit(parseInt(limitShow));
        PageTools.setSkip(0);
    },

    "change .clientIds": function (event) {
        const clientId = $(event.currentTarget).val().trim();
        Meteor.call("checkClientId", clientId, function (err, res) {
            if (err) {
                alert(err);
            } else{
                if (res == "ClientId is not null") {
                    Session.set("userStatus", true);
                } else {
                    Session.set("userStatus", false);
                }
            }          
        });
    },
    "change .imeis": function (event) {
        var imei = $(event.currentTarget).val().trim();
        Meteor.call("checkImei", imei, function (err, res) {
            if (err) {
                alert(err);
            } else{
                if (res == "Imei is not null") {
                    Session.set("userStatus", true);
                } else {
                    Session.set("userStatus", false);
                }
            }           
        });
    },

    'click #searchDevice': function (event) {
        deviceInfoSearch();
    },
    'click #viewAllDevice': function (event) {
        deviceInfoAll();
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


Schemas.deviceList = new SimpleSchema({
    "clientId": {
        type: String,
        label: "ID",
    },
    "location": {
        type: String,
        label: "位置",
    },
    "imei": {
        type: String,
        label: "IMEI",
    },
    "createAt": {
        type: Date,
        label: "createAt",
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
});
DeviceList.attachSchema(Schemas.deviceList);

AutoForm.hooks({
    "adddeviceList": {
        onSuccess: function (formType, result) {
            Meteor.call("createDevice", result, function(err, result){
                if(!err){
                    $("#addList").modal("hide");
                }else{
                    //console.log(err);
                }
            });
            $("#addList").modal("hide");
            
        },
        formToDoc: function (doc) {
            return doc;
        }
    }
});