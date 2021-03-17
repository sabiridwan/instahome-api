import { getModelForClass, mongoose, prop } from "@typegoose/typegoose";

export class CartItem {
  _id?: mongoose.Types.ObjectId;
  @prop({})
  quantity: number;
  @prop({ required: true })
  adType: string;
  @prop({})
  originalPrice: number;
  @prop({})
  discountPrice: number;
  @prop({})
  totalPrice: number;
  @prop({})
  remark: String;
}

export default class Cart {
  @prop({ unique: true, required: true })
  id?: string;
  @prop({ type: () => [CartItem], required: true })
  items: Array<CartItem>;
  @prop({ required: true })
  createdAt: number;
  @prop({})
  updatedAt: number;

  totalDiscountPrice: number;
  totalOriginalPrice: number;
  customerId: string;
}

export const CartModel = getModelForClass(Cart);
