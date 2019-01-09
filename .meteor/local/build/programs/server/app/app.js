var require = meteorInstall({"imports":{"api":{"devices":{"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/devices/server/publications.js                                     //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
Meteor.publish("deviceList", function () {
  return DeviceList.find();
});
Meteor.publish("currentDeviceList", function (uid, search, limit, skip) {
  const select = {};

  if (search) {
    if (search.imei) {
      console.log(search.imei);
      select.imei = search.imei;
    }
  }

  return DeviceList.find(select, {
    limit: limit,
    skip: skip
  });
});
////////////////////////////////////////////////////////////////////////////////////

}},"lists.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/devices/lists.js                                                   //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
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
////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/devices/methods.js                                                 //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
Meteor.methods({
  "checkClientId": function (clientId) {
    try {
      const isUser = DeviceList.findOne({
        clientId: clientId
      });

      if (isUser) {
        return "ClientId is not null";
      } else {// console.log("ClientId is not found");
      }
    } catch (e) {// insertLog(e.message, e.stack);
    }
  },
  "checkImei": function (imei) {
    try {
      const isUser = DeviceList.findOne({
        imei: imei
      });

      if (isUser) {
        return "Imei is not null";
      } else {// console.log("Imei is not found");
      }
    } catch (e) {// insertLog(e.message, e.stack);
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
    } catch (e) {// insertLog(e.message, e.stack);
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////

}},"mqtts":{"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/mqtts/server/publications.js                                       //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
Meteor.publish("mqtt_messages", function () {
  return MqttMessages.find();
});
Meteor.publish("general_messages", function () {
  return GeneralMessages.find();
});
Meteor.publish("energy_messages", function () {
  return EnergyMessages.find();
});
Meteor.publish("wavesample_messages", function () {
  return WavesampleMessages.find();
});
////////////////////////////////////////////////////////////////////////////////////

}},"lists.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/mqtts/lists.js                                                     //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
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
////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/api/mqtts/methods.js                                                   //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
connect = new ValidatedMethod({
  name: 'mqtts.connect',
  validate: new SimpleSchema({
    topic: String
  }).validator(),

  run({
    topic
  }) {
    this.unblock();
    MqttMessages.mqttConnect(Meteor.settings.mqttURL, topic, {
      insert: true,
      raw: false
    });
  }

});
////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"both":{"_settings.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/both/_settings.js                                              //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

if (typeof Meteor.settings === 'undefined') {
  Meteor.settings = {};
}

_.defaults(Meteor.settings, {
  mqttTopic: "ADE7953/#",
  // mqttURL: "http://47.106.72.131:1883",
  mqttURL: "http://58.196.128.13:1883",
  elasticSearchURL: "http://47.106.72.131:9200",
  AppURL: "http://47.106.72.131:3000/"
});
////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/both/index.js                                                  //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
module.link("./_settings.js");
module.link("./schemas.js");
module.link("../../api/devices/lists.js");
module.link("../../api/mqtts/lists.js");
module.link("../../api/devices/methods.js");
module.link("../../api/mqtts/methods.js");
////////////////////////////////////////////////////////////////////////////////////

},"schemas.js":function(){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/both/schemas.js                                                //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
Schemas = {};
////////////////////////////////////////////////////////////////////////////////////

}},"server":{"admin.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/server/admin.js                                                //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 1);
Meteor.startup(() => {
  if (!Meteor.users.findOne({
    username: 'admin'
  })) {
    var uid = Accounts.createUser({
      username: 'admin',
      email: '490842289@qq.com',
      password: 'public'
    });
    Roles.addUsersToRoles(uid, ['admin'], Roles.GLOBAL_GROUP);
  }
});
////////////////////////////////////////////////////////////////////////////////////

},"email.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/server/email.js                                                //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
Accounts.emailTemplates.siteName = "EnergyMaster";
Accounts.emailTemplates.from = '490842289@qq.com';
////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/server/index.js                                                //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
module.link("./admin.js");
module.link("./email.js");
module.link("./mqtt-connect.js");
module.link("./routers.js");
module.link("../../api/devices/server/publications.js");
module.link("../../api/mqtts/server/publications.js");
////////////////////////////////////////////////////////////////////////////////////

},"mqtt-connect.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/server/mqtt-connect.js                                         //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
module.link("../../api/mqtts/methods.js");
Meteor.startup(() => {
  // code to run on server at startup
  connect.call({
    topic: Meteor.settings.mqttTopic
  });
});
////////////////////////////////////////////////////////////////////////////////////

},"routers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// imports/startup/server/routers.js                                              //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
let Router;
module.link("meteor/iron:router", {
  Router(v) {
    Router = v;
  }

}, 0);
let fs;
module.link("fs", {
  default(v) {
    fs = v;
  }

}, 1);
Router.route('/download', function () {
  const title = "ADE7953_1.0.0_Luat_V0027_8955.bin";
  const headers = {
    'Content-type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=' + title
  };
  const filepath = Assets.absoluteFilePath(title);
  this.response.writeHead(200, headers);
  this.response.end(fs.readFileSync(filepath));
}, {
  where: 'server'
});
Router.route('/upload/OTA', function () {
  if (this.request) {
    console.log(this.request); //     const uploadpath = "/home/wangziguan/wzg/";
    //     const filename = uploadpath + "1.bin";
    //     const uploadfile = this.request.files[0]
    //     fs.writeFile(filename, uploadfile, function(err){
    //         if (err) throw err ;
    //         console.log("File Saved !"); 
    //     });
  }

  ;
  this.response.writeHead(200);
  this.response.end();
}, {
  where: 'server'
});
////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// server/main.js                                                                 //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
module.link("/imports/startup/server");
module.link("/imports/startup/both");
////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZGV2aWNlcy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9kZXZpY2VzL2xpc3RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9kZXZpY2VzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL21xdHRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL21xdHRzL2xpc3RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tcXR0cy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvYm90aC9fc2V0dGluZ3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9ib3RoL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvYm90aC9zY2hlbWFzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2FkbWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL21xdHQtY29ubmVjdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yb3V0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsInB1Ymxpc2giLCJEZXZpY2VMaXN0IiwiZmluZCIsInVpZCIsInNlYXJjaCIsImxpbWl0Iiwic2tpcCIsInNlbGVjdCIsImltZWkiLCJjb25zb2xlIiwibG9nIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwibWV0aG9kcyIsImNsaWVudElkIiwiaXNVc2VyIiwiZmluZE9uZSIsImUiLCJjb3VudCIsIk1xdHRNZXNzYWdlcyIsIkdlbmVyYWxNZXNzYWdlcyIsIkVuZXJneU1lc3NhZ2VzIiwiV2F2ZXNhbXBsZU1lc3NhZ2VzIiwiVmFsaWRhdGVkTWV0aG9kIiwiU2ltcGxlU2NoZW1hIiwiZGVmYXVsdCIsImNvbm5lY3QiLCJuYW1lIiwidmFsaWRhdGUiLCJ0b3BpYyIsIlN0cmluZyIsInZhbGlkYXRvciIsInJ1biIsInVuYmxvY2siLCJtcXR0Q29ubmVjdCIsInNldHRpbmdzIiwibXF0dFVSTCIsImluc2VydCIsInJhdyIsIl8iLCJkZWZhdWx0cyIsIm1xdHRUb3BpYyIsImVsYXN0aWNTZWFyY2hVUkwiLCJBcHBVUkwiLCJTY2hlbWFzIiwiQWNjb3VudHMiLCJSb2xlcyIsInN0YXJ0dXAiLCJ1c2VycyIsInVzZXJuYW1lIiwiY3JlYXRlVXNlciIsImVtYWlsIiwicGFzc3dvcmQiLCJhZGRVc2Vyc1RvUm9sZXMiLCJHTE9CQUxfR1JPVVAiLCJlbWFpbFRlbXBsYXRlcyIsInNpdGVOYW1lIiwiZnJvbSIsImNhbGwiLCJSb3V0ZXIiLCJmcyIsInJvdXRlIiwidGl0bGUiLCJoZWFkZXJzIiwiZmlsZXBhdGgiLCJBc3NldHMiLCJhYnNvbHV0ZUZpbGVQYXRoIiwicmVzcG9uc2UiLCJ3cml0ZUhlYWQiLCJlbmQiLCJyZWFkRmlsZVN5bmMiLCJ3aGVyZSIsInJlcXVlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUVYSCxNQUFNLENBQUNJLE9BQVAsQ0FBZSxZQUFmLEVBQTZCLFlBQVk7QUFDckMsU0FBT0Ms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Q0MsSUFBUCxDQUFZLElBQVosRUFBaUI7QUFBQzJCLFNBQU8sQ0FBQzFCLENBQUQsRUFBRztBQUFDNkQsTUFBRSxHQUFDN0QsQ0FBSDtBQUFLOztBQUFqQixDQUFqQixFQUFvQyxDQUFwQztBQUk1RTRELE1BQU0sQ0FBQ0UsS0FBUCxDQUFhLFdBQWIsRUFBMEIsWUFBWTtBQUNsQyxRQUFNQyxLQUFLLEdBQUcsbUNBQWQ7QUFDQSxRQUFNQyxPQUFPLEdBQUc7QUFDZCxvQkFBZ0IsMEJBREY7QUFFZCwyQkFBdUIsMEJBQTBCRDtBQUZuQyxHQUFoQjtBQUlBLFFBQU1FLFFBQVEsR0FBR0MsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QkosS0FBeEIsQ0FBakI7QUFDQSxPQUFLSyxRQUFMLENBQWNDLFNBQWQsQ0FBd0IsR0FBeEIsRUFBNkJMLE9BQTdCO0FBQ0EsT0FBS0ksUUFBTCxDQUFjRSxHQUFkLENBQWtCVCxFQUFFLENBQUNVLFlBQUgsQ0FBZ0JOLFFBQWhCLENBQWxCO0FBQ0QsQ0FUSCxFQVNJO0FBQUNPLE9BQUssRUFBRTtBQUFSLENBVEo7QUFXQVosTUFBTSxDQUFDRSxLQUFQLENBQWEsYUFBYixFQUE0QixZQUFZO0FBQ3BDLE1BQUksS0FBS1csT0FBVCxFQUFpQjtBQUNiL0QsV0FBTyxDQUFDQyxHQUFSLENBQVksS0FBSzhELE9BQWpCLEVBRGEsQ0FFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQzs7QUFBQTtBQUNELE9BQUtMLFFBQUwsQ0FBY0MsU0FBZCxDQUF3QixHQUF4QjtBQUNBLE9BQUtELFFBQUwsQ0FBY0UsR0FBZDtBQUNILENBYkQsRUFhRTtBQUFDRSxPQUFLLEVBQUU7QUFBUixDQWJGLEU7Ozs7Ozs7Ozs7O0FDZkExRSxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbk1ldGVvci5wdWJsaXNoKFwiZGV2aWNlTGlzdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIERldmljZUxpc3QuZmluZCgpO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKFwiY3VycmVudERldmljZUxpc3RcIiwgZnVuY3Rpb24gKHVpZCwgc2VhcmNoLCBsaW1pdCwgc2tpcCkge1xuICAgIGNvbnN0IHNlbGVjdCA9IHt9O1xuICAgIGlmIChzZWFyY2gpIHtcbiAgICAgICAgaWYoc2VhcmNoLmltZWkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlYXJjaC5pbWVpKTtcbiAgICAgICAgICAgIHNlbGVjdC5pbWVpID0gc2VhcmNoLmltZWk7XG4gICAgICAgIH0gICAgXG4gICAgfVxuICAgIFxuICAgIHJldHVybiBEZXZpY2VMaXN0LmZpbmQoc2VsZWN0LCB7bGltaXQ6IGxpbWl0LCBza2lwOiBza2lwfSk7XG59KTsiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbkRldmljZUxpc3QgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcImRldmljZUxpc3RcIik7XG4vKipcbntcbiAgICBfaWQ6XG4gICAgXCJjbGllbnRJZFwiOiBcIjFcIixcbiAgICBcImxvY2F0aW9uXCI6IFwi5LiK5rW35Lqk6YCa5aSn5a2m55S15L+h6KOZ5qW8NC0zMjVcIixcbiAgICBcImltZWlcIjogXCIwMTIzNDU2Nzg5MDEyMzRcIixcbiAgICBcImNyZWF0ZUF0XCI6IG5ldyBEYXRlKCksXG59XG4qLyIsIk1ldGVvci5tZXRob2RzKHtcbiAgICBcImNoZWNrQ2xpZW50SWRcIjogZnVuY3Rpb24gKGNsaWVudElkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBpc1VzZXIgPSBEZXZpY2VMaXN0LmZpbmRPbmUoe2NsaWVudElkOiBjbGllbnRJZH0pO1xuICAgICAgICAgICAgaWYgKGlzVXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkNsaWVudElkIGlzIG5vdCBudWxsXCI7XG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbGllbnRJZCBpcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIGluc2VydExvZyhlLm1lc3NhZ2UsIGUuc3RhY2spO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiY2hlY2tJbWVpXCI6IGZ1bmN0aW9uIChpbWVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBpc1VzZXIgPSBEZXZpY2VMaXN0LmZpbmRPbmUoe2ltZWk6IGltZWl9KTtcbiAgICAgICAgICAgIGlmIChpc1VzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJJbWVpIGlzIG5vdCBudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSW1laSBpcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBpbnNlcnRMb2coZS5tZXNzYWdlLCBlLnN0YWNrKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRldmljZUxpc3RDb3VudFwiOiBmdW5jdGlvbiAoc2VhcmNoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0ge307XG4gICAgICAgICAgICBpZiAoc2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaC5pbWVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5pbWVpID0gc2VhcmNoLmltZWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIERldmljZUxpc3QuZmluZChzZWxlY3QpLmNvdW50KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIGluc2VydExvZyhlLm1lc3NhZ2UsIGUuc3RhY2spO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbn0pOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5NZXRlb3IucHVibGlzaChcIm1xdHRfbWVzc2FnZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNcXR0TWVzc2FnZXMuZmluZCgpO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKFwiZ2VuZXJhbF9tZXNzYWdlc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEdlbmVyYWxNZXNzYWdlcy5maW5kKCk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJlbmVyZ3lfbWVzc2FnZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBFbmVyZ3lNZXNzYWdlcy5maW5kKCk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJ3YXZlc2FtcGxlX21lc3NhZ2VzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gV2F2ZXNhbXBsZU1lc3NhZ2VzLmZpbmQoKTtcbn0pOyIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcblxuTXF0dE1lc3NhZ2VzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJtcXR0X21lc3NhZ2VzXCIpO1xuLyoqXG57XG4gICAgX2lkOlxuICAgIFwidG9waWNcIjogXCJBREU3OTUzLzAxMjM0NTY3ODkwMTIzNC9vdXRcIiwgICBcbiAgICBcInBheWxvYWRcIjogXCIwMTAxMDIwMzA0MDEwMjAzMDQwMTAyMDMwNDAxMDIwMzA0MDEwMjAzMDQwMTAyMDEwMmZlXCIsXG4gICAgXCJwYXlsb2FkXCI6IFwiMDIwMTAyMDMwNDAxMDIwMzA0MDEwMjAzMDRmZVwiLFxuICAgIFwicGF5bG9hZFwiOiBcIjAzKDAxMDIwMyl4MjgwLi4uZmVcIixcbiAgICBcImNyZWF0ZUF0XCI6IG5ldyBEYXRlKCksXG59XG4qL1xuXG5HZW5lcmFsTWVzc2FnZXMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcImdlbmVyYWxfbWVzc2FnZXNcIik7XG4vKipcbntcbiAgICBfaWQ6XG4gICAgXCJpbWVpXCI6IFwiMDEyMzQ1Njc4OTAxMjM0XCIsXG4gICAgXCJ2b2x0YWdlXCI6IFwiMjIwLjA1XCIsXG4gICAgXCJjdXJyZW50XCI6IFwiMS4wNVwiLFxuICAgIFwid2F0dFwiOiBcIjIyMC4wNVwiLFxuICAgIFwidmFyXCI6IFwiMS4wNVwiLFxuICAgIFwidmFcIjogXCIyMjMuMTBcIixcbiAgICBcImZcIjogXCI1MC4wMlwiLFxuICAgIFwicGVyaW9kXCI6IFwiMTkuOThcIixcbiAgICBcImNyZWF0ZUF0XCI6IG5ldyBEYXRlKCksXG59XG4qL1xuXG5FbmVyZ3lNZXNzYWdlcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwiZW5lcmd5X21lc3NhZ2VzXCIpO1xuLyoqXG57XG4gICAgX2lkOlxuICAgIFwiaW1laVwiOiBcIjAxMjM0NTY3ODkwMTIzNFwiLFxuICAgIFwiYWVuZXJneVwiOiBcIjEwMC41OVwiLFxuICAgIFwicmVuZXJneVwiOiBcIjEwLjMyXCIsXG4gICAgXCJhcGVuZXJneVwiOiBcIjExMC4wM1wiLFxuICAgIFwiY3JlYXRlQXRcIjogbmV3IERhdGUoKSxcbn1cbiovXG5cbldhdmVzYW1wbGVNZXNzYWdlcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwid2F2ZXNhbXBsZV9tZXNzYWdlc1wiKTtcbi8qKlxue1xuICAgIF9pZDpcbiAgICBcImltZWlcIjogXCIwMTIzNDU2Nzg5MDEyMzRcIixcbiAgICBcInNhbXBsZXNcIjogWzEuMDAsIDEuMDEsIC4uLiwgMS4wM10sIC8vIDI4MFxuICAgIFwiY3JlYXRlQXRcIjogbmV3IERhdGUoKSxcbn1cbiovIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jb25uZWN0ID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gICAgbmFtZTogJ21xdHRzLmNvbm5lY3QnLFxuICAgIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICAgICAgdG9waWM6IFN0cmluZyxcbiAgICB9KS52YWxpZGF0b3IoKSxcblxuICAgIHJ1bih7IHRvcGljIH0pIHtcbiAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgIE1xdHRNZXNzYWdlcy5tcXR0Q29ubmVjdChNZXRlb3Iuc2V0dGluZ3MubXF0dFVSTCwgdG9waWMsIHtcbiAgICAgICAgICAgIGluc2VydDogdHJ1ZSxcbiAgICAgICAgICAgIHJhdzogZmFsc2VcbiAgICAgICAgfSlcbiAgICB9LFxufSkiLCIvLyBNZXRlb3Iuc2V0dGluZ3Ppu5jorqTorr7nva5cbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5pZiAodHlwZW9mIE1ldGVvci5zZXR0aW5ncyA9PT0gJ3VuZGVmaW5lZCcpe1xuICBNZXRlb3Iuc2V0dGluZ3MgPSB7fTtcbn1cblxuXy5kZWZhdWx0cyhNZXRlb3Iuc2V0dGluZ3MsIHtcbiAgbXF0dFRvcGljOiBcIkFERTc5NTMvI1wiLFxuICAvLyBtcXR0VVJMOiBcImh0dHA6Ly80Ny4xMDYuNzIuMTMxOjE4ODNcIixcbiAgbXF0dFVSTDogXCJodHRwOi8vNTguMTk2LjEyOC4xMzoxODgzXCIsXG4gIGVsYXN0aWNTZWFyY2hVUkw6IFwiaHR0cDovLzQ3LjEwNi43Mi4xMzE6OTIwMFwiLFxuICBBcHBVUkw6IFwiaHR0cDovLzQ3LjEwNi43Mi4xMzE6MzAwMC9cIixcbn0pIiwiaW1wb3J0ICcuL19zZXR0aW5ncy5qcyc7XG5pbXBvcnQgJy4vc2NoZW1hcy5qcyc7XG5cbmltcG9ydCAnLi4vLi4vYXBpL2RldmljZXMvbGlzdHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvbXF0dHMvbGlzdHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvZGV2aWNlcy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL21xdHRzL21ldGhvZHMuanMnO1xuIiwiU2NoZW1hcyA9IHt9OyIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGlmICghTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe3VzZXJuYW1lOiAnYWRtaW4nfSkpIHtcbiAgICB2YXIgdWlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7XG4gICAgICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgICAgICBlbWFpbDogJzQ5MDg0MjI4OUBxcS5jb20nLFxuICAgICAgICBwYXNzd29yZDogJ3B1YmxpYydcbiAgICB9KTtcbiAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModWlkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCk7XG4gIH1cbn0pO1xuIiwiLy8g6K6+572u6YKu5Lu25Y+R6YCB5L+h5oGvXG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWUgPSBcIkVuZXJneU1hc3RlclwiO1xuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSA9ICc0OTA4NDIyODlAcXEuY29tJzsiLCJpbXBvcnQgJy4vYWRtaW4uanMnO1xuaW1wb3J0ICcuL2VtYWlsLmpzJztcbmltcG9ydCAnLi9tcXR0LWNvbm5lY3QuanMnO1xuaW1wb3J0ICcuL3JvdXRlcnMuanMnO1xuXG5pbXBvcnQgJy4uLy4uL2FwaS9kZXZpY2VzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvbXF0dHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuaW1wb3J0ICcuLi8uLi9hcGkvbXF0dHMvbWV0aG9kcy5qcyc7XG5cbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAvLyBjb2RlIHRvIHJ1biBvbiBzZXJ2ZXIgYXQgc3RhcnR1cFxuICAgIGNvbm5lY3QuY2FsbCh7dG9waWM6IE1ldGVvci5zZXR0aW5ncy5tcXR0VG9waWN9KTtcbn0pOyIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gJ21ldGVvci9pcm9uOnJvdXRlcic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5cblJvdXRlci5yb3V0ZSgnL2Rvd25sb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRpdGxlID0gXCJBREU3OTUzXzEuMC4wX0x1YXRfVjAwMjdfODk1NS5iaW5cIjtcbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICAgJ0NvbnRlbnQtRGlzcG9zaXRpb24nOiAnYXR0YWNobWVudDsgZmlsZW5hbWU9JyArIHRpdGxlXG4gICAgfTtcbiAgICBjb25zdCBmaWxlcGF0aCA9IEFzc2V0cy5hYnNvbHV0ZUZpbGVQYXRoKHRpdGxlKTtcbiAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGhlYWRlcnMpO1xuICAgIHRoaXMucmVzcG9uc2UuZW5kKGZzLnJlYWRGaWxlU3luYyhmaWxlcGF0aCkpO1xuICB9LHt3aGVyZTogJ3NlcnZlcid9KTtcblxuUm91dGVyLnJvdXRlKCcvdXBsb2FkL09UQScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5yZXF1ZXN0KXtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yZXF1ZXN0KTtcbiAgICAvLyAgICAgY29uc3QgdXBsb2FkcGF0aCA9IFwiL2hvbWUvd2FuZ3ppZ3Vhbi93emcvXCI7XG4gICAgLy8gICAgIGNvbnN0IGZpbGVuYW1lID0gdXBsb2FkcGF0aCArIFwiMS5iaW5cIjtcbiAgICAvLyAgICAgY29uc3QgdXBsb2FkZmlsZSA9IHRoaXMucmVxdWVzdC5maWxlc1swXVxuICAgIC8vICAgICBmcy53cml0ZUZpbGUoZmlsZW5hbWUsIHVwbG9hZGZpbGUsIGZ1bmN0aW9uKGVycil7XG4gICAgLy8gICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnIgO1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJGaWxlIFNhdmVkICFcIik7IFxuICAgIC8vICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCk7XG4gICAgdGhpcy5yZXNwb25zZS5lbmQoKTtcbn0se3doZXJlOiAnc2VydmVyJ30pOyAgXG4gICAiLCJpbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJztcbmltcG9ydCAnL2ltcG9ydHMvc3RhcnR1cC9ib3RoJztcbiJdfQ==
