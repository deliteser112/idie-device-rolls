import RollsCollection from './DicesCollection';

export default {
  rolls: async (parent, args, context) => RollsCollection.find({}).fetch()
};
