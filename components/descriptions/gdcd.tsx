import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { DescriptionsProps as AntDescriptionsProps } from './index';
import AntDescriptions from './index';

export * from './index';

export type DescriptionsProps = AntDescriptionsProps;

function GDCDDescriptions(props: DescriptionsProps) {
  const { ...antdProps } = props;
  return <AntDescriptions {...antdProps} />;
}

export default copyWithStatic(AntDescriptions, GDCDDescriptions);
