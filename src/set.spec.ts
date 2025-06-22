import { test } from "vitest";
import { StyleSet } from "./set";

test("defaults", () => {
  const styleset = new StyleSet({
    sm: {
      root: {
        outline: [
          "border",
          "border-[color:var(--color-invert-light,theme(colors.gray.900))]",
          "dark:border-[color:var(--color-invert-dark,var(--border))]",
          "rounded-md",
        ],
      },
    },
  });
  console.log(styleset.search("sm.root.outline"));
  // expect(styleset.packages.get("sm").compile("root")).toHaveLength(1);

  // expect(styleset.packages.get("outline").compile()).toBe("");
  // expect(styleset.packages.get("outline").compile("")).toBe("");
  // expect(styleset.packages.get("outline").compile("border")).toBe("small");
  // expect(styleset.packages.get("outline").compile("border", "")).toBe("small");
  // expect(styleset.packages.get("outline").compile("border", "spacing")).toBe(
  //   "small custom"
  // );
  // expect(
  //   styleset.packages.get("outline").compile("border.sm", "spacing.bad")
  // ).toBe("small custom");

  // expect(styleset.compile()).toBe("small custom");
  // expect(styleset.compile({ outline: { exists: "foo" } })).toBe("small");
  // expect(styleset.compile({ outline: { bad: "404" } })).toBe("");
  // expect(styleset.compile({ outline: null })).toBe("custom");
  // expect(styleset.compile({ outline: { doesNotExist: null } })).toBe("");
  // expect(styleset.compile({ outline: { doesNotExist: "foo" } })).toBe("custom");
});

// test("defaults", () => {
//   const styleset = new StyleSet({
//     outline: {
//       border: {
//         sm: ["a", "b"],
//         default: "sm",
//       },
//       spacing: {
//         sm: "foo bar",
//         default: "c d",
//       },
//     },
//   });

//   expect(
//     styleset.packages.get("outline").compile("border", "spacing")
//   ).toHaveLength(2);
//   expect(
//     styleset.packages.get("outline").compile("border", "spacing").toString()
//   ).toBe("a b c d");
//   // expect(styleset.packages.get("outline").compile()).toBe("");
//   // expect(styleset.packages.get("outline").compile("")).toBe("");
//   // expect(styleset.packages.get("outline").compile("border")).toBe("small");
//   // expect(styleset.packages.get("outline").compile("border", "")).toBe("small");
//   // expect(styleset.packages.get("outline").compile("border", "spacing")).toBe(
//   //   "small custom"
//   // );
//   // expect(
//   //   styleset.packages.get("outline").compile("border.sm", "spacing.bad")
//   // ).toBe("small custom");

//   // expect(styleset.compile()).toBe("small custom");
//   // expect(styleset.compile({ outline: { exists: "foo" } })).toBe("small");
//   // expect(styleset.compile({ outline: { bad: "404" } })).toBe("");
//   // expect(styleset.compile({ outline: null })).toBe("custom");
//   // expect(styleset.compile({ outline: { doesNotExist: null } })).toBe("");
//   // expect(styleset.compile({ outline: { doesNotExist: "foo" } })).toBe("custom");
// });
