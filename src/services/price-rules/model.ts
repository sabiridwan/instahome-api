import { getModelForClass, prop, mongoose } from "@typegoose/typegoose";

export enum PriceRuleTypes {
  Quantity = "quantity",
  Percentage = "percentage",
}

export default class PriceRule {
  _id?: mongoose.Types.ObjectId;
  @prop({ required: true })
  adsType: string;
  @prop({ required: true })
  customerId: string;
  @prop({})
  name: string;
  @prop({})
  buyQuantity: number;
  @prop({})
  getQuantity: number;
  @prop({})
  percentage: number;
  @prop({ type: () => String, required: true, enum: PriceRuleTypes })
  type: PriceRuleTypes;
  @prop({ required: true })
  createdAt: number;
  @prop({})
  updatedAt: number;
}

export const PriceRuleModel = getModelForClass(PriceRule);
