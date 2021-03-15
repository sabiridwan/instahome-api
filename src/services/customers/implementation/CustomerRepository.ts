import { injectable } from "inversify";
import { CustomerRepository } from "../interface/CustomerRepository";
import Customer, { CustomerModel } from "../model";

@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  findOne = async (query: Partial<Customer>) => {

    console.log(query);
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
        name: "IGB Behard",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
    ]);

    return true;
  };
}
