import classNames from 'classnames';
import type { MutableRefObject } from 'react';
import React, { forwardRef } from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { RowProps as AntRowProps } from './row';
import Row from './row';

export * from './row';

export type RowProps = AntRowProps & {
  /**
   * 宽度100%
   *
   * @default false
   */
  fullWidth?: boolean;
};

const GDCDRow = (props: RowProps, ref: MutableRefObject<HTMLDivElement>) => {
  const { className, fullWidth, ...rowProps } = props;
  return (
    <Row {...rowProps} className={classNames(className, fullWidth && 'full-width')} ref={ref} />
  );
};

const ForwardRow = forwardRef(GDCDRow);

export default copyWithStatic(Row, ForwardRow);
