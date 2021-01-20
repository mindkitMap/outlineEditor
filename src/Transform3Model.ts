/**
* Transform 是在三个状态之间转换，model、inputting、view
* 接口规定了三个状态之间转换的变换函数。
 */

import { Node } from "./Model";
import { deepMerge } from "./Util";
interface Transform3Model {
  toInputting(node: Node): string;
  fromInputting(text: string, oldNode: Node): Node;
  toView(node: Node): any;
}
export function fromOneFunction(fun: (string) => any): Transform3Model {
  return {
    toInputting: (node: Node) => {
      return node.text;
    },
    fromInputting: (text: string, oldNode: Node) => {
      // console.log('old',oldNode)
      const re= deepMerge(oldNode, { text });
      // console.log('re',re)
      return re
    },
    toView: (node: Node) => {
      return fun(node.text);
    },
  };
}
