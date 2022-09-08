---
order: 2
title:
  zh-CN: 删除确认框
---

## zh-CN

删除确认框，默认提供文字信息，使用更简洁。`title`、`content`、`successText`不使用默认值的话，也可以自己单独设置。

```tsx
import React from 'react';
import { ModalConfirm, Button } from 'antd';

const App: React.FC = () => {
  const [deleting, setDeleting] = React.useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDeleting(false);
  };

  return (
    <ModalConfirm.Delete onOk={handleDelete}>
      <Button danger loading={deleting}>
        删除
      </Button>
    </ModalConfirm.Delete>
  );
};

export default App;
```
