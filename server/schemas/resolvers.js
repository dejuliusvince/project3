const { AuthenticationError } = require('apollo-server-express');
const { User, Trade } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('trades');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('trades');
    },
    trades: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Trade.find(params).sort({ createdAt: -1 });
    },
    trade: async (parent, { tradeId }) => {
      return Trade.findOne({ _id: tradeId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('trades');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addTrade: async (parent, { tradeText }, context) => {
      if (context.user) {
        const trade = await Trade.create({
          tradeText,
          tradeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { trades: trade._id } }
        );

        return trade;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (parent, { tradeId, commentText }, context) => {
      if (context.user) {
        return Trade.findOneAndUpdate(
          { _id: tradeId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeTrade: async (parent, { tradeId }, context) => {
      if (context.user) {
        const trade = await Trade.findOneAndDelete({
          _id: tradeId,
          tradeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { trades: trade._id } }
        );

        return trade;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeComment: async (parent, { tradeId, commentId }, context) => {
      if (context.user) {
        return Trade.findOneAndUpdate(
          { _id: tradeId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
