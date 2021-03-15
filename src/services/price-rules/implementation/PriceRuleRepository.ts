import { injectable } from "inversify";
import { PriceRuleRepository } from "../interface/PriceRuleRepository";
import PriceRule, { PriceRuleModel, PriceRuleTypes } from "../model";

@injectable()
export class PriceRuleRepositoryImpl implements PriceRuleRepository {
  find = async (query: Partial<PriceRule>): Promise<PriceRule[]> => {
    return await PriceRuleModel.find(query);
  };
  
  findOne = async (query: Partial<PriceRule>) => {
    console.log(query);
    return await PriceRuleModel.findOne(query);
  };

  seed = async () => {
    await PriceRuleModel.create([
      {
        name: "3 for 2 deal on Standard ads",
        buyQuantity: 2,
        getQuantity: 3,
        adsType: "standard",
        customerId: "usmsunrise",
        percentage: 0,
        type: PriceRuleTypes.Quantity,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        name: "4% Discount on feature ads",
        buyQuantity: 0,
        getQuantity: 0,
        adsType: "featured",
        customerId: "simedarby",
        percentage: 4.02489,
        type: PriceRuleTypes.Percentage,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      {
        name: "Buy 4 or more and get 24% Discount on feature ads",
        buyQuantity: 4,
        getQuantity: 0,
        adsType: "featured",
        customerId: "igbbehard",
        percentage: 24.0512,
        type: PriceRuleTypes.Percentage,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },

      {
        name: "5 for 4 deal on Standard ads",
        buyQuantity: 4,
        getQuantity: 5,
        adsType: "standard",
        customerId: "singgroup",
        percentage: 0,
        type: PriceRuleTypes.Quantity,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },

      {
        name: "4% Discount on feature ads",
        buyQuantity: 0,
        getQuantity: 0,
        adsType: "featured",
        customerId: "singgroup",
        percentage: 4.02489,
        type: PriceRuleTypes.Percentage,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },

      {
        name: "Buy 3 or more premium ads and get 3.7% discount ",
        buyQuantity: 3,
        getQuantity: 0,
        adsType: "premium",
        customerId: "singgroup",
        percentage: 24.0512,
        type: PriceRuleTypes.Percentage,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
    ] as Array<PriceRule>);

    return true;
  };
}
