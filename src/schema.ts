import { mergeSchemas } from "apollo-server-express";
import newsSchema from "./services/customers/schema";
import pricingRuleSchema from "./services/price-rules/schema";
import adSchema from "./services/ads/schema";
import cartSchema from "./services/cart/schema";
export default mergeSchemas({
  schemas: [newsSchema, adSchema, cartSchema, pricingRuleSchema],
});
