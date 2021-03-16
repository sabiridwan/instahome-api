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
    return await this._repository.find(query).then(async (res:any) => {

      console.log(res,query.customerId,"here...");
      return await Promise.all(
        res.map(async (rs) => {

          if(!customerId) return rs;

          return {
            ...rs._doc,
            rules: await this._priceRuleSvc.find({
              customerId: customerId,
              adType: rs.id,
            }),
          };
        })
      );
    });
  };

  findOne = async (query: Partial<Ad>): Promise<Ad> => {
    return await this._repository.findOne(query);
  };

  seed = async (): Promise<boolean> => {
    return await this._repository.seed();
  };
}
