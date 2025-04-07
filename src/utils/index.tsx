import { getLocale } from "../config/locale";

import {
  camelCase,
  isArray,
  isDate,
  isObject,
  isRegExp,
  reduce,
  snakeCase,
} from "lodash";

export const convertToSnakeCase = (payload: any): any => {
  if (isArray(payload)) {
    return payload.map(convertToSnakeCase);
  } else if (isObject(payload) && !isDate(payload) && !isRegExp(payload)) {
    return reduce(
      payload,
      (result: any, value, key: string) => {
        result[snakeCase(key) as unknown as string] = convertToSnakeCase(value);
        return result;
      },
      {}
    );
  } else {
    return payload;
  }
};

export const convertToCamelCase = (payload: any): any => {
  if (isArray(payload)) {
    return payload.map(convertToCamelCase);
  } else if (isObject(payload) && !isDate(payload) && isRegExp(payload)) {
    return reduce(
      payload,
      (result: any, value, key: string) => {
        result[camelCase(key)] = convertToCamelCase(value);
        return result;
      },
      {}
    );
  } else {
    return payload;
  }
};
// function remove value null, undefined, '' and change from key to snake_key
export const cleanAndConvertToCamelCase = (payload: any): any => {
  if (isArray(payload)) {
    return payload.map(cleanAndConvertToCamelCase);
  } else if (isObject(payload) && !isDate(payload) && !isRegExp(payload)) {
    return reduce(
      payload,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result: any, value, key) => {
        const cleanedValue = cleanAndConvertToCamelCase(value);
        if (
          cleanedValue !== null &&
          cleanedValue !== undefined &&
          cleanedValue !== ""
        ) {
          result[camelCase(key)] = cleanedValue;
        }
        return result;
      },
      {}
    );
  } else {
    return payload;
  }
};

// get api with version and path name and locale
export const getApi = (
  pathVesion: string = "api/v1",
  pathName: string = ""
) => {
  const locale = getLocale();

  if (locale === "vn") {
    return `/${pathVesion}/${pathName}`;
  }
  return `/${pathVesion}/${locale}/${pathName}`;
};
