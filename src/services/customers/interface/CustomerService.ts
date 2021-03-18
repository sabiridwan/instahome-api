import Customer from "../model";

export interface CustomerService {
  findOne: (query: Partial<Customer>) => Promise<Customer>;
  find: (query: Partial<Customer>) => Promise<Array<Customer>>;
  seed: () => Promise<boolean>;
}
