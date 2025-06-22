import { describe, expect, test } from "vitest";
import { Package } from "./package";

const variants = new Package({
  withDefault: {
    sm: "small",
    default: "sm"
  },
  withoutDefault: {
    sm: "small"
  },
  arrayWithDefault: {
    sm: ["small", "medium"],
    default: "sm"
  },
  arrayWithoutDefault: {
    sm: ["small", "medium"]
  }
});

describe.each([
  // Ensure that the default key is used if not specified:
  { args: { withDefault: "sm", withoutDefault: "sm" }, expected: "small small" },
  // Ensure that default is used when not specified:
  { args: { withDefault: "sm" }, expected: "small" },
  // Ensure that array values are joined with a space:
  { args: { arrayWithDefault: "sm" }, expected: "small medium" },
  // Ensure that array values are joined with a space:
  { args: { arrayWithoutDefault: "sm" }, expected: "small medium" }
])("Package.compile($args) => $expected", ({ args, expected }) => {
  test("compile", () => {
    expect(variants.compile(args)).toBe(expected);
  });
});
