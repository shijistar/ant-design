import React, { useMemo } from 'react';
import { IconProvider } from '@ant-design/icons';
import type { ConfigProviderProps as AntConfigProviderProps } from './index';
import { copyWithStatic } from '../_util/gdcd';
import AntConfigProvider from './index';

export * from './index';

export type ConfigProviderProps = AntConfigProviderProps;

function GDCDConfigProvider(props: ConfigProviderProps) {
  const { children, iconPrefixCls, csp, ...antdProps } = props;

  const memoIconContextValue = useMemo(
    () => ({ prefixCls: iconPrefixCls, csp }),
    [iconPrefixCls, csp],
  );

  return (
    <AntConfigProvider iconPrefixCls={iconPrefixCls} csp={csp} {...antdProps}>
      <IconProvider value={memoIconContextValue}>{children}</IconProvider>
    </AntConfigProvider>
  );
}

export default copyWithStatic(GDCDConfigProvider, AntConfigProvider);
