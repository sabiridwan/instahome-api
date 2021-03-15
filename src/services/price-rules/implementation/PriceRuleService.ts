import { inject, injectable } from "inversify";
import { PriceRuleRepository, TYPES } from "../interface";
import { PriceRuleService } from "../interface/PriceRuleService";
import PriceRule from "../model";

@injectable()
export class PriceRuleServiceImpl implements PriceRuleService {
  private _repository: PriceRuleRepository;

  constructor(@inject(TYPES.PriceRuleRepository) accountRepo: PriceRuleRepository) {
    this._repository = accountRepo;
  }

  find = async (query: Partial<PriceRule>): Promise<Array<PriceRule>> => {
    return await this._repository.find(query);
  };

  findOne = async (query: Partial<PriceRule>): Promise<PriceRule> => {
    return await this._repository.findOne(query);
  };

  seed = async (): Promise<boolean> => {
    return await this._repository.seed();
  };
}
