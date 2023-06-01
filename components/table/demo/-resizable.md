---
order: -1
title:
  en-US: 🔥 Resizable Table
  zh-CN: 🔥 可调节列宽
---

## zh-CN

可拖拽调节列宽，列宽可以为空，自适应弹性布局。`resizable` 不可与 `fixed` 锁定列同时使用，效果十分诡异。

```tsx
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 50,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    width: 200,
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 3 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 35,
    address: 'London No. 4 Lake Park',
    tags: ['loser', 'cool'],
  },
  {
    key: '5',
    name: 'Sarah Brown',
    age: 25,
    address: 'London No. 5 Lake Park',
    tags: ['loser', 'cool'],
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 6 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '7',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 7 Lake Park',
    tags: ['loser'],
  },
  {
    key: '8',
    name: 'Jim Red',
    age: 35,
    address: 'London No. 8 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const App: React.FC = () => (
  <Table resizable fullHeight columns={columns} dataSource={data} style={{ height: 300 }} />
);

export default App;
```
