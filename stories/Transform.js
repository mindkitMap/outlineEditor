import { createElement } from "react";

export const transform = (text) => `--- ${text} ---`;

export const tagTransform = (text) => {
  const tag = /\#(\S+?)\s+?/g;
  const arry = text.split(tag);
  const string = arry.map((p) => p).join("__");
  console.log(arry);
  const re = createElement("div", { children: string });
  return re;
};
