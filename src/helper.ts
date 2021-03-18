import winston from "winston";

const raoundToTwo = (val: number) => {
  return Math.round(val * 100 + Number.EPSILON) / 100;
};

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      // level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
      level: process.env.app_env === "production" ? "error" : "debug",
    }),
    new winston.transports.File({
      // filename: `___logs_${process.env.NODE_ENV}.log`,
      filename: `___logs_${process.env.app_env}.log`,
      level: "debug",
    }),
  ],
});

const helper = { raoundToTwo };

export default helper;
