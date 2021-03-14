import dotenv from "dotenv";

dotenv.config();

export interface Environment {
  isProduction: boolean;
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  pricing: {
    tax: number;
  };
  port: number | string;
  host: string;
  projectName: string;
  sslEnabled: boolean;
  isLocalFileStorage: boolean;
  useExpressSharp: boolean;
  resourceHost: string;
  mongoDb: {
    uri: string;
  };
  tempReportPath: string;
  reportDownloadUri: string;
  slot: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

export const environment: Environment = {
  // isProduction: process.env.NODE_ENV === 'production',
  isProduction: process.env.app_env === "production",
  apollo: {
    introspection: process.env.apollo_introspection === "true",
    playground: process.env.apollo_playground === "true",
  },
  pricing: {
    tax: +process.env.pricing_tax,
  },
  host: process.env.host,
  port: process.env.port,
  useExpressSharp: process.env.use_express_sharp == "true",
  projectName: process.env.project_name,
  sslEnabled: process.env.ssl_enabled == "true",
  isLocalFileStorage: process.env.is_local_file_storage == "true",
  resourceHost:
    //process.env.resource_host,
    process.env.is_local_file_storage == "true"
      ? process.env.file_storage_host
      : `${process.env.aws_storage_host}`,
  // `${process.env.aws_storage_host}${process.env.project_name}`
  mongoDb: {
    uri: process.env.mongo_db_uri,
  },
  tempReportPath: process.env.report_upload_location,
  reportDownloadUri: process.env.report_download_uri,
  slot: {
    breakfast: Number(process.env.slot_breakfast),
    lunch: Number(process.env.slot_lunch),
    dinner: Number(process.env.slot_dinner),
  },
};

export interface IErrorMessage {
  AuthenticationFail: string;
  ProductNotFound: string;
  InvalidStoreAccount: string;
  AuthorizationFail: string;
}

export const SharedErrorMessage: IErrorMessage = {
  AuthorizationFail: "authorization fail",
  AuthenticationFail: "authentication fail",
  ProductNotFound: "product not found",
  InvalidStoreAccount: "your logged in account is not a valid store account",
};
