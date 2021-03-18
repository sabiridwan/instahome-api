import { inject, injectable } from "inversify";
import {
  PriceRuleService,
  priceRuleContainer,
  PRICERULE_TYPES,
} from "../../price-rules";
import { AdRepository, TYPES } from "../interface";
import { AdService } from "../interface/AdService";
import Ad from "../model";

@injectable()
export class AdServiceImpl implements AdService {
  private _repository: AdRepository;
  private _priceRuleSvc: PriceRuleService = priceRuleContainer.get<PriceRuleService>(
    PRICERULE_TYPES.PriceRuleService
  );

  constructor(@inject(TYPES.AdRepository) accountRepo: AdRepository) {
    this._repository = accountRepo;
  }

  find = async (query: Partial<Ad>): Promise<Array<Ad>> => {
    const customerId = query.customerId;
    delete query.customerId;
    return await this._repository.find(query).then(async (res: any) => {
      return await Promise.all(
        res.map(async (rs) => {
          if (!customerId) return rs;
          const ad = rs && rs._doc ? rs._doc : rs;
          return await this._mapPriceRule(customerId, ad);
        })
      );
    });
  };

  findOne = async (query: Partial<Ad>): Promise<Ad> => {
    const customerId = query.customerId;
    delete query.customerId;
    return await this._repository.findOne(query).then(async (rs: any) => {
      const ad = rs && rs._doc ? rs._doc : rs;
      return await this._mapPriceRule(customerId, ad);
    });
  };

  _mapPriceRule = async (customerId: string, ad: Ad) => {
    return {
      ...ad,
      rules: await this._priceRuleSvc.find({
        customerId: customerId,
        adType: ad.id,
      }),
    };
  };

  seed = async (): Promise<boolean> => {
    return await this._repository.seed();
  };
}
