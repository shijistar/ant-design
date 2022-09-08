---
type: 反馈
category: Components
subtitle: 🔥 模态确认框
title: ModalConfirm
cover: https://gw.alipayobjects.com/zos/alicdn/3StSdUlSH/Modal.svg
---

模态确认框。

## 何时使用

当用户需要确认某个操作时，可以使用模态确认框。UI 推荐使用模态确认框，不推荐使用`Popconfirm`组件。

一般常用的属性是`title`、`content`和`onOK`。对于删除操作，可以使用 `ModalConfirm.Delete` 子组件，它会内置默认的`title`和`content`，使用起来更简单。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | function | - | 4.9.0 |
| autoFocusButton | 指定自动获得焦点的按钮 | null \| `ok` \| `cancel` | `ok` |  |
| bodyStyle | Modal body 样式 | CSSProperties |  | 4.8.0 |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button/#API) | - |  |
| cancelText | 设置 Modal.confirm 取消按钮文字 | string | `取消` |  |
| centered | 垂直居中展示 Modal | boolean | false |  |
| className | 容器类名 | string | - |  |
| closable | 是否显示右上角的关闭按钮 | boolean | false | 4.9.0 |
| closeIcon | 自定义关闭图标 | ReactNode | undefined | 4.9.0 |
| content | 内容 | ReactNode | - |  |
| getContainer | 指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom | HTMLElement \| () => HTMLElement \| Selectors \| false | document.body |  |
| icon | 自定义图标 | ReactNode | &lt;QuestionCircle /> |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| mask | 是否展示遮罩 | boolean | true |  |
| maskClosable | 点击蒙层是否允许关闭 | boolean | false |  |
| maskStyle | 遮罩样式 | object | {} |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button/#API) | - |  |
| okText | 确认按钮文字 | string | `确定` |  |
| okType | 确认按钮类型 | string | `primary` |  |
| style | 可用于设置浮层的样式，调整浮层位置等 | CSSProperties | - |  |
| 🔥 successText | 操作成功后的提示消息，要求`onOK`返回 promise | string | 默认为`""`，删除框组件时默认值为`删除成功` |  |
| title | 标题 | ReactNode | - |  |
| width | 宽度 | string \| number | 416 |  |
| wrapClassName | 对话框外层容器的类名 | string | - | 4.18.0 |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 |  |
| onCancel | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function(close) | - |  |
| 🔥 onOk | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭，并自动弹出`successText`提示消息 | function(close) | - |  |
