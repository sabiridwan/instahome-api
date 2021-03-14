import { gql, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolver";

const typeDefs = gql`
  scalar Long

  type Customer {
    _id: ID!
    customerId: String!
    name: String!
    createdAt: Long!
    updatedAt: Long!
  }

  input CustomerQueryInput {
    customerId: String
  }

  # ---------query
  type Query {
    findOne(page: CustomerQueryInput): Customer!
  }
  # ---------------mutation
  type Mutation {
    seed: Boolean
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
});
