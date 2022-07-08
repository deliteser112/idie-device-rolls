import ActionsCollection from './ActionsCollection';

export default {
  action: async (parent, args, context) => ActionsCollection.findOne({ _id: args._id }),
  actions: async (parent, args, context) => ActionsCollection.find({}).fetch()
};
