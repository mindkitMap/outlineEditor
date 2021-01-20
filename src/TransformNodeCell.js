import React from "react";
import TransformEdit from "./TransformEdit";
export const defaultNodeCell = (rowInfo, treeInstance, props) => {
  const { node, path } = rowInfo;
  return (
    <TransformEdit
      trigger={props.trigger}
      transform={props.transform}
      key={`ce-${node.id}`}
      className="node-text"
      value={node}
      onFocus={(ev) => {
        treeInstance.handleNodeTextFocus(ev, node.id);
      }}
      onBlur={(ev) => {
        treeInstance.handleNodeTextFocus(ev, node.id, false);
      }}
      ref={(en) => (treeInstance[`ref-en-${node.id}`] = en)}
      onChange={(event, model) => {
        treeInstance.handleNodeTitleChanged(event, node, path, model.text);
      }}
    />
  );
};
