import type { Key } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ResizableProps } from 'react-resizable';
import classNames from 'classnames';
import { floor, isEqual } from 'lodash';
import endsWith from 'lodash/endsWith';
import throttle from 'lodash/throttle';
import { copyWithStatic } from '../_util/gdcd';
import { ConfigContext } from '../config-provider';
import type { ColumnType, GetRowKey } from './interface';
import ResizableTitle from './resizable-title';
import type { TableProps as AntTableProps } from './Table';
import AntTable from './Table';

export * from './Table';

const SCROLL_BAR_WIDTH = 15;
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
  const customPrefixCls = props.prefixCls;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const tableRef = useRef<HTMLDivElement>(null);
  const columnsFromProps = props.columns;
  const [columns, setColumns] = useState<ColumnType<RecordType>[] | undefined>(columnsFromProps);
  // 获取content容器的内宽度（不含纵向滚动条、不含table边框）
  const contentDom = tableRef.current?.querySelector(
    `.${getPrefixCls('table-content', customPrefixCls)}`,
  ) as HTMLDivElement;
  const innerTableDom = contentDom?.querySelector('table') as HTMLTableElement;
  const [contentWidth, setContentWidth] = useState<number>();
  const [hasVerticalScroll, setHasVerticalScroll] = useState(false);
  const [hasTableRows, setHasTableRows] = useState(false);

  useEffect(() => {
    if (ref && tableRef.current) {
      ref.current = tableRef.current;
    }
  }, [ref]);

  // #region throttleSetColumns
  const throttleSetColumns = useCallback(
    throttle(
      (nextColumns: ColumnType<RecordType>[], scrollToEnd?: boolean) => {
        setColumns(nextColumns);
        if (scrollToEnd) {
          setTimeout(() => {
            contentDom?.scrollTo({
              left: contentDom.scrollWidth - contentDom.offsetHeight,
              behavior: 'smooth',
            });
          });
        }
      },
      50,
      { trailing: true },
    ),
    [],
  );
  // #endregion

  // #region handleResize
  const columnsRef = useRef(columns);
  columnsRef.current = columns;
  // 不要对columns产生依赖，否则会导致无限循环
  const handleResize = useCallback(
    (index: number): ResizableProps['onResize'] =>
      (_, { size }) => {
        console.log(columnsRef.current?.[index], size);
        if (columnsRef.current) {
          const nextColumns = [...columnsRef.current];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          // 拖动最后一列时，自动把表格滚动到最右边，这样可以持续调整最后一列的列宽，
          // 否则因为右边空间有限，鼠标无法向右移动太大距离
          throttleSetColumns(nextColumns, index === nextColumns.length - 1);
        }
      },
    [throttleSetColumns],
  );
  // #endregion

  // #region 监听props.columns变化
  useEffect(() => {
    setColumns(old => {
      if (resizable) {
        return columnsFromProps?.map((col, index) => {
          // 记住上一次的列宽
          const result = { ...col };
          let oldCol = result.key ? old?.find(oc => isEqual(oc.key, result.key)) : undefined;
          if (!oldCol && 'dataIndex' in result) {
            oldCol = old?.find(oc => isEqual(oc.dataIndex, result.dataIndex));
          }
          if (oldCol) {
            result.width = oldCol.width;
          }
          if (result.fixed) {
            return result;
          }

          const onHeaderCell = result.onHeaderCell;
          result.onHeaderCell = column => ({
            ...onHeaderCell?.(column),
            width: result.width,
            column,
            onResize: handleResize(index),
            enabled: hasTableRows,
          });
          return result;
        });
      } else {
        return columnsFromProps;
      }
    });
  }, [columnsFromProps, resizable, hasTableRows, handleResize]);
  // #endregion

  // #region columnTotalWidth
  const columnTotalWidth = useMemo(() => {
    let total =
      columns?.reduce((count, col) => {
        let currentWidth = 0;

        if (typeof col.width === 'number') {
          currentWidth = floor(col.width);
        } else if (typeof col.width === 'string' && endsWith(col.width?.toString(), 'px'))
          currentWidth = floor(parseFloat(col.width));
        else currentWidth = 0; // 其他不合法情况，如'auto','100%'等

        return count + currentWidth;
      }, 0) || 0;

    // 如果有展开列，加上展开列的宽度
    const expandCol = tableRef.current?.querySelector(
      `.${getPrefixCls('table-expand-icon-col', customPrefixCls)}`,
    ) as HTMLTableColElement;
    if (expandCol) {
      total += expandCol.clientWidth;
    }
    // 如果有checkbox列，加上checkbox列的宽度
    const checkboxCol = tableRef.current?.querySelector(
      `.${getPrefixCls('table-selection-col', customPrefixCls)}`,
    ) as HTMLTableColElement;
    if (checkboxCol) {
      total += checkboxCol.clientWidth;
    }

    // 无敌hack来了!!!
    // 在table的demo中出现了一种情况，所有列宽度都是整数，但是content容器的宽度却是小数，比计算值小了0.5个像素，
    // 导致出现了横向滚动条！这里做一个修正，为了防止父容器是小数，索性统一减去1个像素
    return total ? total - 1 : total;
  }, [columns, getPrefixCls, customPrefixCls]);
  // #endregion

  // #region 监听表格宽度变化，并探测是否有滚动条
  useEffect(() => {
    const resizeObserver = new ResizeObserver(([contentSize /* tableSize */]) => {
      // contentWidth可能为小数，向下取整
      let parentWidth = Math.min(
        // 减去content的border
        floor(parseFloat(window.getComputedStyle(contentDom).width) - 2 || 0),
        // 监听到的内部宽度，两者取最小者
        floor(contentSize.contentBoxSize[0]?.inlineSize || Number.MAX_SAFE_INTEGER),
      )!;
      // 是否有滚动条
      if (contentDom.scrollHeight > contentDom.offsetHeight) {
        setHasVerticalScroll(true);
        parentWidth -= SCROLL_BAR_WIDTH;
      } else {
        setHasVerticalScroll(false);
      }
      setContentWidth(parentWidth);

      if (
        innerTableDom.querySelector(`& > tbody > tr.${getPrefixCls('table-row', customPrefixCls)}`)
      ) {
        setHasTableRows(true);
      }
    });

    if (innerTableDom) {
      resizeObserver.observe(contentDom!);
      resizeObserver.observe(innerTableDom);
    }
    return () => {
      if (innerTableDom) {
        resizeObserver.unobserve(contentDom!);
        resizeObserver.unobserve(innerTableDom);
      }
    };
  }, [contentDom, customPrefixCls, getPrefixCls, innerTableDom]);
  // #endregion

  // #region tableComponents
  const tableComponents = useMemo(() => {
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
  // #endregion

  // #region tablePagination
  const tablePagination = useMemo(() => {
    if (typeof pagination === 'object') {
      return {
        defaultPageSize: pagination.defaultPageSize || 20,
        ...pagination,
      };
    } else {
      return pagination;
    }
  }, [pagination]);
  // #endregion

  return (
    <AntTable
      {...antdProps}
      className={classNames(
        props.className,
        fullHeight && getPrefixCls('table-full-height', customPrefixCls),
        resizable && getPrefixCls('table-resizable', customPrefixCls),
      )}
      // 在resizable时强制设置为fixed布局，否则采用Table组件的默认逻辑（有fixed列或者开启ellipsis，则为fixed，否则为auto）
      tableLayout={resizable ? 'fixed' : undefined}
      columns={columns}
      components={tableComponents}
      pagination={tablePagination}
      scroll={
        resizable
          ? {
              ...props.scroll,
              x:
                props.scroll?.x ||
                // resize模式下必须始终设置scroll.x，否则在拖动过程中一旦超过临界值，出现scroll.x横向滚动条，会导致表头Cell组件卸载重新生成，
                // 便会中断拖动操作，操作不连贯。
                // 当scrollWidth超过content容器宽度时，使用scrollWidth，否则使用contentWidth，让table与content宽度一致，且刚好不出现滚动条
                (columnTotalWidth &&
                  contentWidth &&
                  (columnTotalWidth >= contentWidth + (hasVerticalScroll ? SCROLL_BAR_WIDTH : 0)
                    ? columnTotalWidth
                    : contentWidth)),
            }
          : props.scroll
      }
      ref={tableRef}
    />
  );
}

const ForwardTable = React.forwardRef(GDCDTable) as unknown as (<RecordType extends object = any>(
  props: React.PropsWithChildren<TableProps<RecordType>> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement) & {
  /** 获取行的key */
  getRowKey: <RecordType extends object = any>(
    record: RecordType,
    tableRowKey: TableProps<RecordType>['rowKey'],
  ) => Key;
};
ForwardTable.getRowKey = <RecordType extends object = any>(
  record: RecordType,
  tableRowKey: TableProps<RecordType>['rowKey'] = 'key',
) => {
  if (typeof tableRowKey === 'function') {
    return tableRowKey(record) as Key;
  }
  return (record as any)?.[tableRowKey as string] as Key;
};

export default copyWithStatic(AntTable, ForwardTable);
