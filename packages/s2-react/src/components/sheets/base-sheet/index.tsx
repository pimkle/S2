import {
  getSafetyDataConfig,
  type S2Options,
  S2_PREFIX_CLS,
  SpreadSheet,
} from '@antv/s2';
import { Spin } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState, type MutableRefObject, type PropsWithChildren } from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import SpreadSheetContext from '../../../utils/SpreadSheetContext';
import { getSheetComponentOptions } from '../../../utils';
import { Header } from '../../header';
import { S2Pagination } from '../../pagination';
import type { SheetComponentsProps } from '../../sheets/interface';

import './index.less';

export const BaseSheet = React.forwardRef<SpreadSheet, PropsWithChildren<SheetComponentsProps>>(
  (props, ref) => {
    const { dataCfg, options, header, showPagination } = props;
    const { s2Ref, loading, containerRef, pagination, wrapperRef } =
      useSpreadSheet(props);
    const [contextVal, setContextVal] = useState<SpreadSheet>(s2Ref.current);

  
    // 同步实例
    useEffect(() => {
      if (ref) {
        (ref as MutableRefObject<SpreadSheet>).current = s2Ref.current;
      }
    }, [ref, s2Ref]);
    useEffect(() => setContextVal(s2Ref.current), [s2Ref.current]);

    return (
      <React.StrictMode>
        <SpreadSheetContext.Provider value={contextVal}>
          <Spin spinning={loading} wrapperClassName={`${S2_PREFIX_CLS}-spin`}>
            <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
              {header && (
                <Header
                  {...header}
                  sheet={s2Ref.current}
                  width={options.width}
                  dataCfg={getSafetyDataConfig(dataCfg)}
                  options={getSheetComponentOptions(options)}
                />
              )}
              <div
                ref={containerRef}
                className={`${S2_PREFIX_CLS}-container`}
              />
              {showPagination && (
                <S2Pagination
                  {...pagination}
                  pagination={options.pagination}
                  onChange={get(showPagination, 'onChange')}
                  onShowSizeChange={get(showPagination, 'onShowSizeChange')}
                />
              )}
              {props.children}
            </div>
          </Spin>
        </SpreadSheetContext.Provider>
      </React.StrictMode>
    );
  },
);

BaseSheet.displayName = 'BaseSheet';
BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: false,
};
