import { injectable } from "inversify";
import { CartRepository } from "../interface/CartRepository";
import Cart, { CartModel } from "../model";

@injectable()
export class CartRepositoryImpl implements CartRepository {
  create = async (model: Cart): Promise<Cart> => {
    return await CartModel.create(model);
  };
  update = async (model: Cart): Promise<boolean> => {
    await CartModel.updateOne({id:model.id}, model);

     return true;
  };
  find = async (query: Partial<Cart>): Promise<Cart[]> => {
    return await CartModel.find(query);
  };

  findOne = async (query: Partial<Cart>) => {
    return await CartModel.findOne(query);
  };
}
