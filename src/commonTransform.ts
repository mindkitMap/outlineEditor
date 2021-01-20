interface ViewModel {
  append(result: ViewModel): ViewModel;
  //   new(input:string): ViewModel
}
export class StringViewModel implements ViewModel {
  constructor(public raw: string) {}

  append(result: ViewModel): ViewModel {
    if (result instanceof StringViewModel) {
      return new StringViewModel(this.raw + result.raw);
    }
    fail("only string transform result supported");
  }
}

export interface Transformer {
  regexp: RegExp;
  fun(input: RegExpMatchArray): ViewModel;
}

export const tagTransformer: Transformer = {
  regexp: /(\s+?|^)#(\S+?)(\s+|$)/,
  fun: (matchResult) => {
     return new StringViewModel(
       `${matchResult[1]}${wrap(
         `#${matchResult[2]}`
         )}${matchResult[3]}`
     );
  },
};

export const topicTransformer: Transformer = {
  regexp: /(\s+?|^)\[\[(\S+?)\]\](\s+|$)/,
  fun: (matchResult) => {
    return new StringViewModel(
      `${matchResult[1]}${wrap(
        `[[${matchResult[2]}]]`
        )}${matchResult[3]}`
    );
  },
};

export const refTransformer: Transformer = {
  regexp: /(\s+?|^)\(\((\S+?)\)\)(\s+|$)/,
  fun: (matchResult) => {
    return new StringViewModel(
      `${matchResult[1]}${wrap(
        `((${matchResult[2]}))`
        )}${matchResult[3]}`
    );
  },
};
function wrap(text: string, uri: string = "") {
  return `<button data-event=true data-uri=${uri}>${text}</button>`;
}


export function transformForTransformer(
  input: string,
  transformer: Transformer
): ViewModel {
  let result: ViewModel = new StringViewModel("");
  const matchResult = input.match(transformer.regexp);
  if (matchResult) {
    result = result
      .append(new StringViewModel(input.substr(0, matchResult.index)))
      .append(transformer.fun(matchResult))
      .append(
        transformForTransformer(
          input.substr(matchResult.index! + matchResult[0].length),
          transformer
        )
      );
  } else {
    result = new StringViewModel(input);
  }
  return result;
}

export function transform(
  input: string,
  transformers: Transformer[]
) {
  let re = input;
  transformers.forEach((tran) => {
    re = (transformForTransformer(re, tran) as StringViewModel).raw;
  });
  return re;
}

