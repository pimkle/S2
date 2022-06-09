import { isUpDataValue } from '@antv/s2';
import type { S2DataConfig, S2Options, S2Theme } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import { isNil } from 'lodash';
import {
  data,
  totalData,
  meta,
  fields,
} from '../__tests__/data/mock-dataset.json';

export function generateRawData(row, col) {
  const res = [];
  const rowKeys = Object.keys(row);
  const colKeys = Object.keys(col);

  for (let i = 0; i < row[rowKeys[0]]; i++) {
    for (let j = 0; j < row[rowKeys[1]]; j++) {
      for (let m = 0; m < col[colKeys[0]]; m++) {
        for (let n = 0; n < col[colKeys[1]]; n++) {
          res.push({
            province: `p${i}`,
            city: `c${j}`,
            type: `type${m}`,
            sub_type: `subType${n}`,
            number0: i * n,
            number1: i * n,
            number2: i * n,
            number3: i * n,
            number4: i * n,
            number5: i * n,
            number6: i * n,
            number7: i * n,
            number8: i * n,
            number9: i * n,
          });
        }
      }
    }
  }

  return res;
}

const BASIC_BACKGROUND_COLOR = '#FFFFFF';
const INTERACTIVE_BACKGROUND_COLOR = '#E1EAFE';

export const strategyTheme: S2Theme = {
  cornerCell: {
    icon: {
      size: 12,
    },
  },
  rowCell: {
    cell: {
      backgroundColor: BASIC_BACKGROUND_COLOR,
      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
    },
    icon: {
      size: 12,
    },
  },
  colCell: {
    cell: {
      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
      padding: {
        left: 4,
        right: 4,
      },
    },
  },
  dataCell: {
    cell: {
      crossBackgroundColor: BASIC_BACKGROUND_COLOR,
      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        hoverFocus: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        unselected: {},
        prepareSelect: {
          borderColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
    },
  },
};

export const tableSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data: generateRawData(
    { province: 10, city: 100 },
    { type: 10, sub_type: 10 },
  ),
  totalData: [],
  meta,
  fields: {
    ...fields,
    values: [
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9',
    ],
  },
};

export const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  hierarchyCollapse: false,
  interaction: {
    enableCopy: true,
  },
  // totals: {
  //   col: {
  //     showGrandTotals: true,
  //     showSubTotals: true,
  //     reverseLayout: true,
  //     reverseSubLayout: false,
  //   },
  // },
};

export const sliderOptions: SliderSingleProps = {
  min: 0,
  max: 10,
  step: 0.1,
  marks: {
    0.2: '0.2',
    1: '1 (默认)',
    2: '2',
    10: '10',
  },
};

export const strategyOptions: S2Options = {
  width: 800,
  height: 400,
  cornerText: '指标',
  placeholder: (v) => {
    const placeholder = v?.fieldValue ? '-' : '';
    return placeholder;
  },
  headerActionIcons: [
    {
      iconNames: ['Trend'],
      belongsCell: 'rowCell',
      defaultHide: true,
      action: () => {},
    },
  ],
  style: {
    cellCfg: {
      valuesCfg: {
        originalValueField: 'originalValues',
        conditions: {
          text: {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta } = cellInfo;
              const isNormalValue = isNil(value);

              if (meta.fieldValue.values[0][0] === value || isNormalValue) {
                return {
                  fill: '#000',
                };
              }
              return {
                fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
              };
            },
          },
        },
      },
    },
  },
};

export const mockGridAnalysisOptions: S2Options = {
  width: 1600,
  height: 600,
  style: {
    layoutWidthType: 'colAdaptive',
    cellCfg: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 20, 20, 20],
        conditions: {
          text: {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { colIndex } = cellInfo;
              if (colIndex <= 1) {
                return {
                  fill: '#000',
                };
              }
              return {
                fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
              };
            },
          },
        },
      },
    },
  },
};

export const defaultOptions: S2Options =
  getBaseSheetComponentOptions(s2Options);
