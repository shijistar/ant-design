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
import { floor, isEqual } from 'lodash';

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
  const scrollWidth = useMemo(() => {
    const total = columns?.reduce((count, col) => {
      let currentWidth = 0;

      if (typeof col.width === 'number') {
        currentWidth = floor(col.width);
      } else if (typeof col.width === 'string' && endsWith(col.width?.toString(), 'px'))
        currentWidth = floor(parseFloat(col.width));
      else currentWidth = 0; // 其他不合法情况，如'auto','100%'等

      return count + currentWidth;
    }, 0);
    // 无敌hack，在table的demo中出现了一种情况，所有列宽度都是整数，但是content容器的宽度却是小数，比计算值小了0.5个像素，
    // 导致出现了横向滚动条！这里做一个修正，为了防止父容器是小数，索性统一减去1个像素
    return total ? total - 1 : total;
  }, [columns]);

  // 获取content容器的内宽度（不含纵向滚动条、不含table边框）
  const contentDom = tableRef.current?.querySelector(
    `.${getPrefixCls('table-content', props.prefixCls)}`,
  ) as HTMLDivElement;
  let contentWidth: number | undefined;
  if (contentDom) {
    // contentWidth = floor(contentDom.offsetWidth); // 不要使用offsetWidth，因为offsetWidth会四舍五入
    contentWidth = floor(parseFloat(window.getComputedStyle(contentDom).width)); // contentWidth可能为小数，向下取整
    contentWidth -= 2; // 减去content的border
    if (contentDom.scrollHeight > contentDom.offsetHeight) {
      contentWidth -= 15; // 15为滚动条宽度
    }
  }

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
                // resize模式下必须始终设置scroll.x，否则在拖动过程中一旦超过临界值，出现scroll.x横向滚动条，会导致表头Cell组件卸载重新生成，
                // 便会中断拖动操作，操作不连贯。
                // 当scrollWidth超过content容器宽度时，使用scrollWidth，否则使用contentWidth，让table与content宽度一致，且刚好不出现滚动条
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
