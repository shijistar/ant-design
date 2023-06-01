import React from 'react';
import type { ResizableProps } from 'react-resizable';
import { Resizable } from 'react-resizable';

const ResizableTitle = (props: ResizableProps) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      resizeHandles={['e']}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
