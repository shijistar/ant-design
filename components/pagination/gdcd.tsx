import React, { FC } from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { PaginationLocale, PaginationProps as AntPaginationProps } from './Pagination';
import AntPagination from './Pagination';

export * from './Pagination';

const defaultLocale: PaginationLocale = {
  jump_to: '前往',
};

export type PaginationProps = Omit<AntPaginationProps, 'showTotal'> & {
  showTotal?: AntPaginationProps['showTotal'] | false;
};

const GDCDPagination: FC<PaginationProps> = (props: PaginationProps) => {
  const {
    defaultPageSize = 20,
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = (total: number) => `共 ${total} 项数据`,
    ...antdProps
  } = props;

  return (
    <AntPagination
      locale={defaultLocale}
      defaultPageSize={defaultPageSize}
      showSizeChanger={showSizeChanger}
      showQuickJumper={showQuickJumper}
      showTotal={showTotal || undefined}
      {...antdProps}
    />
  );
};

export default copyWithStatic(AntPagination, GDCDPagination);
