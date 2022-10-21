import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_TRADE = gql`
  mutation addTrade($tradeText: String!) {
    addTrade(tradeText: $tradeText) {
      _id
      tradeText
      tradeAuthor
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;


//------------------------------------//
// export const REMOVE_TRADE = gql`
// mutation removeTrade($tradeId: ID!) {
//   removeTrade(tradeId: $tradeId) {
//     _id
//     tradeText
//       tradeAuthor
//       createdAt
//       comments {
//         _id
//         commentText
//     }
//   }
// }`;


export const ADD_COMMENT = gql`
  mutation addComment($tradeId: ID!, $commentText: String!) {
    addComment(tradeId: $tradeId, commentText: $commentText) {
      _id
      tradeText
      tradeAuthor
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;
