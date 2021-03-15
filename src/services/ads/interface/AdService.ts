import Ad from "../model";

export interface AdService {
  find: (query: Partial<Ad>) => Promise<Array<Ad>>;
  findOne: (query: Partial<Ad>) => Promise<Ad>;
  seed: () => Promise<boolean>;
}
