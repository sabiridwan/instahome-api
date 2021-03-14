import { mergeSchemas } from "apollo-server-express";
import newsSchema from "./services/customers/schema";
export default mergeSchemas({
  schemas: [
    newsSchema,
  ],
});
