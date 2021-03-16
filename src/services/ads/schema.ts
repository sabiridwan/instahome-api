import { gql, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolver";

const typeDefs = gql`
  type Ad {
    id: String!
    name: String!
    price: Float!
    rules:[AdPriceRule]
  }

  type AdPriceRule{
    description: String!
    type: String!
  }

  input AdQueryInput {
    adId: String
  }

  # ---------query
  type Query {
    findAds(ad: AdQueryInput): [Ad!]
  }
  # ---------------mutation
  type Mutation {
    seedAd: Boolean
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
});
