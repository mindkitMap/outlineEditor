import React from "react";

export const asFormField = (editor) => (props) =>
  React.cloneElement(editor, {
    onDataChange: props.input.onChange,
    onBlur: props.input.onBlur,
    onFocus: props.input.onFocus,
    treeData: props.input.value,
  });
