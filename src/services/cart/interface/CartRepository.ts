import Cart from "../model";

export interface CartRepository {
  create: (model: Cart) => Promise<Cart>;
  update: (model: Cart) => Promise<boolean>;
  find: (query: Partial<Cart>) => Promise<Array<Cart>>;
  findOne: (query: Partial<Cart>) => Promise<Cart>;
}
