import { injectable } from "inversify";
import { CustomerRepository } from "../interface/CustomerRepository";
import Customer, { CustomerModel } from "../model";

@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  find = async (query: Partial<Customer>) => {
    return await CustomerModel.find(query);
  };
  findOne = async (query: Partial<Customer>) => {
    return await CustomerModel.findOne(query);
  };

  seed = async () => {
    await CustomerModel.create([
      {
        customerId: "default",
        name: "Default",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        customerId: "usmsunrise",
        name: "UEM Sunrise",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        customerId: "simedarby",
        name: "SIM Derby Property Sdn Bhd",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        customerId: "igbbehard",
        name: "IGB Behard",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        customerId: "singgroup",
        name: "Mah Sing Group",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
    ]);

    return true;
  };
}
