import React, { Component } from "react";
import ContentEditable from "../dist/ContentEditable";
import { action } from "@storybook/addon-actions";

export default class ProgrammingTransform extends Component {
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
          transform = {(html)=>{
            console.log('in transform')
            return  html+'kk'
          }
            }
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
      </>
    );
  }
}
