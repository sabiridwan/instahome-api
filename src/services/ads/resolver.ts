import { Context } from "../../context";
import { AdService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<AdService>(TYPES.AdService);

const seedAd = async (_, {}, context: Context) => {
  return await _service.seed();
};

const findAds = async (_, ad, context: Context) => {
  return await _service.find({ ...ad.ad, customerId: context.customerId });
};

const resolvers = {
  Query: {
    findAds,
  },
  Mutation: {
    seedAd,
  },
};

export default resolvers;
