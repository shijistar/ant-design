---
order: 7
title: 🔥 更新日志 (gdcd)
toc: false
timeline: true
---

`gdcd` 组件库（自定义扩展部分）的更新日志。为了与 `antd` 官方版本保持一致，我们不会修改 [主版本部分](http://semver.org/)，而是与在官方版本后面添加 `-xxx` 修订子版本号，例如 `4.21.1-1`。每次我们修改 gdcd 组件库时，修订子版本号加 1，但主版本号不变。如果我们同步了 github 官方版本，那么主版本号会跟着变化，但修订子版本号不变。也就是说`修订子版本号`与`主版本号`完全独立，互不影响。

---

## 4.23.5-10

`2023-07-10`

- 优化 `Input.Search` 组件的 `onSearch` 事件
- Table 组件的 `rowKey` 必填
- 优化 Table 组件的 fullHeight 样式
- Modal 的内置图标更换为 Filled 版本
- 统一分页组件风格
- 高亮显示 Table 列的 filter 搜索文本
- 调高 `message`、`notification` 的 zindex 级别

## 4.23.5-9

`2022-01-08`

- `Table` 在 `fullHeight` 模式下去掉分页底部的 margin

## 4.23.5-8

`2022-12-15`

- `Layout`、`Menu`适配 UI 设计规范

## 4.23.5-7

`2022-12-12`

- 字体、颜色、`Button`、`Steps`、`Pagination`适配 UI 设计规范

## 4.23.5-6

`2022-10-15`

- 🚀 AntDesign 同步到 `4.23.5` 版本

## 4.21.1-6

`2022-09-08`

- 🆕 新增 `ModalConfirm` 组件

## 4.21.1-5

`2022-08-19`

- 🆕 自定义 `Row` 组件
- `Row` 组件增加 `fullWidth` 属性，可以设置 `width: 100%`

## 4.21.1-4

`2022-06-28`

- 🆕 增加 `CHANGELOG-GDCD`，支持维护自定义扩展部分的更新日志
- 🛠 fix: 解决本地运行单元测试报错的问题

## 4.21.1-3

`2022-06-23`

- 🆕 自定义扩展 `ConfigProvider` 组件
- 🐞 修复 `ConfigProvider` 中自定义 `iconPrefixCls` 无效的问题

## 4.21.1-2

`2022-06-15`

- 🆕 自定义扩展 `table` 组件，增加 `fullHeight` 属性
- 添加 `gdcd` 自定义主题，且作为组件库文档网站的主题，在业务项目中，通过设置 less 的 `@root-entry-name` 变量来更改主题。

## 4.21.1-1

`2022-06-14`

- 🔥 搭建 gdcd 仓库，添加 bootstrap 和 update-remote 命令