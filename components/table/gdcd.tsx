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
import { isEqual } from 'lodash';

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
  const columnsFromProps = props.columns;
  const [columns, setColumns] = useState<ColumnType<RecordType>[] | undefined>(columnsFromProps);

  useEffect(() => {
    if (ref && tableRef.current) {
      ref.current = tableRef.current;
    }
  }, [ref]);

  useEffect(() => {
    setColumns(old => {
      if (resizable) {
        // 记住上一次的列宽
        return columnsFromProps?.map(col => {
          let oldCol = col.key ? old?.find(oc => isEqual(oc.key, col.key)) : undefined;
          if (!oldCol && 'dataIndex' in col) {
            oldCol = old?.find(oc => isEqual(oc.dataIndex, col.dataIndex));
          }
          if (oldCol) {
            return {
              ...col,
              width: oldCol.width,
            };
          }
          return col;
        });
      } else {
        return columnsFromProps;
      }
    });
  }, [columnsFromProps, resizable]);

  const throttleSetColumns = useCallback(
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
        if (columns) {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          // 拖动最后一列时，自动把表格滚动到最右边，这样可以持续调整最后一列的列宽，
          // 否则因为右边空间有限，鼠标无法向右移动太大距离
          throttleSetColumns(nextColumns, index === nextColumns.length - 1);
        }
      },
    [columns, throttleSetColumns],
  );

  const finalColumns = useMemo(() => {
    if (resizable) {
      return columns?.map((col, index) => {
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
      columns?.reduce((count, col) => {
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

  const newPagination = useMemo(() => {
    if (typeof pagination === 'object') {
      return {
        defaultPageSize: pagination.defaultPageSize || 20,
        ...pagination,
      };
    } else {
      return pagination;
    }
  }, [pagination]);

  // 计算content的宽度，默认设置给scroll.x，当resize列宽超过content宽度时，会自动出现横向滚动条。
  // 注意，resize模式下必须开始就设置scroll.x，如果在拖动过程中再设置，在超过横向滚动条临界情况时，会导致表头Cell组件重新挂载，会中断拖动操作。
  const contentDom = tableRef.current?.querySelector(
    `.${getPrefixCls('table-content', props.prefixCls)}`,
  );
  let contentWidth: number | undefined;
  if (contentDom) {
    contentWidth = contentDom.clientWidth;
    if (contentDom.scrollHeight > contentDom.clientHeight) {
      contentWidth -= 17; // 15为滚动条宽度，2为滚动条边框宽度
    }
  }

  return (
    <AntTable
      {...antdProps}
      className={classNames(
        props.className,
        fullHeight && getPrefixCls('table-full-height', props.prefixCls),
        resizable && getPrefixCls('table-resizable', props.prefixCls),
      )}
      columns={finalColumns}
      components={theComponents}
      pagination={newPagination}
      scroll={
        resizable
          ? {
              ...props.scroll,
              x:
                props.scroll?.x ||
                // 2px是border的宽度
                (scrollWidth &&
                  contentWidth &&
                  (scrollWidth >= contentWidth ? scrollWidth : contentWidth)),
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
