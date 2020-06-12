import React, { Component } from "react";
import SortableTree, {
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  find,
  insertNode,
  removeNode,
} from "react-sortable-tree";
import { EditableNode } from "./EditableNode";
import { data } from "./data";
import { momentString, uuid, equalsStringArray } from "./Util";

// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export class EditableTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: data,
    };

    this.treeRef = React.createRef();
  }
  selectNodeAsync(id) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.selectNode(id), 0);
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
  handleNodeClicked(event, rowInfo) {
    if (
      event.target.className.includes("collapseButton") ||
      event.target.className.includes("expandButton")
    ) {
    } else {
      this.selectNode(rowInfo.node.id);
    }
  }

  getNodeKey({ node }) {
    return node.id;
  }
  handleNodeTitleChanged(event, node, path) {
    const newNode = { ...node, name: event.target.value };
    this.setState({
      ...this.state,
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        newNode,
        getNodeKey: this.getNodeKey,
      }),
    });
  }
  handleKeyInNodeEditing(event, node, path) {
    // console.log("keyInNodeEditing");
    // console.log(node.id);
    // console.log(this[`ref-en-${node.id}`]);
    if (event.keyCode === 27) {
      // console.log(this.treeRef.current);
      // this.treeRef.current.focus();
      event.target.blur();
      this.treeRef.current.tabIndex = -1;
      this.treeRef.current.focus();
    }
  }

  findNextRowInfo(rowInfo, delta = 1) {
    // console.log(rowInfo);
    /*
      rowInfo -----
      isSearchFocus: false
      isSearchMatch: false
      lowerSiblingCounts: [0]
      node: {id: "b002", name: "Regional Manager", expanded: true, type: "typeB", starts_with: "simple", …}
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
    // console.log(next);
    /**
     * {node: {…}, lowerSiblingCounts: Array(1), path: Array(1)}
     */
    return next;
  }

  findById(nodeId) {
    const re = find({
      treeData: this.state.treeData,
      searchMethod: (node) => node.id === nodeId,
      getNodeKey: this.getNodeKey,
    });
    console.log(re);
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
  isParent(spath, ppath) {
    return (
      spath.length === ppath.length + 1 &&
      equalsStringArray(spath.slice(0, ppath.length))
    );
  }
  handleGeneralKeyDown(event) {
    // console.log("handleGeneralKeyDown");
    // console.log(event);
    if (event.key === "ArrowDown") {
      this.gotoSelectDelta();
    }
    if (event.key === "ArrowUp") {
      this.gotoSelectDelta(-1);
    }

    if (event.key === " ") {
      //FIXME 不是所有情况都要prevent， 造成了空格键无法在编辑时使用。
      // event.preventDefault();
      this.focusSelectedNode();
    }
    if (event.key === "Enter") {
      //生成兄弟。
      const id = uuid();
      const re = insertNode({
        treeData: this.state.treeData,
        depth: this.rowInfo.path.length - 1,
        minimumTreeIndex: this.rowInfo.treeIndex + 1,
        newNode: { id, name: `${id.slice(0, 4)} ${momentString()}` },
        getNodeKey: this.getNodeKey,
      });
      this.setState({ ...this.state, treeData: re.treeData });
      this.selectNodeAsync(id);
    }
    if (event.key === "Tab") {
      event.preventDefault();
      //NOTE depth = path.length-1
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
        depth: nowDepth + 1,
        minimumTreeIndex: nowIndex,
        newNode,
        getNodeKey: this.getNodeKey,
        expandParent:true
      });
      this.setState({ ...this.state, treeData: re.treeData });
      this.selectNodeAsync(thisNode.id);
    }
    if (event.shiftKey && event.key === "Tab") {
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
        depth: nowDepth - 1,
        minimumTreeIndex: nowIndex,
        newNode,
        getNodeKey: this.getNodeKey,
        expandParent: true,
      });
      this.setState({ ...this.state, treeData: re.treeData });
      this.selectNodeAsync(thisNode.id);
    }
  }

  render() {
    return (
      <div
        ref={this.treeRef}
        onKeyDown={(event) => this.handleGeneralKeyDown(event)}
      >
        <div style={{ height: 700 }}>
          <SortableTree
            treeData={this.state.treeData}
            getNodeKey={this.getNodeKey}
            onChange={(treeData) => this.setState({ ...this.state, treeData })}
            generateNodeProps={(rowInfo) => {
              const { node, path } = rowInfo;
              let nodeProps = {
                onClick: (event) => this.handleNodeClicked(event, rowInfo),
                // onFocus: (event) => console.log("on focus"),
                title: (
                  <EditableNode
                    title={node.name}
                    onKeyDown={(event) =>
                      this.handleKeyInNodeEditing(event, node, path)
                    }
                    innerRef={(en) => (this[`ref-en-${node.id}`] = en)}
                    onChange={(event) =>
                      this.handleNodeTitleChanged(event, node, path)
                    }
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
