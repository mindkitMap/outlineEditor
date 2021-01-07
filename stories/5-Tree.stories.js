import React, { Component } from "react";
import EditableTree from "../dist/EditableTree";

import { action } from "@storybook/addon-actions";
import { data } from "./data";
import { trigger } from "./trigger";
import { transform, tagTransform } from "./transform";
import { flatDataFromTree, toSimpleNode } from "../dist/ModelHelper";
export default {
  title: "EditableTree",
  component: EditableTree,
};

function actionOnChange(event) {
  const { treeData, isComposing } = event;
  if (isComposing) return;
  const newFlat = flatDataFromTree(treeData).map(toSimpleNode);
  action("value changed")(newFlat);
}

export const Default = () => (
  <EditableTree
    value={data}
    onChange={actionOnChange}
    onSelected={(ev) => action("selectNode")(ev)}
    trigger={trigger}
    transform={transform}
  />
);
export const WithRichTransform = () => (
  <EditableTree
    value={data}
    onChange={actionOnChange}
    onSelected={(ev) => action("selectNode")(ev)}
    trigger={trigger}
    transform={tagTransform}
  />
);
export const WithDynamicEvent = () => (
  <EditableTree
    value={data}
    onChange={actionOnChange}
    onSelected={(ev) => action("selectNode")(ev)}
    onClick={action}
    trigger={trigger}
    transform={tagWithEventTransform}
  />
);