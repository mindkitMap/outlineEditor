# @mind-kit/outlineEditor

大纲编辑器。

以树形结构编辑和展示文本为主的层级内容。

类似于幕布，workflowy，roamResearch，roamEdit等大纲类笔记所用。

react 技术栈。


## 如何运行

1. 运行StoryBook。`git clone` 、`npm install` 、`npm run build`、并 `npm run storybook`。

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
3. 当树节点获得焦点，可以转换到可编辑状态，节点内容可以编辑，变化以`onChange`事件传出。其结构约定如“参考”一节。
4. 编辑过程中可以触发自动完成。触发规则和提示内容需要定制，以trigger属性传入。其结构约定如“参考”一节。
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
| enter          | 退出编辑状态，编辑生效。生成新节点，位于本节点之下，与本节点同级。如果当时编辑位置不在文本末尾，节点将从编辑位置处分开，后面的文本出现在新节点上。 | 生成新节点，位于本节点之下，同本节点同级。                   |
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
| onSelected |  | 可选。(event)=>void，事件监听，当节点被选中时触发。 |
|  | event.id | TreeNode.id，被选中的节点id。（暂不支持多选及相关的批量操作。TODO） |
| onClick |  | 可选。(event)=>void，事件监听，当节点被点击时触发。可能主要用于对节点内部UI部件的响应。注意，需要在UI部件上加上”data-event“属性，才会被onClick触发。比如在transform里面变换出：`<button data-event=true data-uri=${uri}>${text}</button>`。stories里面有个demo。 |
|  | event | 直接传出react默认的event。也就是说，可以用event.target.attributes["xxxx"]来获得相关信息。 |
| trigger |  | 可选。定义自动完成的属性，本属性直接传递给react-textarea-autocomplete ，其具体结构见 - https://github.com/webscopeio/react-textarea-autocomplete#trigger-type， 缺省为空，即不定义任何自动完成行为。可以在`./stories/trigger.js`中找到例子。 |
| transform |  | 可选。(inputting:string)=>string，转换函数。传入编辑时文本，传出展示时文本。这个功能可以让内容具备交互能力。下面的章节有进一步的解释。 |
|  | inputting | 输入的文本内容 |
|  | （返回） | 展示时的html。比如编辑时`[[MindKit]]`可以转换为展示时`<a href='...#word=MindKit'>MindKit</a>`。 |
| transform3Model | | 可选。使用3Model机制。一个更加完备的转换系统，具体设计思想见下面的说明。当本属性被设置时优先级高于transform属性。单独设置transform属性可以视为本属性的一个简写。下面的章节有进一步的解释，源代码中有一些例子。        src/Transform3Model.ts |
|  | toInputting | (object)=>string 从model转换到inputting model |
|  | fromInputting | (string,object)=> object 从inputting model转换到model |
|  | toView | (object)=> string 从model转换到view model |

## “转换”

“转换“（transform）在此是一个有一定特殊意义，跟表面意思有点区别的词，需要做一个进一步的说明。

大纲编辑器有个比较普遍的功能，就是用普通的文本输入来快捷插入一些概念实体。比如，`#xxx` 表示打一个tag，`[[xxx]]` 表示关联一个topic，`((xxx))` 表示一个节点引用，`{{xxx}}`表示一个宏，等等。

这个功能就要求大纲编辑的时候能从文本输入中识别出这些特定的概念实体。这个过程，就是在此使用的”转换“这个词。原意是指”把输入、编辑时的纯文本*转换*为展示时的丰富结构“。当然这个说法并不很理想，用的是一个技术手段概念来代替目的概念。可能更好的用词是”抽取“（Extracting）之类的。考虑在以后的版本中更新。

转换/抽取机制是大纲编辑器的一个核心能力之一，是本项目演进过程中的一个焦点，其机制设计和实现变化比较频繁。

## 3Model机制

从上面一个章节的介绍可以看到，转换机制最初只是”输入时的纯文本与展示时的丰富结构“的这两个表现形式的相互转换。后来发现这两个形式对于大纲编辑来说是不完整的。为了取得结构化的数据用于高层应用，不可能仿佛去读取和解析纯文本。纯文本只是一个节点处于输入/编辑时的适当形态，而不是一个好的，方便承载通常业务功能的标准形态。

于是就有了3Model机制的设计。如下。

树中的每个节点有三个模型，model、inputting model、view model，分别对应业务模型，编辑模型，展示模型。

其中

1. 编辑模型用于**编辑中**状态，在键入（或其他编辑操作）的时候，业务模型会随之更新。

2. 展示模型用于**未在编辑**状态，用于支持内容的展示和简单的交互，比如点击某些特殊内容。

3. 业务模型是树所完成的业务。即大纲编辑。树与外部交互的数据是业务模型。比如value传入和onChange传出。

   

比如在常见的大纲编辑中，**[[xxx]]** 被解析唯一个topic链接。此时，对于业务模型，可以在text中保留文本，而在attributes中放入topic的链接目标等信息。

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
3. 节点多选。
4. Undo/Redo
5. 子树级别使用3model。支持定制展示和编辑。比如，某个节点及其子节点以**看板**、**表格**等特殊形式展示和编辑，此时对这个节点如何使用3model？
6. 需要大量测试和debug。目前测试很有限。

