import { inject, injectable } from "inversify";
import { adContainer, AdService, AD_TYPES } from "../../ads";
import {
  priceRuleContainer,
  PriceRuleService,
  PRICERULE_TYPES,
} from "../../price-rules";
import { CartRepository, TYPES } from "../interface";
import { CartService } from "../interface/CartService";
import Cart, { CartItem } from "../model";

@injectable()
export class CartServiceImpl implements CartService {
  private _repository: CartRepository;
  private _adService: AdService = adContainer.get<AdService>(
    AD_TYPES.AdService
  );
  private _priceRuleSvc: PriceRuleService = priceRuleContainer.get<PriceRuleService>(
    PRICERULE_TYPES.PriceRuleService
  );

  constructor(@inject(TYPES.CartRepository) accountRepo: CartRepository) {
    this._repository = accountRepo;
  }
  createOrUpdateCart = async (model: Cart): Promise<Cart> => {
    const cart = await this.findOne({ id: model.id });

    if (cart == null) return await this.create(model);

    return await this.update(model);
  };

  create = async (model: Cart): Promise<Cart> => {
    let items: Array<CartItem> = [];
    for await (const item of model.items) {
      items.push(await this._adSummary(model.id, item));
    }

    // return { ...model, items, id: model.id };
    return await this._repository.create(model);
  };

  update = async (model: Cart): Promise<Cart> => {
    await this._repository.update(model);
    return this.findOne({ id: model.id });
  };

  find = async (query: Partial<Cart>): Promise<Array<Cart>> => {
    return await this._repository.find(query).then(async (res) => {
      return await Promise.all(
        res.map(async (rs) => {
          return {
            ...rs,
            items: await this._mapItems(rs, query) as any
          };
        })
      );
    });
  };

  findOne = async (query: Partial<Cart>): Promise<Cart> => {
    return await this._repository.findOne(query).then(async (rs: any) => {
      return {
        ...rs._doc,
        items: await this._mapItems(rs, query),
      };
    });
  };

  _mapItems = async (rs, query) => {
    return await Promise.all(
      rs._doc.items.map(async (itm: any) => {
        return {
          ...itm._doc,
          ad: await this._adService.findOne({
            id: itm._doc.adType,
            customerId: query.id,
          }),
        };
      })
    );
  };

  _adSummary = async (
    customerId: string,
    item: CartItem
  ): Promise<CartItem> => {
    const ad = await this._adService.findOne({ id: item.adType });

    // const priceRules = await this._priceRuleSvc.find({
    //   adType: item.adType,
    //   customerId,
    // });

    // console.log(priceRules);

    if (!ad) throw new Error("Ad not found");

    item.originalPrice = item.quantity * ad.price;

    return item;
  };
}
