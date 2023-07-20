import classNames from 'classnames';
import type { CSSProperties, MutableRefObject } from 'react';
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
  /**
   * 高度100%
   *
   * @default false
   */
  fullHeight?: boolean;
  /**
   * Flex-direction
   *
   * @default 'row'
   */
  direction?: CSSProperties['flexDirection'];
};

const GDCDRow = (props: RowProps, ref: MutableRefObject<HTMLDivElement>) => {
  const { className, fullWidth, fullHeight, direction, wrap, ...rowProps } = props;
  return (
    <Row
      // 纵向布局时，wrap默认为false
      wrap={wrap || direction?.includes('column') ? false : undefined}
      {...rowProps}
      className={classNames(
        className,
        fullWidth && 'full-width',
        fullHeight && 'full-height',
        direction && `direction-${direction}`,
      )}
      ref={ref}
    />
  );
};

const ForwardRow = forwardRef(GDCDRow);

export default copyWithStatic(Row, ForwardRow);
