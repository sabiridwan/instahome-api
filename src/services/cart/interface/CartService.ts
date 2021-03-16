import Cart from "../model";

export interface CartService {
  find: (query: Partial<Cart>) => Promise<Array<Cart>>;
  findOne: (query: Partial<Cart>) => Promise<Cart>;
  createOrUpdateCart:(model:Cart) => Promise<Cart>;
}
