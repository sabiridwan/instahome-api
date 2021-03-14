import Customer from '../model';

export interface CustomerRepository {
  findOne: (query: Partial<Customer>) => Promise<Customer>;
  seed: () => Promise<boolean>;
}
