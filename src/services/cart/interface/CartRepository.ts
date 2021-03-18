import Cart from "../model";

export interface CartRepository {
  create: (model: Cart) => Promise<Cart>;
  update: (id: string, model: Cart) => Promise<boolean>;
  find: (query: Partial<Cart>) => Promise<Array<Cart>>;
  findOne: (query: Partial<Cart>) => Promise<Cart>;
}
