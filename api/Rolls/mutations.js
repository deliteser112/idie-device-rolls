import RollsCollection from './RollsCollection';
import DicesCollection from '../Dices/DicesCollection';
import ActionsCollection from '../Actions/ActionsCollection';

import { getCalcuation } from '../utils';

export default {
  addRoll: async (root, { device, dice }, context) => {
    const tmpIds = dice.split(',');

    const diceIds = [];

    tmpIds.map((tId) => {
      diceIds.push(tId.trim());
    });

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

    const rollId = RollsCollection.insert({ device, dice, results, createdAt: new Date() });
    const roll = RollsCollection.findOne({ _id: rollId });
    return roll;
  },
  removeRoll: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a roll.');
    RollsCollection.remove(args);
    return args;
  },
  removeMultipleRoll: async (root, { _id }, context) => {
    const _ids = _id.split(',');
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a roll.');
    RollsCollection.remove({ _id: { $in: _ids } });
    return { _id };
  }
};
