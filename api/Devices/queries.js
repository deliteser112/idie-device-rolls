import DevicesCollection from './DevicesCollection';
import normalizeMeteorUserData from './actions/normalizeMeteorUserData';

export default {
  devices: async (parent, args, context) => DevicesCollection.find({}).fetch(),
  device: async (parent, args, context) => DevicesCollection.findOne({ _id: args._id }),
  deviceUsers: async (parent, args, context) => {
    return Meteor.users
      .find({})
      .fetch()
      .map((user) => {
        const userInfo = normalizeMeteorUserData({ user });
        const { _id, emails, profile } = userInfo;

        const data = {
          _id,
          email: emails[0].address,
          name: profile.name
        };
        return data;
      });
  }
};
