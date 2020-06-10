import React, { Component } from "react";
import SortableTree, { changeNodeAtPath } from "react-sortable-tree";
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
  nodeClicked(event, rowInfo) {
    if (
      event.target.className.includes("collapseButton") ||
      event.target.className.includes("expandButton")
    ) {
      // ignore the event
    } else {
      console.log(event);
      console.log("clicked");
      console.log(rowInfo.node.id);
      console.log(event.target);
      event.target.focus();
      this.setState({ ...this.state, selectedNodeId: rowInfo.node.id });
    }
  }

  getNodeKey({ node }) {
    return node.id;
  }
  nodeTitleChanged(event, node, path) {
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
  keyInNodeEditing(event, node, path) {
    console.log("keyInNodeEditing");
    console.log(node.id);
    if (event.keyCode === 27) {
      // console.log(this.treeRef.current);
      // this.treeRef.current.focus();
      event.target.blur();
      console.log(document.activeElement);
      this.treeRef.current.tabIndex = -1;
      this.treeRef.current.focus();
      console.log(document.activeElement);
    }
  }

  handleGeneralKeyDown(event) {
    console.log("handleGeneralKeyDown");
    console.log(event);
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
              return {
                onClick: (event) => this.nodeClicked(event, rowInfo),
                onFocus: (event) => console.log("on focus"),
                title: (
                  <EditableNode
                    title={node.name}
                    onKeyDown={(event) =>
                      this.keyInNodeEditing(event, node, path)
                    }
                    onBlur={(event) => {
                      console.log("on blur");
                      console.log(event.target);
                      console.log(event.relatedTarget);
                    }}
                    onChange={(event) =>
                      this.nodeTitleChanged(event, node, path)
                    }
                  />
                ),
              };
            }}
          />
        </div>
      </div>
    );
  }
}
