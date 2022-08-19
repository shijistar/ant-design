import type { ComponentType, ForwardRefExoticComponent } from 'react';

const ignoreKeys = ['$$typeof', 'render', 'contextType', 'contextTypes'];
const mergeKeys = ['defaultProps', 'propTypes'];
const unoverridableKeys = ['displayName', 'getDerivedStateFromProps', 'getDerivedStateFromError'];

/** 把一个Antd组件的所有静态属性拷贝到新组件中 */
// eslint-disable-next-line import/prefer-default-export
export const copyWithStatic = <
  PP,
  CP extends PP,
  TT extends ComponentType<CP> | ForwardRefExoticComponent<CP>,
  TS extends ComponentType<PP> | ForwardRefExoticComponent<PP>,
>(
  source: TS,
  target: TT,
): TT & { [key in keyof TS]: TS[key] } => {
  Object.keys(source).forEach(key => {
    if (ignoreKeys.includes(key)) {
      return;
    }
    if (unoverridableKeys.includes(key) && target[key as keyof TT] !== undefined) {
      return;
    }
    if (mergeKeys.includes(key)) {
      target[key as keyof TT] = {
        ...(target[key as keyof TT] as {}),
        ...(source[key as keyof TS] as {}),
      } as any;
    }
    target[key as keyof TT] = source[key as keyof TS] as any;
  });
  return target as typeof target & typeof source;
};
