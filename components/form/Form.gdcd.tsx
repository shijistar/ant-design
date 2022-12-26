import React from 'react';
import { copyWithStatic } from '../_util/gdcd';
import type { FormInstance, FormProps as AntFormProps } from './Form';
import AntForm from './Form';

export * from './Form';

export type FormProps<Values = any> = AntFormProps<Values>;

function GDCDForm<Values = any>(
  props: React.PropsWithChildren<FormProps<Values>> & { ref?: React.Ref<FormInstance<Values>> },
) {
  const { autoComplete = 'off', ref, ...antdProps } = props;
  return <AntForm<Values> autoComplete={autoComplete} {...antdProps} ref={ref} />;
}

const ForwardForm = React.forwardRef(GDCDForm) as <Values = any>(
  props: React.PropsWithChildren<FormProps<Values>> & { ref?: React.Ref<FormInstance<Values>> },
) => React.ReactElement;

export default copyWithStatic(AntForm, ForwardForm);
