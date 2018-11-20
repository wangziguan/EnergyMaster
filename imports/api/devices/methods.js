Meteor.methods({
    "checkClientId": function (clientId) {
        try {
            const isUser = DeviceList.findOne({clientId: clientId});
            if (isUser) {
                return "ClientId is not null";
            }  
            else{
                // console.log("ClientId is not found");
            }
        } catch (e) {
            // insertLog(e.message, e.stack);
        }
    },

    "checkImei": function (imei) {
        try {
            const isUser = DeviceList.findOne({imei: imei});
            if (isUser) {
                return "Imei is not null";
            }
            else{
                // console.log("Imei is not found");
            }    
        } catch (e) {
            // insertLog(e.message, e.stack);
        }
    },

    "deviceListCount": function (search) {
        try {
            var select = {};
            if (search) {
                if (search.imei) {
                    select.imei = search.imei;
                }
            }
            return DeviceList.find(select).count();
        } catch (e) {
            // insertLog(e.message, e.stack);
        }
    },
    
});