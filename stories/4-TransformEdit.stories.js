import React, { Component } from "react";
import TransformEdit from "../dist/TransformEdit";

import { action } from "@storybook/addon-actions";

import TransformWithTree from './TransformWithTree'


export default {
  title: "TransformEdit",
  component: TransformEdit,
};

export const Default = () => (
  <>
    <div>
      <TransformEdit value={"hello"} transform={(text) => `--- ${text} ---`} />
    </div>
    <div>
      <TransformEdit value={"hello"} transform={(text) => `--- ${text} ---`} />
    </div>
  </>
);

class FocusStory extends Component {
  onClick = (e) => {
    this.rA?.focus();
  };
  onClickB = (e) => {
    this.rB?.focus();
  };
  onClickC = (e) => {
    this.rA?.blur();
    this.rB?.blur();
  };
  render() {
    return (
      <>
        <div>
          <TransformEdit
            onChange={action("a change")}
            onFocus={action("a focus")}
            onBlur={action("a blur")}
            ref={(r) => (this.rA = r)}
            value={"hello A"}
            transform={(text) => `--- ${text} ---`}
          />
        </div>
        <div>
          <TransformEdit
            onChange={action("b change")}
            onFocus={action("b focus")}
            onBlur={action("b blur")}
            ref={(r) => (this.rB = r)}
            value={"hello B"}
            transform={(text) => `--- ${text} ---`}
          />
        </div>
        <button onClick={(e) => this.onClick(e)}>Focus to A</button>
        <button onClick={(e) => this.onClickB(e)}>Focus to B</button>
        <button onClick={(e) => this.onClickC(e)}>Blur A and B</button>
      </>
    );
  }
}

export const Focus = () => <FocusStory />;

export const KeyDown = () => (
         <TransformEdit
           onChange={action("b change")}
           onKeyDown={action("b keydown")}
           onFocus={action("b focus")}
           onBlur={action("b blur")}
           value={"hello B"}
           transform={(text) => `--- ${text} ---`}
         />
       );
export const WithTree =()=> <TransformWithTree/>