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
})

// 固件更新界面
Router.route('deviceUpdate', {
    path: AdminDashboard.path('deviceUpdate'),
    controller: 'AdminController',
    onAfterAction: function () {
        Session.set('admin_title', '固件更新');
    },
});
