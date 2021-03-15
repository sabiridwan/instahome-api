import { LongResolver } from "graphql-scalars";
import { Context } from "../../context";
import { PriceRuleService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<PriceRuleService>(TYPES.PriceRuleService);

const seedPriceRule = async (_, {}, context: Context) => {
  return await _service.seed();
};

const findPriceRules = async (_, priceRule, context: Context) => {
  return await _service.find(priceRule.priceRule);
};

const resolvers = {
  Long: LongResolver,
  Query: {
    findPriceRules,
  },
  Mutation: {
    seedPriceRule,
  },
};

export default resolvers;
