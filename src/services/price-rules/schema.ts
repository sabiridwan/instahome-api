import { gql, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolver";

const typeDefs = gql`
  scalar Long

  type PriceRule {
    _id: ID!
    adType: String!
    customerId: String!
    description: String!
    buyQuantity: Int!
    getQuantity: Int!
    percentage: Float!
    type: String!
  }

  input PriceRuleQueryInput {
    priceRuleId: String
  }

  # ---------query
  type Query {
    findPriceRules(priceRule: PriceRuleQueryInput): [PriceRule!]
  }
  # ---------------mutation
  type Mutation {
    seedPriceRule: Boolean
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
});
