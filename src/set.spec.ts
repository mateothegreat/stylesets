import { describe, expect, test } from "vitest";
import { StyleSet } from "./set";
import type { Schema } from "./types/types";

const schema: Schema<
  [
    {
      name: "size";
      values: readonly ["sm", "md", "lg"];
      required: true;
    }
  ]
> = {
  fields: [
    {
      name: "size",
      values: ["sm", "md", "lg"],
      required: true
    }
  ]
};

const styleset = new StyleSet(schema, {
  globals: {
    size: {
      values: ["sm", "md", "lg"]
    }
  },
  packageOne: {
    variantA: {
      variation1: ["a", "b"],
      variation2: "c"
    },
    variantB: {
      variation2: "d",
      variation3: ["e"]
    }
  },
  packageTwo: {
    variantA: {
      variation3: ["f", "g", "h"],
      variation4: "i"
    }
  }
});

describe.each([
  {
    args: "packageOne.variantA.variation1",
    expected: "a b"
  },
  {
    args: "packageOne.variantA.*",
    expected: "a b c d e"
  },
  {
    args: "packageOne.variantA.variation2",
    expected: "c"
  }
])("StyleSet.search($args) => $expected", ({ args, expected }) => {
  test("search", () => {
    expect(styleset.search(args)?.toString()).toBe(expected);
  });
});
