import { getModelForClass, prop, mongoose } from "@typegoose/typegoose";

export default class Customer {
  _id?: mongoose.Types.ObjectId;
  @prop({ required: true })
  customerId: string;
  @prop({})
  name: string;
  @prop({})
  createdAt: number;
  @prop({})
  updatedAt: number;
}

export const CustomerModel = getModelForClass(Customer);

export class PagePrams {
  skip?: number;
  take?: number;
  keyword?: string;
  status?: string;
  storeId?: string;
}

export class PageResult<T> {
  totalRecords: number;
  result: Array<T>;
}

export const handlePageFacet = (page: PagePrams) => {
  return {
    $facet: {
      result: [{ $skip: Number(page.skip) }, { $limit: Number(page.take) }],
      totalRecords: [{ $count: "count" }],
    },
  };
};

export const handlePageResult = (res: any) => {
  let rs = res[0] as any;
  if (rs.totalRecords.length)
    rs = { ...rs, totalRecords: rs.totalRecords[0].count };
  else rs = { ...rs, totalRecords: 0 };

  return rs;
};
