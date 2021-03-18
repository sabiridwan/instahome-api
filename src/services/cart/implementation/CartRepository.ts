import { injectable } from "inversify";
import { CartRepository } from "../interface/CartRepository";
import Cart, { CartModel } from "../model";

@injectable()
export class CartRepositoryImpl implements CartRepository {
  create = async (model: Cart): Promise<Cart> => {
    return await CartModel.create({
      ...model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };
  update = async (id: string, model: Cart): Promise<boolean> => {
    delete model.id;
    await CartModel.updateOne(
      { id },
      { ...model, createdAt: Date.now(), updatedAt: Date.now() }
    );

    return true;
  };
  find = async (query: Partial<Cart>): Promise<Cart[]> => {
    return await CartModel.find(query).exec();
  };

  findOne = async (query: Partial<Cart>) => {
    return await CartModel.findOne(query).exec();
  };
}
