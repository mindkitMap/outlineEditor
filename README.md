# @mind-kit/outlineEditor

大纲编辑器。

以树形结构展示文本为主的层级内容。

类似于幕布，workflowy，roamResearch，roamEdit等大纲类笔记所用。

react 技术栈。


## 如何运行

1. 运行StoryBook。`git clone` 、`npm install` 并 `npm storybook`。

2. 使用组件 - 
   ```jsx
    import { EditableTree } from "./EditableTree";
    import { data } from "./data";
    function App() {
        return <EditableTree value={data} 
            onChange={data=>console.log(data)}
            trigger={trigger}
            transform={transform}
        />;
    }
   ```

## 如何工作

1. 节点内容（待编辑内容）以`value`属性传入。其结构约定如“参考”一节。
2. 节点内容以树形展现。借助react-sorted-tree。
3. 当树节点获得焦点时，转换到可编辑状态，节点内容可以编辑，变化以`onChange`事件传出。其结构约定如“参考”一节。
4. 自动完成。自定制，以trigger属性传入。其结构约定如“参考”一节。
5. 当退出可编辑状态，节点内容可以做一个转换，作为节点展示用，这个功能可以让内容具备交互能力。比如`[[MindKit]]`转换为`<a href='...#word=MindKit'>MindKit</a>`。这个转换的转换函数由transform/transform3Model属性传入。如“参考”一节详述。
   1. 转换后文本仅作为展示用，不会影响编辑时文本，即onChange传出的数据内容不会被影响。



## 操作说明

各节点有几种状态 - 
1. 编辑中 - 节点内容正在被编辑，当节点被选后，可以进入编辑，具体操作如下详述。
2. 选中 - 节点被选中，可以被操作，但没有进入编辑状态。
3. 其他 - 没有被选中，也没有被编辑。

### 键盘操作

| 键盘操作       | 编辑中状态                                                   | 未在编辑中                                                   |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 上、下方向     | 变化选中的节点，本节点退出编辑状态，编辑生效                 | 变化选中的节点                                               |
| 空格           | 输入空格符                                                   | 进入编辑中状态                                               |
| esc            | 退出编辑状态，编辑生效                                       |                                                              |
| enter          | 退出编辑状态，编辑生效。生成新节点，位于本节点之下，与本节点同级。 | 生成新节点，位于本节点之下，同本节点同级。                   |
| tab、shift+tab | 变化本节点的级别，tab为缩进，即级别+1。shift+tab为反缩进，级别-1。 | 变化本节点的级别，tab为缩进，即级别+1。shift+tab为反缩进，级别-1。 |
### 鼠标操作
| 鼠标操作               | 编辑中状态                                 | 未在编辑中                           |
| ---------------------- | ------------------------------------------ | ------------------------------------ |
| 点击节点中部，文字部分 |                                            | 选中点击的节点，并进入编辑状态。TODO |
| 双击节点               |                                            | 选中点击的节点，并进入编辑状态。TODO |
| 点击节点右端           | 退出编辑状态，编辑生效。                   | 选中点击的节点。                     |
| 拖动左侧圆点           | 退出编辑状态，编辑生效，拖动节点移动。     | 拖动节点移动。                       |
| 点击加减号             | 退出编辑状态，编辑生效，展开或收拢子节点。 | 展开或收拢子节点。                   |



## 参考

| props        |                   |                                                     |
| ------------ | ----------------- | --------------------------------------------------- |
| value     |                   | 必须。TreeNode[] ，待编辑的初始内容。一级节点的数组。 |
|              | TreeNode.id       | string，必须，节点id，需要唯一。                    |
|              | TreeNode.text     | string，必须，节点文本，用于被编辑，和展示。        |
|              | TreeNode.children | TreeNode[]，可选，节点的子节点。                    |
|              | TreeNode.attributes.view.expanded | boolean，可选，初始时节点是否展开。                 |
| onChange |                   | 可选。(event)=>void，事件监听，当内容变动时触发。 |
|  | event.treeData | TreeNode[]，大纲内容，结构同输入props.value |
|  | event.isComposing | boolean，中文输入法的键入引起的事件，来源于onInput事件的isComposing。 https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/isComposing （在很多只关心内容，不关心操作过程的事件逻辑中，你可能需要过滤掉`isComposing===true`的事件。） |
| trigger |  | 可选。定义自动完成的属性，本属性直接传递给react-textarea-autocomplete ，其具体结构见 - https://github.com/webscopeio/react-textarea-autocomplete#trigger-type， 缺省为空，即不定义任何自动完成行为。可以在`./stories/trigger.js`中找到例子。 |
| transform |  | 可选。(string)=>string，转换函数。传入编辑时文本，传出展示时文本。这个功能可以让内容具备交互能力。比如编辑时`[[MindKit]]`可以转换为展示时`<a href='...#word=MindKit'>MindKit</a>`。缺省为不做任何转换。可以在`./stories/transform.js`中找到例子。 |
| transform3Model | | 可选。使用3Model机制。一个更加完备的转换系统，具体设计思想见下面的说明。当本属性被设置时优先级高于transform属性。单独设置transform属性可以视为本属性的一个简写。具体可见源代码src/Transform3Model.ts |
|  | toInputting | 从model转换到inputting model |
|  | fromInputting | 从inputting model转换到model |
|  | toView | 从model转换到view model |

## 3Model机制

树中的每个节点有三个模型，model、inputting model、view model，分别对应业务模型，编辑模型，展示模型。

其中

1. 编辑模型用于**编辑中**状态，在键入（或其他编辑操作）的时候，业务模型会随之更新。

2. 展示模型用于**未在编辑**状态，用于支持内容的展示和简单的交互，比如点击某些特殊内容。

3. 业务模型是树所完成的业务。即大纲编辑。树与外部交互的数据是业务模型。比如value传入和onChange传出。

   

比如在常见的大纲编辑中，[[xxx]]被解析唯一个topic链接。此时，对于业务模型，可以在text中保留文本，而在attributes中放入topic的链接目标等信息。

```yaml
id: 'xxxxx'
text: 'cost 1 hour on this [[some topic]]'
attributes: 
    links: 
        -   text: 'some topic'
            target: 'topic:someTopic'
    view:
        expanded: true
```

对于展示模型，UI展示'cost 1 hour on this [[some topic]]'，其中[[some topic]] 是一个可以点击的button（或者其他可操作的UI部件）。

对于编辑模型，就是一个包含”cost 1 hour on this [[some topic]]“ 的一个文本框（或者其他可编辑的UI部件）。可以在键入的同时，非常方便地改写’some topic‘这个topic链接。

源代码中已经包含上述例子，可以在story中查找。



## 使用到的技术

1. react-sort-tree https://github.com/frontend-collective/react-sortable-tree 
2. react-textarea-autocomplete https://github.com/webscopeio/react-textarea-autocomplete 



## 路线图/需要帮助

1. 多行或者变高度的node没有实现。
4. 嵌入网页等复杂内容，也严重依赖于变高度的node。
5. 子树级别使用3model。支持定制展示和编辑。比如，某个节点及其子节点以**看板**、**表格**等特殊形式展示和编辑，此时对这个节点如何使用3model？
6. 需要大量测试和debug。目前测试很有限。

