import type { Data } from '../../common/interface/s2DataConfig';
import {
  EXTRA_FIELD,
  ORIGIN_DATA_FIELD,
  VALUE_FIELD,
} from '../../common/constant/basic';

export const createWrappedDataItem = (data: Data, extraField: string) => {
  return new Proxy(
    {
      [ORIGIN_DATA_FIELD]: data,
      [EXTRA_FIELD]: extraField,
      [VALUE_FIELD]: data[extraField],
    },
    {
      get(target, key: string) {
        if (key !== EXTRA_FIELD && key !== VALUE_FIELD) {
          return target[ORIGIN_DATA_FIELD][key];
        }
        return target[key];
      },
    },
  );
};
