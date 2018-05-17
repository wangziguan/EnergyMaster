import { Router } from 'meteor/iron:router';

import '../../ui/login/login.js';
import '../../ui/device/deviceList.js';

import '../../ui/dashboard/dashboard.scss';
import '../../ui/components/components.css';
import '../../ui/AdminLTE/skins';
import '../../ui/AdminLTE/AdminLTE.min.css';

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
    waitOn: function () {
        Meteor.subscribe("deviceList");
        Meteor.subscribe("mqtt_messages");
    },
    action: function () {
        // var t1 = Meteor.subscribe("deviceList");
        // if (t1 && t1.ready()){
            this.render();
        // };
    }
})

// Dashboard页面
// Router.route('dashboard', {
//     path: '/dashboard',
//     template: 'dashboard',
//     controller: 'AdminController',
// })