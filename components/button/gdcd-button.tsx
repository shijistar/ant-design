import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { ButtonProps as AntButtonProps } from './button';
import AntButton from './button';

export * from './button';

export type ButtonProps = AntButtonProps & {
  /** Type=link|text 时，会去掉padding，此属性可以强制添加padding */
  padding?: true;
};

function GDCDButton(props: ButtonProps, ref: React.MutableRefObject<HTMLDivElement>) {
  const { padding, ...antdProps } = props;

  return (
    <AntButton
      {...antdProps}
      style={{
        ...antdProps.style,
        padding:
          antdProps.style?.padding ||
          (['link', 'text'].includes(antdProps.type!) && !padding ? 0 : undefined),
      }}
      ref={ref}
    />
  );
}

const GDCDForwardButton = React.forwardRef(GDCDButton) as (
  props: React.PropsWithChildren<ButtonProps> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default copyWithStatic(AntButton, GDCDForwardButton);
