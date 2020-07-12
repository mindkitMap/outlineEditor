import React from "react";
import { asFormField } from "./AsFormField";
import FocusContainer from "./FocusContainer";
import { EditableTree } from "./EditableTree";

const Editor = asFormField(
  <FocusContainer>
    <EditableTree />
  </FocusContainer>
);

export default Editor;
