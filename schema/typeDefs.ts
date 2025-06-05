import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum WorksiteStatus {
    PENDING
    IN_PROGRESS
    ENDED
    ARCHIVED
  }

  enum CartStatus {
    PENDING
    EXPORTED
    ARCHIVED
  }

  type Worksite {
    _id: ID!
    name: String!
    startDate: String
    endDate: String
    adress: String
    worksiteStatus: WorksiteStatus
  }

  type CartItem {
    articleID: String
    quantity: Int
    isEmpty: Boolean
  }

  type Cart {
    _id: ID!
    cartStatus: CartStatus
    date: String
    items: [CartItem]
    worksite: Worksite
    operator: String
  }

  input UpdateWorksiteInput {
    _id: ID!
    name: String
    startDate: String
    endDate: String
    adress: String
    worksiteStatus: WorksiteStatus
  }

  input CreateWorksiteInput {
    name: String!
    startDate: String
    endDate: String
    adress: String
    worksiteStatus: WorksiteStatus
  }

  input CreateCartInput {
    items: [CartItemInput!]!
    cartStatus: CartStatus
    date: String!
    operator: String
    worksiteId: String!
  }

  input CartItemInput {
    articleID: String
    quantity: Int
    isEmpty: Boolean
  }

  input UpdateCartInput {
    _id: ID!
    items: [CartItemInput]
    cartStatus: CartStatus
    operator: String
  }

  type Query {
    worksites(worksiteStatuses: [WorksiteStatus!]!): [Worksite]
    Carts(cartStatuses: [CartStatus!]!): [Cart]
  }

  type Mutation {
    addWorksite(worksiteData: CreateWorksiteInput!): Worksite
    updateWorksite(worksiteData: UpdateWorksiteInput!): Worksite
    deleteWorksite(worksiteID: String!): Worksite

    addCart(newCart: CreateCartInput!): Cart
    updateCart(cartData: UpdateCartInput!): Cart
    deleteCart(CartID: String!): Cart
  }
`;
