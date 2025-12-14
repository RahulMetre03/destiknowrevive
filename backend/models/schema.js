import gql from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type User {
    userId: ID!
    name: String
    username: String
    posts: [Post]
    followers: [User]
    following: [User]
  }

  type Place {
    placeId: ID!
    name: String
    city: String
    posts: [Post]
  }

  type Post {
    postId: ID!
    createdAt: String
    user: User
    place: Place
  }

  type Mutation {
    createPost(userId: ID!, placeId: ID!, postId: ID!): Post
  }

  type Query {
    dummy: String
  }
`;
