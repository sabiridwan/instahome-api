import { Context } from "../../context";
import { CartService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<CartService>(TYPES.CartService);

const createOrUpdateCart = async (_, cart, context: Context) => {
  const res = await _service.createOrUpdateCart({
    ...cart.cart,
    id: context.customerId,
  });

  return res;
};

const findCustomerCart = async (_, __, context: Context) => {
  return await _service.find({ id: context.customerId } as any);
};

const resolvers = {
  Query: {
    findCustomerCart,
  },
  Mutation: {
    createOrUpdateCart,
  },
};

export default resolvers;
