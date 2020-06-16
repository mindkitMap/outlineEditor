# @mind-kit/outlineEditor

大纲编辑器。react 技术栈。
类似于幕布，workflowy，roamResearch，roamEdit等大纲类笔记所用。

## 使用到的技术
1. react-sort-tree https://github.com/frontend-collective/react-sortable-tree 
2. react-contenteditabl https://github.com/lovasoa/react-contenteditable 由于一个中文输入法相关的bug，已强改，暂未单独开源。见 ./src/ContentEditable.ts

## 如何运行

1. 运行一个例子。`git clone` 并 `npm start`。
2. 使用组件 - 
   ```jsx
    import { EditableTree } from "./EditableTree";
    import { data } from "./data";
    function App() {
        return <EditableTree treeData={data} 
            onDataChange={data=>console.log(data)}
        />;
    }
   ```
1. TODO 🏃， 作为Component发布。进一步设计封装好props、event，做好storybook之类的东西。

## 如何工作

1. 节点内容（待编辑内容）以`treeData`属性传入。
2. 节点内容借助react-sorted-tree展现。
3. 当树节点获得焦点时，转换到可编辑状态，节点内容可以编辑，变化以`onDataChange`事件传出。
4. TODO 🏃，当退出可编辑状态，特殊含义的文字转换为可操作的交互元素，比如链接，使editor可以直接用于相应交互操作。

## 参考

| props        |                   |                                                  |
| ------------ | ----------------- | ------------------------------------------------ |
| treeData     |                   | TreeNode[] 必须，待编辑的初始内容。              |
|              | TreeNode.id       | string，必须，节点id，需要唯一。                 |
|              | TreeNode.text     | string，必须，节点文本，用于被编辑，和展示。     |
|              | TreeNode.children | TreeNode[]，可选，节点的子节点。                 |
|              | TreeNode.expanded | boolean，可选，初始时节点是否展开。              |
| onDataChange |                   | (TreeNode[])=>void，事件监听，当内容变动时触发。 |



## 需要帮助

1. 需要大量测试和debug。目前测试很有限。
2. storybook之类的封装。
3. contentediable部分可以进一步封装为一个组件。
