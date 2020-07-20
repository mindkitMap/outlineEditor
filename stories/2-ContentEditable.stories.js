import React from "react";
import ContentEditable from "../dist/ContentEditable";
import ProgrammingFocus from './ProgrammingFocus'
import { action } from "@storybook/addon-actions";
import ProgrammingTexting from "./ProgrammingTexting";
import Transform from "./Transform";

import  './index.css'

export default {
  title: "ContentEditable",
  component: ContentEditable,
};

export const Default = () => (
  <>
    <ContentEditable key='a'
      html={"a text"}
      onChange={action("a change")}
      onBlur={action("a blur")}
      onFocus={action("a focus")}
    />
    <ContentEditable key='b'
      html={"b text"}
      onChange={action("b change")}
      onBlur={action("b blur")}
      onFocus={action("b focus")}
    />
  </>
);


//TODO 在storybook里面有问题，会失去响应，但不一定在外面有问题。
// export const FocusContainer = () => (
//   <>
//     <FocusContainer onBlur={action("c blur")} onFocus={action("c focus")}>
//       <div>
//         <ContentEditable html={"a text"} onChange={action("a change")} />
//         <ContentEditable html={"b text"} onChange={action("b change")} />
//       </div>
//     </FocusContainer>
//     <ContentEditable
//       html={"outter text"}
//       onChange={action("d change")}
//       onBlur={action("d blur")}
//       onFocus={action("d focus")}
//     />
//   </>
// );




export const ProgrammingFocusStory=()=> (<ProgrammingFocus/>)
export const ProgrammingTextingStory=()=> (<ProgrammingTexting/>)
export const TransformStory=()=> (<Transform/>)