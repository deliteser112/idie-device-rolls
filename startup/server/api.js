import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

// devices
import DeviceTypes from '../../api/Devices/types';
import DeviceQueries from '../../api/Devices/queries';
import DeviceMutations from '../../api/Devices/mutations';

// actions
import ActionTypes from '../../api/Actions/types';
import ActionQueries from '../../api/Actions/queries';
import ActionMutations from '../../api/Actions/mutations';

// dices
import DiceTypes from '../../api/Dices/types';
import DiceQueries from '../../api/Dices/queries';
import DiceMutations from '../../api/Dices/mutations';

// rolls
import RollTypes from '../../api/Rolls/types';
import RollQueries from '../../api/Rolls/queries';
import RollMutations from '../../api/Rolls/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Documents/server/indexes';
import '../../api/webhooks';

import '../../api/App/server/publications';

const schema = {
  typeDefs: gql`
    ${DocumentTypes}
    ${CommentTypes}

    # user
    ${DeviceTypes}
    ${DiceTypes}

    # admin
    ${ActionTypes}
    ${RollTypes}
    ${UserTypes}
    ${UserSettingsTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document

      # device
      devices: [Device]
      deviceUsers: [DeviceUser]
      device(_id: String): Device

      # action
      actions: [Action]
      action(_id: String): Action

      # dice
      dices: [Dice]
      dice(_id: String): Dice

      # roll
      rolls: [Roll]
      rollsByMAC(device: String!): [Roll]

      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      
      # device
      addDevice(mac: String, name: String, ownerId: String, followerIds: [String]): Device
      updateDevice(_id: String!, mac: String, name: String, ownerId: String, followerIds: [String]): Device
      removeDevice(_id: String!): Device
      
      # action
      addAction(name: String!, action: String!, equation: String!): Action
      updateAction(_id: ID!, name: String!, action: String!, equation: String!): Action
      removeAction(_id: String!): Action

      # dice
      addDice(did: String!, name: String!, userId: String!, actionIds: [String]!, coverImg: String): Dice
      updateDice(_id: ID!, did: String!, name: String!, userId: String!, actionIds: [String]!, coverImg: String): Dice
      removeDice(_id: String!): Dice

      # roll
      addRoll(device: String!, dice: String!): Roll
      removeRoll(_id: String!): Roll
      removeMultipleRoll(_id: String!): Roll
      
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
      sendWelcomeEmail: User
    }

    type Subscription {
      commentAdded(documentId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,

      // user
      ...DeviceQueries,
      ...DiceQueries,

      // admin
      ...ActionQueries,
      ...RollQueries,
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,

      // user
      ...DeviceMutations,
      ...DiceMutations,

      // admin
      ...ActionMutations,
      ...RollMutations,
      ...UserMutations,
      ...UserSettingsMutations,
    },
    Document: {
      comments: CommentQueries.comments,
    },
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default makeExecutableSchema(schema);
