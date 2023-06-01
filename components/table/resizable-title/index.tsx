import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import type { ResizableProps } from 'react-resizable';
import { Resizable } from 'react-resizable';
import { ColumnType } from '../interface';

export type ResizableTitleProps = Omit<ResizableProps, 'width'> & {
  width?: CSSProperties['width'];
  column?: ColumnType<any>;
  enabled?: boolean;
};
const ResizableTitle: FC<ResizableTitleProps> = props => {
  const { onResize, width, column, enabled, ...restProps } = props;
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [cellWidth, setCellWidth] = useState<number | undefined>();
  const emittedRef = useRef(false);

  useEffect(() => {
    // 固定宽度
    if (width && (typeof width === 'number' || width.match(/^\d+px$/))) {
      setCellWidth(parseInt(width as string, 10));
    } else {
      // 自适应宽度
      if (enabled && !emittedRef.current) {
        setCellWidth(cellRef.current?.offsetWidth);
        onResize?.(null!, {
          size: {
            width: cellRef.current?.offsetWidth || 0,
            height: cellRef.current?.offsetHeight || 0,
          },
          node: cellRef.current!,
          handle: 'e',
        });
        emittedRef.current = true;
      }
    }
  }, [width, enabled]);

  // 如果是一些table内置列，例如选择、展开等，不支持拖拽
  if (!column) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={cellWidth || 0}
      height={0}
      onResize={(e, data) => {
        e.preventDefault();
        e.stopPropagation();
        onResize?.(e, data);
        setCellWidth(data.size.width);
      }}
      resizeHandles={['e']}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th ref={cellRef} {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
