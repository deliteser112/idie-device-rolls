import DicesCollection from './DicesCollection';

export default {
  addDice: async (root, { did, name, userId, actionIds, coverImg }, { user }) => {
    const uId = user._id;
    if (!uId) {
      return null;
    }
    const isExist = DicesCollection.findOne({ did, userId: uId });

    if (isExist) return null;

    const diceId = DicesCollection.insert({ did, name, userId, actionIds, coverImg, createdAt: new Date() });
    const dice = DicesCollection.findOne({ _id: diceId });
    return dice;
  },
  updateDice: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a dice.');
      DicesCollection.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          createdAt: new Date().toISOString()
        }
      }
    );
    const dice = DicesCollection.findOne(args._id);
    return dice;
  },
  removeDice: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a dice.');
    if (!DicesCollection.findOne({ _id: args._id, userId: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this dice to remove it.');
    DicesCollection.remove(args);
    return args;
  }
};
