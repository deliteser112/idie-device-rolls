import { Meteor } from 'meteor/meteor';

import DevicesCollection from '../../Devices/DevicesCollection'
import ActionsCollection from '../../Actions/ActionsCollection'

Meteor.publish('app', function app() {
  return [Meteor.users.find({ _id: this.userId })];
});

Meteor.publish('devices', function app() {
  return DevicesCollection.find({});
});

Meteor.publish('actions', function app() {
  return ActionsCollection.find({});
});