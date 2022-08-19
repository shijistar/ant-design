import React, { useMemo } from 'react';
import IconContext from '@ant-design/icons/es/components/Context';
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
      <IconContext.Provider value={memoIconContextValue}>{children}</IconContext.Provider>
    </AntConfigProvider>
  );
}

export default copyWithStatic(AntConfigProvider, GDCDConfigProvider);
