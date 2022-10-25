import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      trades {
        _id
        tradeText
        createdAt
      }
    }
  }
`;

export const QUERY_TRADES = gql`
  query getTrades {
    trades {
      _id
      tradeText
      tradeAuthor
      createdAt
    }
  }
`;

export const QUERY_SINGLE_TRADE = gql`
  query getSingleTrade($tradeId: ID!) {
    trade(tradeId: $tradeId) {
      _id
      tradeText
      tradeAuthor
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      trades {
        _id
        tradeText
        tradeAuthor
        createdAt
      }
    }
  }
`;
