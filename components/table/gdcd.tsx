import classNames from 'classnames';
import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import { GetRowKey } from './interface';
import type { TableProps as AntTableProps } from './Table';
import AntTable from './Table';

export * from './Table';

export type TableProps<RecordType> = Omit<AntTableProps<RecordType>, 'rowKey'> & {
  /** RowKey必填，防止界面不更新的问题 */
  rowKey: string | GetRowKey<RecordType>;
  /**
   * 是否纵向高度100%撑满整个父容器，同时在表格内部显示横向和纵向滚动条，默认为false
   *
   * @memberof Props
   * @default false
   * @type {boolean}
   */
  fullHeight?: boolean;
};

function GDCDTable<RecordType extends object = any>(
  props: TableProps<RecordType>,
  ref: React.MutableRefObject<HTMLDivElement>,
) {
  const { pagination, ...antdProps } = props;

  let newPagination = pagination;
  if (typeof pagination === 'object') {
    newPagination = {
      ...pagination,
      defaultPageSize: pagination.defaultPageSize || 20,
    };
  }
  return (
    <AntTable
      {...antdProps}
      pagination={newPagination}
      className={classNames(props.className, {
        'full-height-table': !!props.fullHeight,
      })}
      ref={ref}
    />
  );
}

const ForwardTable = React.forwardRef(GDCDTable) as <RecordType extends object = any>(
  props: React.PropsWithChildren<TableProps<RecordType>> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default copyWithStatic(AntTable, ForwardTable);
