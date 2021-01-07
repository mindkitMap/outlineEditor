import { transform, StringTransformResult } from "./commonTransform";

test("one transform", () => {
  const re = transform("#kaka 123") as StringTransformResult;
  expect(re.raw).toEqual("--kaka-- 123");
  const re2 = transform("123 #kaka 123") as StringTransformResult;
  expect(re2.raw).toEqual("123 --kaka-- 123");
});
test("two match", () => {
  const re = transform("#kaka 123 #baba") as StringTransformResult;
  expect(re.raw).toEqual("--kaka-- 123 --baba--");
  const re2 = transform("123 #kaka #baba 123") as StringTransformResult;
  expect(re2.raw).toEqual("123 --kaka-- --baba-- 123");
});
test("with hanzi transform", () => {
  const re = transform("#中文 123 #baba") as StringTransformResult;
  expect(re.raw).toEqual("--中文-- 123 --baba--");
  const re2 = transform("123 #kaka #这个月 123") as StringTransformResult;
  expect(re2.raw).toEqual("123 --kaka-- --这个月-- 123");
});
test("topic", () => {
  const re = transform("123 [[baba]]") as StringTransformResult;
  expect(re.raw).toEqual("123 ((baba))");
});
test("with topic transform", () => {
  const re = transform("#中文 123 [[baba]]") as StringTransformResult;
  expect(re.raw).toEqual("--中文-- 123 ((baba))");
  const re2 = transform(
    "123 [[baba]]  #kaka #这个月 123"
  ) as StringTransformResult;
  expect(re2.raw).toEqual("123 ((baba))  --kaka-- --这个月-- 123");
});

export {};
