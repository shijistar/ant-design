import classNames from 'classnames';
import type { MutableRefObject } from 'react';
import React, { forwardRef } from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { ColProps as AntColProps } from './col';
import Col from './col';

export * from './col';

export type ColProps = AntColProps;

const GDCDCol = (props: ColProps, ref: MutableRefObject<HTMLDivElement>) => {
  const { className, flex, ...colProps } = props;
  return (
    <Col
      className={classNames(className, flex === 'auto' ? 'flex-auto' : undefined)}
      flex={flex}
      {...colProps}
      ref={ref}
    />
  );
};

const ForwardCol = forwardRef(GDCDCol);

export default copyWithStatic(Col, ForwardCol);
