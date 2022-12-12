import React, { FC } from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { PaginationLocale, PaginationProps as AntPaginationProps } from './Pagination';
import AntPagination from './Pagination';

export * from './Pagination';

const defaultLocale: PaginationLocale = {
  // jump_to: '前往',
};

export type PaginationProps = AntPaginationProps;

const GDCDPagination: FC<PaginationProps> = (props: PaginationProps) => {
  const {
    defaultPageSize = 20,
    size = 'default',
    simple = false,
    showSizeChanger = size !== 'small',
    showQuickJumper = size !== 'small',
    showTotal = size === 'small' ? undefined : (total: number) => `共 ${total} 条`,
    ...antdProps
  } = props;

  return (
    <AntPagination
      defaultPageSize={defaultPageSize}
      size={size}
      simple={simple}
      showSizeChanger={showSizeChanger}
      showQuickJumper={showQuickJumper}
      showTotal={showTotal}
      locale={defaultLocale}
      {...antdProps}
    />
  );
};

export default copyWithStatic(AntPagination, GDCDPagination);
