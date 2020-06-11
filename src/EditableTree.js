import React, { Component } from "react";
import SortableTree, {
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  find,
} from "react-sortable-tree";
import { EditableNode } from "./EditableNode";
import { data } from "./data";
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
  selectNode(rowInfo) {
    this.setState({ ...this.state, selectedNodeId: rowInfo.node.id });
  }
  focusNode(){
    const ref = this[`ref-en-${this.state.selectedNodeId}`];
    if(ref){
      ref.focus()
    }
  }
  handleNodeClicked(event, rowInfo) {
    if (
      event.target.className.includes("collapseButton") ||
      event.target.className.includes("expandButton")
    ) {
    } else {
      this.selectNode(rowInfo);
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
  //return rowInfo
  findNextRowInfo(rowInfo, delta = 1) {
    const { treeIndex } = rowInfo;
    const next = getVisibleNodeInfoAtIndex({
      treeData: this.state.treeData,
      index: treeIndex + delta,
      getNodeKey: this.getNodeKey,
    });
    console.log(next);
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
        this.selectNode(newInfo);
      }
    }
  }
  handleGeneralKeyDown(event) {
    // console.log("handleGeneralKeyDown");
    // console.log(event);
    if (event.keyCode === 40) {
      this.gotoSelectDelta();
    }
    if (event.keyCode === 38) {
      this.gotoSelectDelta(-1);
    }

    if(event.keyCode===32){
     this.focusNode()
    }
  }

  render() {
    return (
      <div
        ref={this.treeRef}
        onKeyDown={(event) => this.handleGeneralKeyDown(event)}
      >
        <div style={{ height: 500 }}>
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
              };
              if (this.state.selectedNodeId === rowInfo.node.id) {
                this.rowInfo = rowInfo;
                nodeProps.className = "selected-node";
              }
              return nodeProps;
            }}
          />
        </div>
      </div>
    );
  }
}
