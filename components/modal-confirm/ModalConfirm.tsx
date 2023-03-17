import React, { FC, ReactNode, useContext, useMemo } from 'react';
import { useRef, isValidElement } from 'react';
import message from '../message';
import type { ModalFuncProps } from '../modal';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import defaultLocale from '../locale/en_US';
import useModal from '../modal/useModal';

export type ModalConfirmProps = Omit<ModalFuncProps, 'onOk'> & {
  /** 点击确认按钮后，请求完成后的提示消息，要求 `onOK` 方法返回一个`Promise` */
  successText?: string | false;
  errorText?: string | false;

  /**
   * 点击确认按钮后的回调函数。
   *
   * 如果返回Promise，则会在Promise完成后自动提示成功消息。如果失败，则会提示`errorText`，如果没有设置`errorText`，则不提示。
   */
  onOk?: (...args: any[]) => Promise<any> | void;

  children: ReactNode;
};

export type DeleteModalConfirmProps = ModalConfirmProps & {
  /** 删除对象的名称，用于提示框的标题 */
  name?: string;
};

/** 确认对话框，如果是删除动作的话，建议使用`ModalConfirm.Delete` */
const ModalConfirm: FC<ModalConfirmProps> & {
  /** 删除确认框 */
  Delete: FC<DeleteModalConfirmProps>;
} = props => {
  const { onOk, onCancel, successText, errorText, children, ...restProps } = props;
  const [modal, holder] = useModal();

  // 点击children时，打开对话框
  const handleClick = () => {
    const confirmConfig = {
      onOk: async (...args: any[]) => {
        if (onOk) {
          try {
            await onOk(...args);
            if (successText) {
              message.success(successText);
            }
          } catch (e) {
            if (errorText) {
              message.error(errorText);
            }
          }
        }
      },
      onCancel: (...args: any[]) => {
        onCancel?.(...args);
      },
      ...restProps,
    };
    modal.confirm(confirmConfig);
  };
  const clickRef = useRef<() => void>();
  clickRef.current = handleClick;

  const renderDom = useMemo(() => {
    return cloneElement(children, {
      onClick: (e: React.KeyboardEvent<any>) => {
        if (isValidElement(children)) {
          children?.props.onClick?.(e);
        }
        clickRef.current?.();
      },
    });
  }, [children]);

  return (
    <>
      {renderDom}
      {holder}
    </>
  );
};

/** 删除确认框 */
ModalConfirm.Delete = props => {
  const { locale = defaultLocale } = useContext(ConfigContext);

  const {
    title = replaceMessage(locale.ModalConfirm?.deleteModalDefaultTitle || '', {
      name: props.name || locale.ModalConfirm?.deleteModalDefaultName || '',
    }),
    content = locale.ModalConfirm?.deleteModalDefaultContent,
    successText = locale.ModalConfirm?.deleteModalDefaultSuccessText,
    ...restProps
  } = props;
  return <ModalConfirm title={title} content={content} successText={successText} {...restProps} />;
};

function replaceMessage(template: string, variables: Record<string, string>) {
  return template.replace(/\$\{\w+\}/g, function (str) {
    var key = str.slice(2, -1);
    return variables[key] || '';
  });
}

export default ModalConfirm;
