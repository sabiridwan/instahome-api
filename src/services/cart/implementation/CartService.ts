import { inject, injectable } from "inversify";
import { adContainer, AdService, AD_TYPES } from "../../ads";
import { CartRepository, TYPES } from "../interface";
import { CartService } from "../interface/CartService";
import Cart from "../model";

@injectable()
export class CartServiceImpl implements CartService {
  private _repository: CartRepository;
  private _adService: AdService= adContainer.get<AdService>(AD_TYPES.AdService);

  constructor(@inject(TYPES.CartRepository) accountRepo: CartRepository,
  // @inject(AD_TYPES.AdService) adSvc: AdService
  ) {
    this._repository = accountRepo;
    // this._adService = adSvc;
  }
  createOrUpdateCart = async (model: Cart): Promise<Cart> => {
    const cart = await this.findOne({ id: model.id });

    if (cart == null) return await this.create(model);

    return await this.update(model);
  };

  create = async (model: Cart): Promise<Cart> => {


    console.log(model.items);


    for (const item of model.items) {
      const ad = await this._adService.findOne({ id: item.adType});

      console.log(ad,"ads...")
    }

   

    return await this._repository.create(model);
  };

  update = async (model: Cart): Promise<Cart> => {
    await this._repository.update(model);
    return this.findOne({ id: model.id});
  };

  find = async (query: Partial<Cart>): Promise<Array<Cart>> => {
    return await this._repository.find(query);
  };

  findOne = async (query: Partial<Cart>): Promise<Cart> => {
    return await this._repository.findOne(query);
  };
}
