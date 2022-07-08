import RollsCollection from './RollsCollection';

export default {
  rolls: async (parent, args, context) => RollsCollection.find({}).fetch()
};
