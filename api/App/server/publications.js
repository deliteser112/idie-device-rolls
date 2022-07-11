import { Meteor } from 'meteor/meteor';

import DevicesCollection from '../../Devices/DevicesCollection';
import ActionsCollection from '../../Actions/ActionsCollection';
import DicesCollection from '../../Dices/DicesCollection';
import RollsCollection from '../../Rolls/RollsCollection';

Meteor.publish('app', function app() {
  return [Meteor.users.find({ _id: this.userId })];
});

Meteor.publish('devices', function publishDevices() {
  return DevicesCollection.find({});
});

Meteor.publish('dices', function publishDices() {
  return DicesCollection.find({});
});

Meteor.publish('actions', function publishActions() {
  return ActionsCollection.find({});
});

Meteor.publish('rolls', function publishRolls() {
  return RollsCollection.find({});
});