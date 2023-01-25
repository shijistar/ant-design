import React, { useRef } from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { SearchProps as AntSearchProps } from './Search';
import { InputRef } from './Input';
import AntSearch from './Search';

export * from './Search';

export type SearchProps = AntSearchProps;

function GDCDSearch(props: SearchProps, ref: React.MutableRefObject<InputRef>) {
  const { onSearch, onChange, ...antdProps } = props;
  const keywordRef = useRef<string>();
  return (
    <AntSearch
      onSearch={value => {
        keywordRef.current = value;
        onSearch?.(value);
      }}
      onChange={e => {
        onChange?.(e);
        if (!e.target.value && keywordRef.current) {
          keywordRef.current = '';
          onSearch?.('');
        }
      }}
      {...antdProps}
      ref={ref}
    />
  );
}

const GDCDForwardSearch = React.forwardRef(GDCDSearch) as (
  props: React.PropsWithChildren<SearchProps> & { ref?: React.Ref<InputRef> },
) => React.ReactElement;

export default copyWithStatic(AntSearch, GDCDForwardSearch);
