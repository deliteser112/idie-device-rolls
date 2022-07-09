import DicesCollection from './DicesCollection';

export default {
  dices: async (parent, args, context) => DicesCollection.find({}).fetch(),
  dice: async (parent, args, context) => DicesCollection.findOne({ _id: args._id }),
};
