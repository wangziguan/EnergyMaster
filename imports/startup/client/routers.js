import { Router } from 'meteor/iron:router';

import '/imports/ui';

// 登录界面
Router.route('login', {
    path: '/',
    template: 'login'
});

// deviceList界面
Router.route('deviceList',{
    path: AdminDashboard.path('deviceList'),
    controller: 'AdminController',
    onAfterAction: function () {
        Session.set('admin_title', '设备列表');
    },
    // waitOn: function () {
    //     // Meteor.subscribe("deviceList");
    //     // Meteor.subscribe("mqtt_messages");
    // },
    // action: function () {
    //     var t1 = Meteor.subscribe("deviceList");
    //     if (t1 && t1.ready()){
    //         this.render();
    //     };
    // }
})

Router.route('deviceUpdate', {
    path: AdminDashboard.path('deviceUpdate'),
    controller: 'AdminController',
    onAfterAction: function () {
        Session.set('admin_title', '固件更新');
    },
    waitOn: function () {
        Meteor.subscribe("deviceList");
        Meteor.subscribe("mqtt_messages");
    },
    action: function () {
        var t1 = Meteor.subscribe("deviceList");
        if (t1 && t1.ready()){
            this.render();
        };
    }
});

