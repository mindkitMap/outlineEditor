import React, { Component } from "react";
import ContentEditable from "../dist/ContentEditable";
import { action } from "@storybook/addon-actions";

export default class ProgrammingFocus extends Component {
  render() {
    return (
      <>
        <ContentEditable
          key="a"
          html={"a text"}
          onChange={action("a change")}
          onBlur={action("a blur")}
          onFocus={action("a focus")}
          innerRef={(r) => {
            this.refA = r;
          }}
        />
        <ContentEditable
          key="b"
          html={"b text"}
          onChange={action("b change")}
          onBlur={action("b blur")}
          onFocus={action("b focus")}
          innerRef={(r) => {
            this.refB = r;
          }}
        />
        <button
          onClick={() => {
            this.refA.blur();
            this.refB.focus();
          }}
        >
          to B
        </button>
      </>
    );
  }
}
