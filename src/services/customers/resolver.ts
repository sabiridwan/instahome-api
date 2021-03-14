import { LongResolver } from "graphql-scalars";
import { Context } from "../../context";
import { CustomerService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<CustomerService>(TYPES.CustomerService);

const seed = async (_, {}, context: Context) => {
  return await _service.seed();
};

const findOne = async (_, model, context: Context) => {
  return await _service.findOne(model);
};

const resolvers = {
  Long: LongResolver,
  Query: {
    findOne,
  },
  Mutation: {
    seed,
  },
};

export default resolvers;
