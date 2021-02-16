import React, { Component } from "react";
import EditableTree from "../dist/EditableTree";
import { Form, Field, FormSpy } from "react-final-form";

import { action } from "@storybook/addon-actions";
import { data } from "./data";
import { trigger } from "./trigger";
import { tagTransform } from "./Transform";
import {
  tagTransformer,
  refTransformer,
  topicTransformer,
} from "../dist/commonTransform";

import  Debugging from "../dist/Debugging";

export default {
  title: "EditableTree",
  component: EditableTree,
};

function actionOnChange(event) {
  const { treeData, isComposing } = event;
  if (isComposing) return;
  action("value changed")(treeData);
}

const transformers = [tagTransformer, topicTransformer, refTransformer];
export const Default = () => (
  <EditableTree
    value={data}
    onChange={actionOnChange}
    onSelected={action("selectNode")}
    trigger={trigger}
    transform={(t) => tagTransform(t, transformers)}
  />
);
export const WithRichTransform = () => (
  <EditableTree
    value={data}
    onChange={actionOnChange}
    onSelected={action("selectNode")}
    trigger={trigger}
    transform={(t) => tagTransform(t, transformers)}
  />
);
export const WithDynamicEvent = () => (
  <Debugging.Provider value={{ editing: true }}>
    <EditableTree
      value={data}
      onChange={actionOnChange}
      onSelected={action("selectNode")}
      onClick={action("clickedNestComponent")}
      trigger={trigger}
      transform={(t) => tagTransform(t, transformers)}
    />
  </Debugging.Provider>
);


