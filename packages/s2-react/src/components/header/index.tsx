import React from 'react';
import { PageHeader, type PageHeaderProps } from 'antd';
import cx from 'classnames';
import type { S2DataConfig, S2Options, SpreadSheet } from '@antv/s2';
import { Export, type ExportCfgProps } from '../export';
import { AdvancedSort, type AdvancedSortCfgProps } from '../advanced-sort';
import { type SwitcherCfgProps, SwitcherHeader } from '../switcher/header';
import './index.less';

export interface HeaderCfgProps extends PageHeaderProps {
  width?: React.CSSProperties['width'];
  description?: React.ReactNode;
  exportCfg?: ExportCfgProps;
  advancedSortCfg?: AdvancedSortCfgProps;
  switcherCfg?: SwitcherCfgProps;
}

export interface HeaderProps extends HeaderCfgProps {
  dataCfg?: S2DataConfig;
  options?: S2Options;
  sheet: SpreadSheet;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    className,
    title,
    width,
    description,
    exportCfg,
    advancedSortCfg,
    switcherCfg,
    sheet,
    extra,
    dataCfg,
    options,
    ...restProps
  }) => {
    const PRE_CLASS = 's2-header';

    const getExtraComponents = () => {
      return (
        <>
          {extra}
          {switcherCfg.open && (
            <SwitcherHeader
              sheet={sheet}
              dataCfg={dataCfg}
              options={options}
              {...switcherCfg}
            />
          )}
          {advancedSortCfg.open && (
            <AdvancedSort sheet={sheet} {...advancedSortCfg} />
          )}
          {exportCfg.open && (
            <Export key={'export'} sheet={sheet} {...exportCfg} />
          )}
        </>
      );
    };

    return (
      <PageHeader
        className={cx(PRE_CLASS, className)}
        style={{ width }}
        ghost={false}
        title={title}
        extra={getExtraComponents()}
        {...restProps}
      >
        {description}
      </PageHeader>
    );
  },
);

Header.displayName = 'Header';
Header.defaultProps = {
  exportCfg: { open: false },
  advancedSortCfg: { open: false },
  switcherCfg: { open: false },
};
