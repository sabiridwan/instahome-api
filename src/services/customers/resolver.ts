import { LongResolver } from "graphql-scalars";
import { Context } from "../../context";
import { CustomerService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<CustomerService>(TYPES.CustomerService);

const seedCustomer = async (_, {}, context: Context) => {
  return await _service.seed();
};

const findCustomer = async (_, customer, context: Context) => {
  return await _service.findOne(customer.customer);
};

const findCustomers = async (_, __, context: Context) => {
  return await _service.find({});
};

const resolvers = {
  Long: LongResolver,
  Query: {
    findCustomer,
    findCustomers
  },
  Mutation: {
    seedCustomer,
  },
};

export default resolvers;
