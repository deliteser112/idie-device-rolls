import DevicesCollection from './DevicesCollection';

export default {
  addDevice: async (root, { mac, name, ownerId, followerIds }, context) => {
    const userId = context.user._id;
    if (!userId) {
      return null;
    }
    const isExist = DevicesCollection.findOne({ mac });

    if (isExist) return null;

    const deviceId = DevicesCollection.insert({ mac, name, ownerId, followerIds, userId, createdAt: new Date() });
    const device = DevicesCollection.findOne({ _id: deviceId });
    return device;
  },
  updateDevice: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a device.');
    // if (!DevicesCollection.findOne({ _id: args._id, owner: context.user._id }))
      // throw new Error('Sorry, you need to be the owner of this device to update it.');
    DevicesCollection.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const doc = DevicesCollection.findOne(args._id);
    return doc;
  },
  removeDevice: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a device.');
    if (!DevicesCollection.findOne({ _id: args._id, ownerId: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this device to remove it.');
    DevicesCollection.remove(args);
    return args;
  }
};
