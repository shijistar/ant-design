---
order: 1
title:
  zh-CN: 基本用例
  en-US: 基本用例
---

## zh-CN

弹出一个自定义确认框，保存之后弹出成功提示。

## en-US

弹出一个自定义确认框，保存之后弹出成功提示。

```tsx
import React from 'react';
import { ModalConfirm, Button } from 'antd';

const App: React.FC = () => {
  const [saving, setSaving] = React.useState(false);
  const save = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <ModalConfirm title="确定保存？" content="文件内容会被覆盖" successText="保存成功" onOk={save}>
      <Button type="primary" loading={saving}>
        保存
      </Button>
    </ModalConfirm>
  );
};

export default App;
```
