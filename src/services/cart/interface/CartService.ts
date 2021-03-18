import Cart, { CartItem } from "../model";

export interface CartService {
  find: (query: Partial<Cart>) => Promise<Array<Cart>>;
  findOne: (query: Partial<Cart>) => Promise<Cart>;
  adToCart:(model:CartItem) => Promise<Cart>;
  updateCart:(model:Cart) => Promise<Cart>;
}
