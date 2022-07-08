import sanitizeHtml from 'sanitize-html';
import ActionsCollection from './ActionsCollection';

export default {
  addAction: async (root, { name, action, equation }, context) => {

    const userId = context.user._id;
    if (!userId) {
      return null;
    }
    const isExist = ActionsCollection.findOne({ name });

    if (isExist) return null;

    const actionId = ActionsCollection.insert({ name, action, equation });
    const actionR = ActionsCollection.findOne({ _id: actionId });
    return actionR;
  },
  updateAction: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a action.');
    ActionsCollection.update(
      { _id: args._id },
      {
        $set: {
          ...args
        }
      }
    );
    const act = ActionsCollection.findOne(args._id);
    return act;
  },
  removeAction: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a document.');
    ActionsCollection.remove(args);
    return args;
  }
};
