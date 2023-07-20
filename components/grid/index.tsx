import Col from './gdcd-col';
import useInternalBreakpoint from './hooks/useBreakpoint';
import Row from './gdcd-row';

// Do not export params
function useBreakpoint() {
  return useInternalBreakpoint();
}

export { ColProps, ColSize } from './gdcd-col';
export { RowProps } from './gdcd-row';
export { Row, Col };

export default { useBreakpoint };
