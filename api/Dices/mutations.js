import RollsCollection from './Rolls';
import DicesCollection from '../Dices/Dices';

export default {
  addRoll: async (root, { device, dice }, context) => {
    const diceIds = dice.split(',');
    const dices = DicesCollection.find({
      did: { $in: diceIds }
    }).fetch();

    const actions = ActionsCollection.find({}).fetch();

    const results = [];
    dices.map((item) => {
      const { actionIds, coverImg, name } = item;
      const actionNames = [];
      actionIds.map((aId) => {
        actions.map((item) => {
          const { _id, name } = item;
          if (aId === _id) actionNames.push(name);
        });
      });
      let equation = '';
      actionNames.map((action) => {
        equation += action;
      });

      const { eqs, sum } = getCalcuation(actionNames);

      results.push({
        coverImg,
        name,
        result: sum,
        calculation: eqs,
        equation
      });
    });

    return await RollsCollection.save({ device, dice, results });
  },
  removeDocument: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a document.');
    if (!Documents.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this document to remove it.');
    Documents.remove(args);
    return args;
  }
};
