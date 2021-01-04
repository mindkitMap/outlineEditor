import { getFlatDataFromTree } from "react-sortable-tree";

export function toSimpleNode(nodeInfo, index) {
  return {
    id: nodeInfo.node.id,
    text: nodeInfo.node.text,
    view: { expanded: nodeInfo.node.expanded ?? false },
    path: nodeInfo.path,
    index,
  };
}
export function flatDataFromTree(treeData) {
  return getFlatDataFromTree({
    treeData,
    getNodeKey: getNodeKey,
    ignoreCollapsed: false,
  });
}

function getNodeKey({ node }) {
  return node.id;
}
