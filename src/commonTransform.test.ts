import { testTransform as transform  } from "./commonTransform";

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
