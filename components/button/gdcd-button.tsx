import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { ButtonProps as AntButtonProps } from './button';
import AntButton from './button';

export * from './button';

export type ButtonProps = AntButtonProps;

function GDCDButton(props: ButtonProps, ref: React.MutableRefObject<HTMLDivElement>) {
  const { ...antdProps } = props;
  return <AntButton {...antdProps} ref={ref} />;
}

const GDCDForwardButton = React.forwardRef(GDCDButton) as (
  props: React.PropsWithChildren<ButtonProps> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default copyWithStatic(AntButton, GDCDForwardButton);
