import classNames from 'classnames';
import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { TableProps as AntTableProps } from './index';
import AntTable from './index';

export * from './index';

export type TableProps<RecordType> = AntTableProps<RecordType> & {
  /**
   * 是否纵向高度100%撑满整个父容器，同时在表格内部显示横向和纵向滚动条，默认为false
   *
   * @default false
   * @type {boolean}
   * @memberof Props
   */
  fullHeight?: boolean;
};

function GDCDTable<RecordType extends object = any>(
  props: TableProps<RecordType>,
  ref: React.MutableRefObject<HTMLDivElement>,
) {
  const { ...antdProps } = props;
  return (
    <AntTable
      {...antdProps}
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

export default copyWithStatic(ForwardTable, AntTable);
