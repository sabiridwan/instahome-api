import PriceRule from "../model";

export interface PriceRuleService {
  find: (query: Partial<PriceRule>) => Promise<Array<PriceRule>>;
  findOne: (query: Partial<PriceRule>) => Promise<PriceRule>;
  seed: () => Promise<boolean>;
}
