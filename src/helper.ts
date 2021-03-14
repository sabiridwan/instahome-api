import winston from "winston";
var randomize = require("randomatic");
import _ from "lodash";

import { environment } from "./environment";

const random6digits = () => {
  return randomize("0", 6);
};

const logger = winston.createLogger({
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

const uniqueid = () => require("uniqid").process();

const interpolate = (val: string, argumentArray: Array<string>) => {
  var regex = /%s/;
  var _r = (p: any, c: any) => {
    return p.replace(regex, c);
  };
  return argumentArray.reduce(_r, val);
};

const removeSpecialChar = (val) => {
  return `.*${val.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}.*`;
};

const disticArrayObj = (key: string, array: Array<any>) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    const props = item[key] ? item[key].toString() : "";
    if (!map.has(props)) {
      map.set(props, true); // set any value to Map
      result.push(item);
    }
  }
  return result;
};

const groupArrayObj = (key: string, array: Array<any>) => {
  return _(array)
    .groupBy(key)
    .map((items, ky) => {
      return { key: ky, items };
    })
    .value();
};

export {
  random6digits,
  removeSpecialChar,
  logger,
  interpolate,
  uniqueid,
  disticArrayObj,
  groupArrayObj,
};
