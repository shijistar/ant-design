import defaultLocale from '../locale/default';

export interface ModalConfirmLocale {
  deleteModalDefaultName: string;
  deleteModalDefaultTitle: string;
  deleteModalDefaultContent: string;
  deleteModalDefaultSuccessText: string;
}

let runtimeLocale: ModalConfirmLocale = {
  ...(defaultLocale.ModalConfirm as ModalConfirmLocale),
};

export function changeConfirmLocale(newLocale?: ModalConfirmLocale) {
  if (newLocale) {
    runtimeLocale = {
      ...runtimeLocale,
      ...newLocale,
    };
  } else {
    runtimeLocale = {
      ...(defaultLocale.ModalConfirm as ModalConfirmLocale),
    };
  }
}

export function getConfirmLocale() {
  return runtimeLocale;
}
