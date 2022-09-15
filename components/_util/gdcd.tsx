const ignoreKeys = ['$$typeof', 'render', 'contextType', 'contextTypes'];
const mergeKeys = ['defaultProps', 'propTypes'];
const unoverridableKeys = ['displayName', 'getDerivedStateFromProps', 'getDerivedStateFromError'];

/** 把一个Antd组件的所有静态属性拷贝到新组件中 */
export const copyWithStatic = <TS, TT>(
  source: TS,
  target: TT,
): TT & { [key in keyof TS]: TS[key] } => {
  if (!source || !target) {
    return target as TT & TS;
  }
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
