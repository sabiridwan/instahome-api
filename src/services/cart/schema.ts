import { gql, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolver";

const typeDefs = gql`
  type Cart {
    id: String!
    items: CartItem!
    totalDiscountPrice: Float!
    totalOriginalPrice: Float!
  }

  type CartItem {
    _id: String!
    quantity: Int!
    adsType: String!
    originalPrice: Float!
    discountPrice: Float!
    totalPrice: Float!
    remark: String
  }

  input CartInput {
    items: [CartItemInput!]
  }

  input CartItemInput {
    adType: String!
    quantity: Int!
  }

  # ---------query
  type Query {
    findCustomerCart: Cart!
  }
  # ---------------mutation
  type Mutation {
    createOrUpdateCart(cart: CartInput!): Cart
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
});
