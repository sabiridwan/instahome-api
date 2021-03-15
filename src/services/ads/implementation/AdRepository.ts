import { injectable } from "inversify";
import { AdRepository } from "../interface/AdRepository";
import Ad, { AdModel } from "../model";

@injectable()
export class AdRepositoryImpl implements AdRepository {
  find = async (query: Partial<Ad>): Promise<Ad[]> => {
    return await AdModel.find(query);
  };
  
  findOne = async (query: Partial<Ad>) => {
    return await AdModel.findOne(query);
  };

  seed = async () => {
    await AdModel.create([
      {
        id:"standard",
        name: "Standard Ad",
        price: 269.99,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id:"featured",
        name: "Featured Ad",
        price: 322.99,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id:"premium",
        name: "Premium Ad",
        price: 394.99,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
    ] as Array<Ad>);

    return true;
  };
}
