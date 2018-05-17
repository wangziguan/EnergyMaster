import { Template } from 'meteor/templating';
import { backstretch } from 'meteor/goltfisch:jquery-backstretch';
import { Mousetrap } from 'meteor/mousetrap:mousetrap';
import { Router} from 'meteor/iron:router';

import './login.html';
import './login.scss';

Template.login.onRendered(function () {
    $.backstretch([
        "/bg/1.jpg","/bg/2.jpg","/bg/3.jpg","/bg/4.jpg"
        ], {
        fade: 1000,duration: 8000
    });

    $("body").addClass("loginClient");
    // 绑定enter键
    Mousetrap.bind('enter', function () {
        login();
    });
    // input框选中时按下enter键
    var txt = $("input");
    txt.keyup(function (e) {
        if (e.keyCode == 13)
            login();
    });
});

// 点击登录按钮
Template.login.events({
    'click #login-js': function () {
        login();
    }
});

var login = function () {
    var username = $('[id=username_content]').val().trim();
    var password = $('[id=pwd_content]').val().trim();

    Meteor.loginWithPassword(username, password, function (error) {
        var user = {};
        user.username = username;
        if (error) {
            //insertTransactionRecord(user, "loginClient", "login", {message: "login failed"});
            alert("用户名或密码错误！");
            console.log(error)
        } else {
            user.uid = Meteor.userId();
            //insertTransactionRecord(user, "loginClient", "login", {message: "login success"});
            Session.set("loginUserName", username);

            if (Roles.userIsInRole(Meteor.userId(), ["admin"], "user-group")) {
                console.log('login success!');
                Router.go("/admin");
            }
        }
    });
};

Template.login.onDestroyed(function () {
    $("body").removeClass("loginClient");
    $(".backstretch").remove();
    Mousetrap.unbind('enter');
});