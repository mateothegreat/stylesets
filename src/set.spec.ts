import { describe, expect, test } from "vitest";
import { VariantSet } from "./set";

const variants = new VariantSet({
  outline: {
    withDefault: {
      sm: "small",
      default: "small"
    },
    withoutDefault: {
      sm: "small"
    },
    arrayWithDefault: {
      sm: ["small", "medium"],
      default: "small"
    },
    arrayWithoutDefault: {
      sm: ["small", "medium"]
    }
  }
});

describe.each([
  // Ensure that the default key is used if not specified:
  { args: { outline: { withDefault: "sm", withoutDefault: "sm" } }, expected: "small small" },
  // Ensure that default is used when not specified:
  { args: { outline: { withDefault: "sm" } }, expected: "small" },
  // Ensure that array values are joined with a space:
  { args: { outline: { arrayWithDefault: "sm" } }, expected: "small medium" },
  // Ensure that array values are joined with a space:
  { args: { outline: { arrayWithoutDefault: "sm" } }, expected: "small medium" }
])("Package.compile($args) => $expected", ({ args, expected }) => {
  test("compile", () => {
    expect(variants.compile(args)).toBe(expected);
  });
});
