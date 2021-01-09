/**
 * TODO 
 * transformer 有两个， 一个是inputing to model，一个是 model to view
 * 
 */
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
      `${matchResult[1]}--${wrap(matchResult[2])}--${matchResult[3]}`
    );
  },
};
const tagTestTransformer: Transformer = {
  regexp: /(\s+?|^)#(\S+?)(\s+|$)/,
  fun: (matchResult) => {
    return new StringTransformResult(
      `${matchResult[1]}--${matchResult[2]}--${matchResult[3]}`
    );
  },
};
const topicTransformer: Transformer = {
  regexp: /(\s+?|^)\[\[(.+)\]\](\s+|$)/,
  fun: (matchResult) => {
    return new StringTransformResult(
      `${matchResult[1]}((${wrap(matchResult[2])}))${matchResult[3]}`
    );
  },
};
function wrap(text: string, uri: string = "") {
  return `<button data-event=true data-uri=${uri}>${text}</button>`;
}
const topicTestTransformer: Transformer = {
  regexp: /(\s+?|^)\[\[(.+)\]\](\s+|$)/,
  fun: (matchResult) => {
    return new StringTransformResult(
      `${matchResult[1]}((${matchResult[2]}))${matchResult[3]}`
    );
  },
};

export function transformForTransformer(
  input: string,
  transformer: Transformer
): TransformResult {
  let result: TransformResult = new StringTransformResult("");
  const matchResult = input.match(transformer.regexp);
  if (matchResult) {
    result = result
      .append(new StringTransformResult(input.substr(0, matchResult.index)))
      .append(transformer.fun(matchResult))
      .append(
        transformForTransformer(
          input.substr(matchResult.index! + matchResult[0].length),
          transformer
        )
      );
  } else {
    result = new StringTransformResult(input);
  }
  return result;
}

export function transform(input: string,transformers:Transformer[]= [tagTransformer, topicTransformer]) {
  let re = input;
  transformers.forEach((tran) => {
    re = (transformForTransformer(re, tran) as StringTransformResult).raw;
  });
  return re;
}
export function testTransform(input: string) {
  return transform(input,[tagTestTransformer,topicTestTransformer])
}
