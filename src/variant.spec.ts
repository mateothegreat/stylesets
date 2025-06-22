import { expect, test } from "vitest";
import { Variant } from "./variant";

test("Variant", () => {
  const variant = new Variant({
    sm: "p-4",
    md: "p-8",
    lg: "p-12"
  });

  expect(variant.compile("sm")).toBe("p-4");
  expect(variant.compile("md")).toBe("p-8");
  expect(variant.compile("lg")).toBe("p-12");
});
