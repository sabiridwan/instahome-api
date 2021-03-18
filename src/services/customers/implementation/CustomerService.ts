import { inject, injectable } from "inversify";
import { CustomerRepository, TYPES } from "../interface";
import { CustomerService } from "../interface/CustomerService";
import Customer from "../model";

@injectable()
export class CustomerServiceImpl implements CustomerService {
  private _repository: CustomerRepository;

  constructor(@inject(TYPES.CustomerRepository) accountRepo: CustomerRepository) {
    this._repository = accountRepo;
  }

  find = async (query: Partial<Customer>): Promise<Customer[]> => {
    return await this._repository.find(query);
  };

  findOne = async (query: Partial<Customer>): Promise<Customer> => {
    return await this._repository.findOne(query);
  };

  seed = async (): Promise<boolean> => {
    return await this._repository.seed();
  };
}
