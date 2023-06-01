import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ResizableProps } from 'react-resizable';
import classNames from 'classnames';
import endsWith from 'lodash/endsWith';
import findLastIndex from 'lodash/findLastIndex';
import { copyWithStatic } from '../_util/gdcd';
import { ColumnType, GetRowKey } from './interface';
import { ConfigContext } from '../config-provider';
import type { TableProps as AntTableProps } from './Table';
import AntTable from './Table';
import ResizableTitle from './resizable-title';

export * from './Table';
const DEFAULT_COLUMN_WIDTH = 120;

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

  /**
   * 支持拖拽调整列宽度
   *
   * @default false
   */
  resizable?: boolean;
};

function GDCDTable<RecordType extends object = any>(
  props: TableProps<RecordType>,
  ref: React.MutableRefObject<HTMLDivElement>,
) {
  const { fullHeight, resizable, components, pagination, ...antdProps } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const [columns, setColumns] = useState<ColumnType<RecordType>[]>([]);

  useEffect(() => {
    setColumns(cols => getColumns(props.columns || [], cols));
  }, [props.columns]);

  const handleResize = useCallback(
    (index: number): ResizableProps['onResize'] =>
      (_, { size }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        setColumns(nextColumns);
      },
    [columns],
  );

  // get scroll width
  const width = useMemo(
    () =>
      columns.reduce((count, col) => {
        let currentWidth = 0;
        const dataType = typeof col.width;

        if (dataType === 'number') currentWidth = Number(col.width);
        else if (dataType === 'string' && endsWith(col.width?.toString(), 'px'))
          currentWidth = parseInt(col.width!.toString(), 10);
        else currentWidth = DEFAULT_COLUMN_WIDTH; // 其他不合法情况，如'auto','100%'等

        return count + currentWidth;
      }, 0),
    [columns],
  );

  const theColumns = useMemo(() => {
    if (resizable) {
      const lastUnFixedColIdx = findLastIndex(columns, item => !item.fixed);
      return columns.map((col, index) => {
        if (col.fixed) return col;

        // 最后一个非固定列不设宽度，防止不能对齐
        const isLastUnFixedColumn = index === lastUnFixedColIdx;
        const colWidth = isLastUnFixedColumn ? undefined : col.width;
        const onHeaderCell = col.onHeaderCell;
        return {
          ...col,
          width: colWidth,
          onHeaderCell: column => ({
            ...onHeaderCell?.(column),
            width: colWidth,
            onResize: handleResize(index),
          }),
        } as ColumnType<RecordType>;
      });
    } else {
      return columns;
    }
  }, [columns, resizable, handleResize]);

  const theComponents = useMemo(() => {
    if (resizable) {
      return {
        ...components,
        header: {
          cell: ResizableTitle,
        },
      };
    } else {
      return components;
    }
  }, [resizable, components]);

  let newPagination = useMemo(() => {
    if (typeof pagination === 'object') {
      return {
        defaultPageSize: pagination.defaultPageSize || 20,
        ...pagination,
      };
    } else {
      return pagination;
    }
  }, [pagination]);
  return (
    <AntTable
      {...antdProps}
      className={classNames(
        props.className,
        fullHeight && getPrefixCls('table-full-height'),
        resizable && getPrefixCls('table-resizable'),
      )}
      columns={theColumns}
      components={theComponents}
      pagination={newPagination}
      scroll={{
        ...props.scroll,
        x: props.scroll?.x || width,
      }}
      ref={ref}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getColumns<RecordType>(cols: ColumnType<RecordType>[], oldCols: ColumnType<RecordType>[]) {
  let columns: ColumnType<RecordType>[] = [];
  if (cols.length) {
    columns = cols.map(col => {
      // 为保持列宽的稳定性，让columns变化时继承上一次的宽度
      const ori = oldCols.find(item => item.dataIndex === col.dataIndex);
      const width = ori ? ori.width : col.width || DEFAULT_COLUMN_WIDTH;
      return { ellipsis: true, ...col, width };
    });
  }
  return columns;
}

const ForwardTable = React.forwardRef(GDCDTable) as <RecordType extends object = any>(
  props: React.PropsWithChildren<TableProps<RecordType>> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default copyWithStatic(AntTable, ForwardTable);
