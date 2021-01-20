import React, { Component } from "react";
import SortableTree, {
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  find,
  insertNode,
  removeNode,
  map,
} from "react-sortable-tree";
import { momentString, uuid, deepMerge } from "./Util";

import { defaultNodeCell } from "./TransformNodeCell";

import "react-sortable-tree/style.css";

import "./spreadsheet.css";

function translateToModel(treeData) {
  return map({
    treeData,
    getNodeKey,
    callback: ({ node }) =>
      deepMerge(node, { attributes: { view: { expanded: node.expanded } } }),
    ignoreCollapsed: false,
  });
}
function translateToTreeModel(model) {
  console.log("model", model);
  const re = map({
    treeData: model,
    getNodeKey,
    callback: ({ node }) =>
      deepMerge(node, { expanded: node.attributes?.view?.expanded }),
    ignoreCollapsed: false,
  });
  console.log("re", re);
  return re;
}
function getNodeKey({ node }) {
  return node.id;
}
class EditableTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: translateToTreeModel(props.value),
    };
    this.treeRef = React.createRef();
  }
  //FIXME BUG 会覆盖掉内部的state，添加子节点无效。
  //需要继续研究当props改变的时候应该如何去操作内部state。
  // static getDerivedStateFromProps(newProps) {
  //   return {
  //     treeData: translateToTreeModel(newProps.value),
  //   };
  // }
  //因为stories里面上层的value是写死的data.js，没有跟着onchange来变化。

  fireDataChange(treeData, isComposing = false) {
    // eslint-disable-next-line no-unused-expressions
    this.props.onChange?.({
      treeData: translateToModel(treeData),
      isComposing,
    });
  }
  fireClicked(ev) {
    this.props.onClick?.(ev);
  }
  fireSelected(id) {
    this.props.onSelected?.({ id, node: this.findById(id) });
  }
  selectNodeAsync(id) {
    clearTimeout(this.selectNodeAsyncTimeout);
    this.selectNodeAsyncTimeout = setTimeout(() => this.selectNode(id), 0);
  }
  selectNode(id) {
    if (id === this.state.selectedNodeId) return;
    this.setState({ ...this.state, selectedNodeId: id });
    this.fireSelected(id);
  }
  focusSelectedNode() {
    const textarea = this[`ref-en-${this.state.selectedNodeId}`];
    if (textarea) {
      textarea.focus();
      return textarea.textareaRef;
    }
  }

  indentNode(depthDelta = 1) {
    const thisNode = this.rowInfo.node;
    const nowDepth = this.rowInfo.path.length - 1;
    const removed = removeNode({
      treeData: this.state.treeData,
      path: this.rowInfo.path,
      getNodeKey,
    });
    const newNode = removed.node;
    const nowIndex = removed.treeIndex;
    const re = insertNode({
      treeData: removed.treeData,
      depth: nowDepth + depthDelta,
      minimumTreeIndex: nowIndex,
      newNode,
      getNodeKey,
      expandParent: true,
    });
    this.fireDataChange(re.treeData, false);
    this.setState({ ...this.state, treeData: re.treeData });

    this.selectNodeAsync(thisNode.id);
  }
  handleNodeClicked(event, rowInfo) {
    if (event.target.attributes["data-event"]) {
      this.fireClicked(event);
    }
    if (
      event.target.className.includes("collapseButton") ||
      event.target.className.includes("expandButton")
    ) {
    } else {
      this.selectNode(rowInfo.node.id);
    }
  }

  handleNodeTitleChanged(event, node, path, newValue) {
    const newNode = { ...node, text: newValue };
    const newTree = changeNodeAtPath({
      treeData: this.state.treeData,
      path: path,
      newNode,
      getNodeKey,
    });
    // console.log(newTree);
    // setTimeout(()=>
    this.setState({
      ...this.state,
      treeData: newTree,
    });
    this.fireDataChange(newTree, event.nativeEvent?.isComposing);
    // ,0)
  }
  // handleKeyInNodeEditing(event, node, path) {}

  findNextRowInfo(rowInfo, delta = 1) {
    // console.log(rowInfo);
    /*
      rowInfo -----
      isSearchFocus: false
      isSearchMatch: false
      lowerSiblingCounts: [0]
      node: {id: "b002", text: "Regional Manager", expanded: true, type: "typeB", starts_with: "simple", …}
      parentNode: null
      path: ["b002"]
      treeIndex: 1
     */
    const { treeIndex } = rowInfo;
    const next = getVisibleNodeInfoAtIndex({
      treeData: this.state.treeData,
      index: treeIndex + delta,
      getNodeKey,
    });
    /**
     * {node: {…}, lowerSiblingCounts: Array(1), path: Array(1)}
     */
    return next;
  }
  /**
   * for 'enter' press
   */
  setNodeText(text) {
    const thisNode = this.rowInfo.node;
    const newNode = { ...thisNode, text: text };
    // console.log('newNode', newNode);
    const newTree = changeNodeAtPath({
      treeData: this.state.treeData,
      path: this.rowInfo.path,
      newNode,
      getNodeKey,
    });
    // console.log("newTree",  newTree)
    this.setState({
      ...this.state,
      treeData: newTree,
    });
    this.fireDataChange(newTree, false);
    // this.selectNodeAsync(newNode.id);
  }

  createLowSibling(text, editing = false, selection) {
    const id = uuid();
    const nodeText = text ?? `${id.slice(0, 4)} ${momentString()}`;
    const re = insertNode({
      treeData: this.state.treeData,
      depth: this.rowInfo.path.length - 1,
      minimumTreeIndex: this.rowInfo.treeIndex + 1,
      newNode: { id, text: nodeText },
      getNodeKey,
    });
    this.setState({ ...this.state, treeData: re.treeData });
    this.fireDataChange(re.treeData, false);
    if (editing) {
      setTimeout(() => {
        this.selectNode(id);
        this.enterEditing(undefined, selection);
      }, 0);
    } else {
      this.selectNodeAsync(id);
    }
  }

  findById(nodeId) {
    const re = find({
      treeData: this.state.treeData,
      searchMethod: (data) => data.node.id === nodeId,
      getNodeKey,
    });
    return re?.matches?.[0]?.node;
  }
  gotoSelectDelta(delta = 1) {
    if (this.rowInfo) {
      const newInfo = this.findNextRowInfo(this.rowInfo, delta);
      //不要去隐藏 root 了。
      if (newInfo && newInfo.path.length > 0) {
        this.selectNode(newInfo.node.id);
      }
    }
  }
  isEditing() {
    return this.editingNodeId !== undefined;
  }

  enterEditing(triggerEvent, selection) {
    const before = this.isEditing();
    const textarea = this.focusSelectedNode();
    if (!textarea) return;
    if (!before && this.isEditing()) {
      if (selection) textarea.setSelectionRange(selection.start, selection.end);
      else textarea.setSelectionRange(0, textarea.value.length);
      triggerEvent?.preventDefault?.();
    }
  }
  exitEditing(triggerEvent) {
    if (this.isEditing()) {
      const nodeId = this.editingNodeId;
      const ref = this[`ref-en-${this.editingNodeId}`];
      if (ref) {
        ref.blur();
        this.treeRef.current.tabIndex = -1;
        this.treeRef.current.focus();
      }
    }
  }

  handleGeneralKeyDown(event) {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "ArrowDown") {
      this.exitEditing();
      this.gotoSelectDelta();
    }
    if (event.key === "ArrowUp") {
      this.exitEditing();
      this.gotoSelectDelta(-1);
    }
    if (event.key === "Escape") {
      this.exitEditing();
    }
    if (event.key === " ") {
      this.enterEditing(event);
    }
    if (event.key === "Enter") {
      const textArea = event.target;
      // console.log("textArea", textArea.value, textArea.selectionStart);
      const cursor = textArea.selectionStart;
      if ((cursor || cursor === 0) && cursor < textArea.value.length - 1) {
        const first = textArea.value.slice(0, cursor);
        const second = textArea.value.slice(cursor);
        this.exitEditing();
        this.setNodeText(first);
        setTimeout(
          () => this.createLowSibling(second, true, { start: 0, end: 0 }),
          0
        );
        // this.createLowSibling(second, true, { start: 0, end: 0 })
      } else {
        this.exitEditing();
        this.createLowSibling();
      }
    }
    if (event.key === "Tab") {
      this.indentNode();
      event.preventDefault();
    }
    if (event.shiftKey && event.key === "Tab") {
      this.indentNode(-1);
      event.preventDefault();
    }
  }

  //focus=false when blur
  handleNodeTextFocus(event, nodeId, focus = true) {
    if (focus) this.editingNodeId = nodeId;
    else this.editingNodeId = undefined;
  }

  render() {
    return (
      <div
        className={"treeFocusBoundary"}
        ref={this.treeRef}
        onKeyDown={(event) => this.handleGeneralKeyDown(event)}
        tabIndex={-1}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      >
        <div style={{ height: 700 }}>
          <SortableTree
            // theme={MaterialTheme}
            scaffoldBlockPxWidth={32}
            rowHeight={48}
            isVirtualized={true}
            treeData={this.state.treeData}
            getNodeKey={getNodeKey}
            onChange={(treeData) => {
              this.setState({ ...this.state, treeData });
              this.fireDataChange(treeData);
            }}
            generateNodeProps={(rowInfo) => {
              const { node, path } = rowInfo;
              let nodeProps = {
                onClick: (event) => this.handleNodeClicked(event, rowInfo),
                title: (this.props.nodeCell ?? defaultNodeCell)(
                  rowInfo,
                  this,
                  this.props
                ),
                className: "node-text",
              };
              if (this.state.selectedNodeId === rowInfo.node.id) {
                this.rowInfo = rowInfo;
                nodeProps.className = "selected-node node-text";
              }
              return nodeProps;
            }}
          />
        </div>
      </div>
    );
  }
}

export default EditableTree;
