import { mergeSchemas } from "apollo-server-express";
import newsSchema from "./services/customers/schema";
import pricingRuleSchema from "./services/price-rules/schema";
export default mergeSchemas({
  schemas: [newsSchema, pricingRuleSchema],
});
