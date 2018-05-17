import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

if (!Meteor.users.findOne({username: 'admin'})) {
  var uid = Accounts.createUser({
      username: 'admin',
      email: 'wangziguan@sjtu.edu.cn',
      password: 'public'
  });
  Roles.addUsersToRoles(uid, ['admin'], 'user-group');
}
