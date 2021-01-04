import React, { Component } from "react";
import EditableTree from "../dist/EditableTree";
import { Form, Field,FormSpy } from "react-final-form";

import { action } from "@storybook/addon-actions";
import { data } from "./data";
import { trigger } from "./trigger";
import { transform } from "./transform";
import { flatDataFromTree, toSimpleNode } from "../dist/ModelHelper";
export default {
  title: "EditableTreeWithFinalForm",
  component: EditableTree,
};

function actionOnChange(event) {
  action("submit")(event);
}

export const WithFinalForm = () => (
  <Form onSubmit={actionOnChange} initialValues={{ tree: data }}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit!</button>

        <Field name="tree">
          {({ input }) => (
            <EditableTree
              value={input.value}
              onChange={({ treeData }) => input.onChange(treeData)}
              trigger={trigger}
              transform={transform}
            />
          )}
        </Field>
        <FormSpy
          subscription={{ values: true }}
          onChange={(props) => {
            action('value changed')(props.values)
          }}
        />
      </form>
    )}
  </Form>
);
