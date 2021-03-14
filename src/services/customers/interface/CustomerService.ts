import Customer from "../model";

export interface CustomerService {
  findOne: (query: Partial<Customer>) => Promise<Customer>;
  seed: () => Promise<boolean>;
}
