import RollsCollection from './RollsCollection';

export default {
  rolls: async (parent, args, context) => RollsCollection.find({}).fetch(),
  rollsByMAC: async (parent, { device }, context) => RollsCollection.find({ device }).fetch()
};
