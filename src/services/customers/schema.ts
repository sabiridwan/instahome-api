import { gql, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolver";

const typeDefs = gql`
  scalar Long

  type Customer {
    _id: ID!
    id: String!
    customerId: String!
    name: String!
    createdAt: Long
    updatedAt: Long
  }

  input CustomerQueryInput {
    customerId: String
  }

  # ---------query
  type Query {
    findCustomers: [Customer]
    findCustomer(customer: CustomerQueryInput): Customer!
  }
  # ---------------mutation
  type Mutation {
    seedCustomer: Boolean
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
});
