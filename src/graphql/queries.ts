import { gql } from "@apollo/client";

export const GET_USER_INFO = gql`
  query user {
    user(id: 2) {
      id
      email
      firstName
      lastName
    }
  }
`;
