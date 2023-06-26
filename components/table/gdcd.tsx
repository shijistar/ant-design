import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ResizableProps } from 'react-resizable';
import classNames from 'classnames';
import endsWith from 'lodash/endsWith';
import throttle from 'lodash/throttle';
import { copyWithStatic } from '../_util/gdcd';
import { ColumnType, GetRowKey } from './interface';
import { ConfigContext } from '../config-provider';
import type { TableProps as AntTableProps } from './Table';
import AntTable from './Table';
import ResizableTitle from './resizable-title';

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
  const tableRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<ColumnType<RecordType>[]>([]);

  useEffect(() => {
    if (ref && tableRef.current) {
      ref.current = tableRef.current;
    }
  }, []);

  const columnsFromProps = props.columns;
  useEffect(() => {
    setColumns(columnsFromProps || []);
  }, [columnsFromProps]);

  const throttleSetColumns = useMemo(
    () =>
      throttle(
        (nextColumns: ColumnType<RecordType>[], scrollToEnd?: boolean) => {
          setColumns(nextColumns);
          if (scrollToEnd) {
            setTimeout(() => {
              const contentDom = tableRef.current?.querySelector('div[class$=table-content]');
              if (contentDom) {
                contentDom.scrollTo({
                  left: contentDom.scrollWidth - contentDom.clientWidth,
                  behavior: 'smooth',
                });
              }
            });
          }
        },
        50,
        { trailing: true },
      ),
    [],
  );

  const handleResize = useCallback(
    (index: number): ResizableProps['onResize'] =>
      (_, { size }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        // 拖动最后一列时，自动把表格滚动到最右边，这样可以持续调整最后一列的列宽，
        // 否则因为右边空间有限，鼠标无法向右移动太大距离
        throttleSetColumns(nextColumns, index === nextColumns.length - 1);
      },
    [columns],
  );

  const finalColumns = useMemo(() => {
    if (resizable) {
      return columns.map((col, index) => {
        if (col.fixed) return col;

        const onHeaderCell = col.onHeaderCell;
        return {
          ...col,
          onHeaderCell: column => ({
            ...onHeaderCell?.(column),
            width: col.width,
            column,
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

  // get scroll width
  const scrollWidth = useMemo(
    () =>
      columns.reduce((count, col) => {
        let currentWidth = 0;
        const dataType = typeof col.width;

        if (dataType === 'number') currentWidth = Number(col.width);
        else if (dataType === 'string' && endsWith(col.width?.toString(), 'px'))
          currentWidth = parseInt(col.width!.toString(), 10);
        else currentWidth = 0; // 其他不合法情况，如'auto','100%'等

        return count + currentWidth;
      }, 0),
    [columns],
  );

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
      columns={finalColumns}
      components={theComponents}
      pagination={newPagination}
      scroll={
        resizable
          ? {
              ...props.scroll,
              x: props.scroll?.x || scrollWidth + 10,
            }
          : props.scroll
      }
      ref={tableRef}
    />
  );
}

const ForwardTable = React.forwardRef(GDCDTable) as <RecordType extends object = any>(
  props: React.PropsWithChildren<TableProps<RecordType>> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default copyWithStatic(AntTable, ForwardTable);
