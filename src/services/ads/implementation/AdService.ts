import { inject, injectable } from "inversify";
import { AdRepository, TYPES } from "../interface";
import { AdService } from "../interface/AdService";
import Ad from "../model";

@injectable()
export class AdServiceImpl implements AdService {
  private _repository: AdRepository;

  constructor(@inject(TYPES.AdRepository) accountRepo: AdRepository) {
    this._repository = accountRepo;
  }

  find = async (query: Partial<Ad>): Promise<Array<Ad>> => {
    return await this._repository.find(query);
  };

  findOne = async (query: Partial<Ad>): Promise<Ad> => {
    return await this._repository.findOne(query);
  };

  seed = async (): Promise<boolean> => {
    return await this._repository.seed();
  };
}
