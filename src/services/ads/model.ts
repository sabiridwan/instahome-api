import { getModelForClass, prop } from "@typegoose/typegoose";

export default class Ad {
  @prop({ unique: true, required: true })
  id?: string;
  @prop({})
  name: string;
  @prop({})
  price: number;
  @prop({ required: true })
  createdAt: number;
  @prop({})
  updatedAt: number;

  customerId:string;
}

export const AdModel = getModelForClass(Ad);
