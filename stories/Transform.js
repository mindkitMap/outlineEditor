import { createElement } from "react";
import {transform} from '../dist/commonTransform'
// export const transform = (text) => `--- ${text} ---`;

export const tagTransform = (text) => {
  const string= transform(text).raw
  const re = createElement("div", { dangerouslySetInnerHTML:{__html: string }});
  return re;
};


export const tagWithEventTransform = (text) => {
   const string = transform(text).raw;
  const re = createElement("div", {
    dangerouslySetInnerHTML: { __html: string },
  });
  return re;
};
