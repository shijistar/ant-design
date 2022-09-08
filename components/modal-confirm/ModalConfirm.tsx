import React, { FC, useContext } from 'react';
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

/** 确认对话框，如果是删除动作的话，建议使用`ModalConfirm.Delete` */
const ModalConfirm: FC<ModalConfirmProps> & {
  /** 删除确认框 */
  Delete: FC<ModalConfirmProps>;
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

  return cloneElement(children, {
    onClick: (e: React.KeyboardEvent<any>) => {
      if (isValidElement(children)) {
        children?.props.onClick?.(e);
      }
      handleClick();
    },
  });
};

/** 删除确认框 */
ModalConfirm.Delete = (props: ModalConfirmProps) => {
  const { locale = defaultLocale } = useContext(ConfigContext);

  const {
    title = locale.ModalConfirm?.deleteModalDefaultTitle,
    content = locale.ModalConfirm?.deleteModalDefaultContent,
    successText = locale.ModalConfirm?.deleteModalDefaultSuccessText,
    ...restProps
  } = props;
  return <ModalConfirm title={title} content={content} successText={successText} {...restProps} />;
};

export default ModalConfirm;
