const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    trades: [Trade]!
  }

  type Trade {
    _id: ID
    tradeText: String
    tradeAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    trades(username: String): [Trade]
    trade(tradeId: ID!): Trade
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addTrade(tradeText: String!): Trade
    addComment(tradeId: ID!, commentText: String!): Trade
    removeTrade(tradeId: ID!): Trade
    removeComment(tradeId: ID!, commentId: ID!): Trade
  }
`;

module.exports = typeDefs;
