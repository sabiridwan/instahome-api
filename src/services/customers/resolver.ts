import { LongResolver } from "graphql-scalars";
import { Context } from "../../context";
import { CustomerService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<CustomerService>(TYPES.CustomerService);

const seedCustomer = async (_, {}, context: Context) => {
  return await _service.seed();
};

const findCustomer = async (_, model, context: Context) => {
  return await _service.findOne(model);
};

const resolvers = {
  Long: LongResolver,
  Query: {
    findCustomer,
  },
  Mutation: {
    seedCustomer,
  },
};

export default resolvers;
