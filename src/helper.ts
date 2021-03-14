import winston from "winston";
var randomize = require("randomatic");
import _ from "lodash";
import fileUpload from "./libs/uploaders";
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

const isValidLatLang = (lat: number, lng: number): Boolean => {
  if (!lat && !lng) return false;

  if (lat < -90 || lat > 90) {
    return false;
  } else if (lng < -180 || lng > 180) {
    return false;
  }
  return true;
};

const geoNear = (lat: number, lng: number) => {
  return {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [lng, lat],
      },
      key: "location",
      distanceMultiplier: 0.001,
      distanceField: "distance",
      // maxDistance: 10000
      spherical: true,
    },
  };
};

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

const saveFile = async (file, oldFileName) => {
  if (!file) throw new Error("File not found in upload");

  const { createReadStream, filename, mimetype, encoding } = file;

  const dir = mimetype.split("/")[0] + "s";
  if (oldFileName) {
    await fileUpload.upload.deleteFile(
      oldFileName,
      `${process.env.upload_dir}`
    );
  }

  const path = await fileUpload.upload.upload(createReadStream(), {
    filename,
    mimetype,
    dir,
    isPublic: true,
  });

  return environment.isLocalFileStorage ? `${dir}/${path}` : path;
};

const isValidURL = (input: string) => {
  const pattern =
    "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z\\d]([a-zA-Z\\d-]{0,61}[a-zA-Z\\d])*\\.)+" + // sub-domain + domain name
    "[a-zA-Z]{2,13})" + // extension
    "|((\\d{1,3}\\.){3}\\d{1,3})" + // OR ip (v4) address
    "|localhost)" + // OR localhost
    "(\\:\\d{1,5})?" + // port
    "(\\/[a-zA-Z\\&\\d%_.~+-:@]*)*" + // path
    "(\\?[a-zA-Z\\&\\d%_.,~+-:@=;&]*)?" + // query string
    "(\\#[-a-zA-Z&\\d_]*)?$"; // fragment locator
  const regex = new RegExp(pattern);
  return regex.test(input);
};

export {
  saveFile,
  isValidURL,
  random6digits,
  removeSpecialChar,
  logger,
  interpolate,
  isValidLatLang,
  geoNear,
  uniqueid,
  disticArrayObj,
  groupArrayObj,
};
