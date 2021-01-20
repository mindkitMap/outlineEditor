import {
  StringViewModel,
  topicTransformer,
  tagTransformer,
} from "./commonTransform";
import { Transformer, transform as ot } from "./commonTransform";

export function testTransform(input: string) {
  return ot(input, [tagTestTransformer, topicTestTransformer]);
}
const transform = testTransform;
const topicTestTransformer: Transformer = {
  ...topicTransformer,
  fun: (matchResult) => {
    return new StringViewModel(
      `${matchResult[1]}((${matchResult[2]}))${matchResult[3]}`
    );
  },
};

const tagTestTransformer: Transformer = {
  ...tagTransformer,
  fun: (matchResult) => {
    return new StringViewModel(
      `${matchResult[1]}--${matchResult[2]}--${matchResult[3]}`
    );
  },
};

test("one transform", () => {
  const re = transform("#kaka 123");
  expect(re).toEqual("--kaka-- 123");
  const re2 = transform("123 #kaka 123");
  expect(re2).toEqual("123 --kaka-- 123");
});
test("two match", () => {
  const re = transform("#kaka 123 #baba");
  expect(re).toEqual("--kaka-- 123 --baba--");
  const re2 = transform("123 #kaka #baba 123");
  expect(re2).toEqual("123 --kaka-- --baba-- 123");
});
test("with hanzi transform", () => {
  const re = transform("#中文 123 #baba");
  expect(re).toEqual("--中文-- 123 --baba--");
  const re2 = transform("123 #kaka #这个月 123");
  expect(re2).toEqual("123 --kaka-- --这个月-- 123");
});
test("topic", () => {
  const re = transform("123 [[baba]]");
  expect(re).toEqual("123 ((baba))");
});
test("with topic transform", () => {
  const re = transform("#中文 123 [[baba]]");
  expect(re).toEqual("--中文-- 123 ((baba))");
  const re2 = transform("123 [[baba]]  #kaka #这个月 123");
  expect(re2).toEqual("123 ((baba))  --kaka-- --这个月-- 123");
});

test("with topic transform more than one", () => {
  const re = transform("#中文 123 [[baba]] [[kaka]]");
  expect(re).toEqual("--中文-- 123 ((baba)) ((kaka))");
  const re2 = transform("123 [[baba]]  #kaka #这个月 123 [[中文]]");
  expect(re2).toEqual("123 ((baba))  --kaka-- --这个月-- 123 ((中文))");
});
