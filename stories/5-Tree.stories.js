import React, { Component } from "react";
import EditableTree from "../dist/EditableTree";

import { action } from "@storybook/addon-actions";
import { data } from "./data";
import { trigger } from "./trigger";
import {transform} from "./transform";

export default {
  title: "EditableTree",
  component: EditableTree,
};

export const Default = () => (
  <EditableTree
    value={data}
    onChange={action("tree change")}
    trigger={trigger}
    transform={transform}
  />
);
