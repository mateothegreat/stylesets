import { describe, expect, test } from "vitest";
import { Package } from "./package";

const pkg = new Package({
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
  {
    args: "withDefault",
    expected: "small sm"
  },
  // Ensure that default is used when not specified:
  {
    args: "withDefault.*",
    expected: "small sm"
  },
  {
    args: "withoutDefault",
    expected: "small"
  },
  {
    args: "arrayWithDefault",
    expected: "small medium sm"
  },
  {
    args: "arrayWithDefault.*",
    expected: "small medium sm"
  },
  {
    args: "arrayWithoutDefault",
    expected: "small medium"
  },
  {
    args: "arrayWithoutDefault.bad",
    expected: ""
  },
  {
    args: "arrayWithoutDefault.*",
    expected: "small medium"
  }
])("Package.search($args).toString() => $expected", ({ args, expected }) => {
  test("search", () => {
    expect(pkg.search(args)?.toString()).toBe(expected);
  });
});
