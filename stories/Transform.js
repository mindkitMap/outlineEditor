import { createElement } from "react";
import {transform} from '../dist/commonTransform'
// export const transform = (text) => `--- ${text} ---`;

export const tagTransform = (text,transformers) => {
  const string= transform(text,transformers)
  const re = createElement("div", { dangerouslySetInnerHTML:{__html: string }});
  return re;
};


