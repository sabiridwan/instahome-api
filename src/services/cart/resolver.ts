import { Context } from "../../context";
import { CartService, TYPES } from "./interface";
import container from "./inversify.config";

const _service = container.get<CartService>(TYPES.CartService);

const addToCart = async (_, item, context: Context) => {
  return await _service.adToCart({
    ...item.item,
    customerId: context.customerId,
  });
};

const updateCart = async (_, cart, context: Context) => {
  return  await _service.updateCart({
    ...cart.cart,
    id: context.customerId,
  });
};

const findCustomerCart = async (_, __, context: Context) => {
  return await _service.findOne({ id: context.customerId } as any);
};

const resolvers = {
  Query: {
    findCustomerCart,
  },
  Mutation: {
    addToCart,
    updateCart,
  },
};

export default resolvers;
