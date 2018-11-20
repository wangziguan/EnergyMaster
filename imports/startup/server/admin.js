import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
  if (!Meteor.users.findOne({username: 'admin'})) {
    var uid = Accounts.createUser({
        username: 'admin',
        email: '490842289@qq.com',
        password: 'public'
    });
    Roles.addUsersToRoles(uid, ['admin'], Roles.GLOBAL_GROUP);
  }
});
