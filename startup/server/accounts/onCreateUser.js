import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/actions/sendWelcomeEmail';
import UserSettings from '../../../api/UserSettings/UserSettings';
import isOAuthUser from '../../../api/Users/actions/isOAuthUser';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  if (isOAuthUser({ user: userToCreate })) sendWelcomeEmail({ user: userToCreate }); // NOTE: Sent for OAuth accounts only here. Sent for password accounts after email verification.

  if (Meteor.users.find().count()) userToCreate.roles = ['user'];
  else userToCreate.roles = ['admin'];

  const settings = UserSettings.find().fetch();
  userToCreate.settings = settings;

  return userToCreate;
});
