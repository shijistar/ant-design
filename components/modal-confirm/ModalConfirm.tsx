import React, { FC, useContext, useMemo } from 'react';
import { useEffect, useRef, isValidElement } from 'react';
import Modal from '../modal';
import message from '../message';
import type { ModalFuncProps } from '../modal';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import defaultLocale from '../locale/en_US';

export type ModalConfirmProps = Omit<ModalFuncProps, 'onOk'> & {
  /** 点击确认按钮后，请求完成后的提示消息，要求 `onOK` 方法返回一个`Promise` */
  successText?: string;

  /**
   * 点击确认按钮后的回调函数。
   *
   * 如果返回Promise，则会在Promise完成后自动提示成功消息
   */
  onOk?: (...args: any[]) => Promise<any> | void;
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
  const { onOk, onCancel, successText, children, ...restProps } = props;
  const modalRef = useRef<ReturnType<typeof Modal.confirm>>();

  // 组件销毁时也销毁对话框
  useEffect(() => {
    return () => {
      if (modalRef.current) {
        modalRef.current.destroy();
      }
    };
  }, []);

  // 点击children时，打开对话框
  const handleClick = () => {
    const confirmConfig = {
      onOk: (...args: any[]) => {
        if (onOk) {
          const result = onOk(...args);
          if (result) {
            // 如果返回Promise，则提示成功消息
            result.then(() => {
              if (successText) {
                message.success(successText);
              }
            });
          }
        }
        modalRef.current = undefined;
      },
      onCancel: (...args: any[]) => {
        onCancel?.(...args);
        modalRef.current = undefined;
      },
      ...restProps,
    };
    if (modalRef.current) {
      modalRef.current.update(confirmConfig);
    } else {
      modalRef.current = Modal.confirm(confirmConfig);
    }
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

  return renderDom;
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
