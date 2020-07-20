import React, { Component } from "react";
import SortableTree, {
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  find,
  insertNode,
  removeNode,
} from "react-sortable-tree";
import { EditableNode } from "./EditableNode";
import { momentString, uuid } from "./Util";

// import 'react-sortable-tree/styles.css';

//TODO 难点似乎是onblur onfocus？

export class EditableTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: props.value,
    };
    this.treeRef = React.createRef();
  }
  fireDataChange(treeData) {
    // eslint-disable-next-line no-unused-expressions
    this.props.onChange?.(treeData);
  }
  selectNodeAsync(id) {
    clearTimeout(this.selectNodeAsyncTimeout);
    this.selectNodeAsyncTimeout = setTimeout(() => this.selectNode(id), 0);
  }
  selectNode(id) {
    this.setState({ ...this.state, selectedNodeId: id });
  }
  focusSelectedNode() {
    const ref = this[`ref-en-${this.state.selectedNodeId}`];
    if (ref) {
      ref.focus();
    }
  }

  getNodeKey({ node }) {
    return node.id;
  }

  indentNode(depthDelta = 1) {
    const thisNode = this.rowInfo.node;
    const nowDepth = this.rowInfo.path.length - 1;
    const removed = removeNode({
      treeData: this.state.treeData,
      path: this.rowInfo.path,
      getNodeKey: this.getNodeKey,
    });
    const newNode = removed.node;
    const nowIndex = removed.treeIndex;
    const re = insertNode({
      treeData: removed.treeData,
      depth: nowDepth + depthDelta,
      minimumTreeIndex: nowIndex,
      newNode,
      getNodeKey: this.getNodeKey,
      expandParent: true,
    });
    this.setState({ ...this.state, treeData: re.treeData });
    this.fireDataChange(re.treeData);
    this.selectNodeAsync(thisNode.id);
  }

  handleNodeClicked(event, rowInfo) {
    if (
      event.target.className.includes("collapseButton") ||
      event.target.className.includes("expandButton")
    ) {
    } else {
      this.selectNode(rowInfo.node.id);
    }
  }

  handleNodeTitleChanged(event, node, path, newValue) {
    // console.log(node)
    // console.log(path)
    // console.log(newValue)
    // console.log(this.rowInfo.path)
    console.log("in tree change handle - " + newValue);
    const newNode = { ...node, text: newValue };
    const newTree = changeNodeAtPath({
      treeData: this.state.treeData,
      path: path,
      newNode,
      getNodeKey: this.getNodeKey,
    });
    console.log(newTree);
    // setTimeout(()=>
    this.setState({
      ...this.state,
      treeData: newTree,
    });
    this.fireDataChange(newTree);
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
      getNodeKey: this.getNodeKey,
    });
    /**
     * {node: {…}, lowerSiblingCounts: Array(1), path: Array(1)}
     */
    return next;
  }
  createLowSibling() {
    const id = uuid();
    const re = insertNode({
      treeData: this.state.treeData,
      depth: this.rowInfo.path.length - 1,
      minimumTreeIndex: this.rowInfo.treeIndex + 1,
      newNode: { id, text: `${id.slice(0, 4)} ${momentString()}` },
      getNodeKey: this.getNodeKey,
    });
    this.setState({ ...this.state, treeData: re.treeData });
    this.fireDataChange(re.treeData);

    this.selectNodeAsync(id);
  }
  findById(nodeId) {
    const re = find({
      treeData: this.state.treeData,
      searchMethod: (node) => node.id === nodeId,
      getNodeKey: this.getNodeKey,
    });
    // console.log(re);
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

  enterEditing(triggerEvent) {
    const before = this.isEditing();
    this.focusSelectedNode();
    if (!before && this.isEditing()) {
      document.execCommand("selectAll", false, null);
      triggerEvent.preventDefault();
    }
  }
  exitEditing(triggerEvent) {
    if (this.isEditing()) {
      const nodeId = this.editingNodeId;

      //FIXME fire change data event
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
      this.exitEditing();
      //生成兄弟。
      // setTimeout(() => 
      this.createLowSibling()
      // , 0);
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
            treeData={this.state.treeData}
            getNodeKey={this.getNodeKey}
            onChange={(treeData) => {
              this.setState({ ...this.state, treeData });
              this.fireDataChange(treeData);
            }}
            generateNodeProps={(rowInfo) => {
              const { node, path } = rowInfo;
              let nodeProps = {
                onClick: (event) => this.handleNodeClicked(event, rowInfo),
                title: (
                  <EditableNode
                    title={node.text}
                    onFocus={(ev) => {
                      this.handleNodeTextFocus(ev, node.id);
                    }}
                    //FIXME 由contenteditable blur引发的onchange不能生效，因为change node 以后没有刷新。blur之后刷新，ce的值被还原。
                    //FIXME 重现： 输入汉字，不要标点符号，直接回车。
                    onBlur={(ev) => {
                      // this.handleNodeTitleChanged(
                      //   ev,
                      //   node,
                      //   path,
                      //   //MARK 这里可能要改，innerText可能不等于纯node.text，innerText可能等于text->html之后的那个text。
                      //   ev.target.value
                      // );
                      console.log("in onB handler of ce");
                      this.handleNodeTextFocus(ev, node.id, false);
                      // ev.stopPropagation();
                    }}
                    innerRef={(en) => (this[`ref-en-${node.id}`] = en)}
                    onChange={(event) => {
                      // console.log("on content change");
                      // console.log(event)
                      console.log("in onC handler of ce");

                      this.handleNodeTitleChanged(
                        event,
                        node,
                        path,
                        event.target.value
                      );
                    }}
                  />
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
