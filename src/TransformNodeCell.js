import React from "react";
import TransformEdit from "./TransformEdit";
export const defaultNodeCell = (rowInfo, treeInstance) => {
  const { node, path } = rowInfo;
  return (
    <TransformEdit
      key={`ce-${node.id}`}
      className="node-text"
      value={node.text}
      onFocus={(ev) => {
        treeInstance.handleNodeTextFocus(ev, node.id);
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
