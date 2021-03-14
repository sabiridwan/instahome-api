import { injectable } from "inversify";
import { CustomerRepository } from "../interface/CustomerRepository";
import Customer, { CustomerModel } from "../model";

@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  findOne = async (query: Partial<Customer>) => {
    return await CustomerModel.findOne(query);
  };

  seed = async () => {
    await CustomerModel.create([
      {
        customerId: "default",
      },
      {
        customerId: "usmsunrise",
      },
      {
        customerId: "simedarby",
      },
      {
        customerId: "igbbehard",
      },
    ]);

    return true;
  };
}
