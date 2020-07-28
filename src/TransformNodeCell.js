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
      value={node.text}
      onFocus={(ev) => {
        treeInstance.handleNodeTextFocus(ev, node.id);
      }}
      onBlur={(ev) => {
        // this.handleNodeTitleChanged(
        //   ev,
        //   node,
        //   path,
        //   //MARK 这里可能要改，innerText可能不等于纯node.text，innerText可能等于text->html之后的那个text。
        //   ev.target.value
        // );
        console.log("in onB handler of ce");
        treeInstance.handleNodeTextFocus(ev, node.id, false);
        // ev.stopPropagation();
      }}
      ref={(en) => (treeInstance[`ref-en-${node.id}`] = en)}
      onChange={(event) => {
        // console.log("on content change");
        // console.log(event)
        console.log("in onC handler of ce");

        treeInstance.handleNodeTitleChanged(
          event,
          node,
          path,
          event.target.value
        );
      }}
    />
  );
};
