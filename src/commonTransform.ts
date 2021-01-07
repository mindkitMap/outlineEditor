import { wrap } from "lodash";

interface TransformResult {
  append(result: TransformResult): TransformResult;
  //   new(input:string):TransformResult
}
export class StringTransformResult implements TransformResult {
  constructor(public raw: string) {}

  append(result: TransformResult): TransformResult {
    if (result instanceof StringTransformResult) {
      return new StringTransformResult(this.raw + result.raw);
    }
    fail("only string transform result supported");
  }
}

interface Transformer {
  regexp: RegExp;
  fun(input: RegExpMatchArray): TransformResult;
}

const tagTransformer: Transformer = {
  regexp: /(\s+?|^)#(\S+?)(\s+|$)/,
  fun: (matchResult) => {
    return new StringTransformResult(
      matchResult[1] +
        "--<button>" +
        matchResult[2] +
        "</button>--" +
        matchResult[3]
    );
  },
};
const topicTransformer: Transformer = {
  regexp: /(\s+?|^)\[\[(.+)\]\](\s+|$)/,
  fun: (matchResult) => {
    return new StringTransformResult(
      matchResult[1] +
        "((<button data-event=true>" +
        matchResult[2] +
        "</button>))" +
        matchResult[3]
    );
  },
};

export function transformF(
  input: string,
  transformer: Transformer
): TransformResult {
  let result: TransformResult = new StringTransformResult("");
  const matchResult = input.match(transformer.regexp);
  if (matchResult) {
    //   console.log(matchResult)
    //   console.log(matchResult.index)
    result = result
      .append(new StringTransformResult(input.substr(0, matchResult.index)))
      .append(transformer.fun(matchResult))
      .append(
        transformF(
          input.substr(matchResult.index! + matchResult[0].length),
          transformer
        )
      );
  } else {
    result = new StringTransformResult(input);
  }
  return result;
}

export function transform(input: string) {
  return transformF(
    (transformF(input, tagTransformer) as StringTransformResult).raw,
    topicTransformer
  );
  // return transformF(input,topicTransformer)
}
