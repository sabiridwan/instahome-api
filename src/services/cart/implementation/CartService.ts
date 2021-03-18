import { inject, injectable } from "inversify";
import helper from "../../../helper";
import { adContainer, AdService, AD_TYPES } from "../../ads";
import {
  priceRuleContainer,
  PriceRuleService,
  PRICERULE_TYPES,
} from "../../price-rules";
import { PriceRuleTypes } from "../../price-rules/model";
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

  adToCart = async (model: CartItem): Promise<Cart> => {
    const cart = await this.findOne({ id: model.customerId });
    let items = [];
    if (cart) {
      items = [...cart.items];
      const indx = items.findIndex((itm) => itm.adType == model.adType);
      if (indx >= 0) items[indx].quantity += model.quantity;
      else items.push(await this._adSummary(model.customerId, model));
    } else {
      items = [await this._adSummary(model.customerId, model)];
    }

    if (!cart)
      await this._repository.create({ items, id: model.customerId } as any);
    else
      await this._repository.update(model.customerId, {
        items: items.map((itm) => {
          delete itm.ad;
          delete itm._id;
          return itm;
        }),
      } as any);

    return await this.findOne({ id: model.customerId });
  };

  updateCart = async (model: Cart): Promise<Cart> => {
    await this._repository.update(model.id, model);
    return await this.findOne({ id: model.id });
  };

  find = async (query: Partial<Cart>): Promise<Array<Cart>> => {
    return await this._repository.find(query).then(async (res) => {
      return await Promise.all(
        res.map(async (rs: any) => {
          const cart = rs && rs._doc ? rs._doc : rs;
          if (!cart) return null;
          return {
            ...cart,
            items: (await this._mapItems(cart, query)) as any,
          };
        })
      );
    });
  };

  findOne = async (query: Partial<Cart>): Promise<Cart> => {
    return await this._repository.findOne(query).then(async (rs: any) => {
      const cart = rs && rs._doc ? rs._doc : rs;
      if (!cart) return null;
      const itms = await this._mapItems(cart, query);
      return {
        ...cart,
        items: itms,
        totalOriginalPrice: helper.raoundToTwo(
          itms && itms.length > 0
            ? itms
                .map((itm: CartItem) => itm.originalPrice)
                .reduce((a, b) => a + b) || 0
            : 0
        ),
        totalDiscountPrice: helper.raoundToTwo(
          itms && itms.length > 0
            ? itms
                .map((itm: CartItem) => itm.discountPrice)
                .reduce((a, b) => a + b) || 0
            : 0
        ),
      };
    });
  };

  _mapItems = async (rs, query) => {
    return await Promise.all(
      rs.items.map(async (itm: any) => {
        return await this._adSummary(query.id, {
          ...itm._doc,
          ad: await this._adService.findOne({
            id: itm.adType,
            customerId: query.id,
          }),
        });
      })
    );
  };

  _adSummary = async (
    customerId: string,
    item: CartItem
  ): Promise<CartItem> => {
    const ad = await this._adService.findOne({ id: item.adType });

    if (!ad) throw new Error("Ad not found");

    const rule = await this._priceRuleSvc.findOne({
      adType: item.adType,
      customerId,
    });

    item.originalPrice = item.quantity * ad.price;
    if (rule && rule.type) {
      console.log(rule, "RULE TYPE..");
      switch (rule.type) {
        case PriceRuleTypes.Quantity:
          const free = item.quantity / rule.buyQuantity;
          item.discountPrice = (item.quantity - free) * ad.price;
          item.originalPrice = item.discountPrice;
          break;

        case PriceRuleTypes.Percentage:
          if (item.quantity >= rule.buyQuantity) {
            const price = item.quantity * ad.price;
            const pct = price * (rule.percentage / 100);
            item.discountPrice = price - pct;
            item.originalPrice = item.discountPrice;
          }

          break;

        default:
          break;
      }
    }

    return item;
  };
}
