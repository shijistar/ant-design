import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import type { ResizableProps } from 'react-resizable';
import { Resizable } from 'react-resizable';
import { ColumnType } from '../interface';

const ResizableTitle = (
  props: Omit<ResizableProps, 'width'> & {
    width?: CSSProperties['width'];
    column?: ColumnType<any>;
  },
) => {
  const { onResize, width, column, ...restProps } = props;
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [cellWidth, setCellWidth] = useState<number | undefined>();

  useEffect(() => {
    if (width && (typeof width === 'number' || width.match(/^\d+px$/))) {
      setCellWidth(parseInt(width as string));
    } else {
      setCellWidth(cellRef.current?.offsetWidth);
      onResize?.(null!, {
        size: {
          width: cellRef.current?.offsetWidth || 0,
          height: cellRef.current?.offsetHeight || 0,
        },
        node: cellRef.current!,
        handle: 'e',
      });
    }
  }, [width]);

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
