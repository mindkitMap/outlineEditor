import React from "react";
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
import Debugging from "../dist/Debugging";

export default {
  title: "EditableTreeWithFinalForm",
  component: EditableTree,
};

const transformers = [tagTransformer, topicTransformer, refTransformer];

function actionOnChange(event) {
  action("submit")(event);
}

export const WithFinalForm = () => (
  <Form onSubmit={actionOnChange} initialValues={{ tree: data }}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit!</button>
        <Field name="text" component="input" />
        <Field name="tree">
          {({ input }) => (
            <EditableTree
              value={input.value}
              onChange={({ treeData }) => input.onChange(treeData)}
              trigger={trigger}
              transform={(t) => tagTransform(t, transformers)}
            />
          )}
        </Field>
        <FormSpy
          subscription={{ values: true }}
          onChange={(props) => {
            action("value changed")(props.values);
          }}
        />
      </form>
    )}
  </Form>
);
