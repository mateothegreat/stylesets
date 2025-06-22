/**
 * `VariantValue` represents a single value of an individual variant.
 *
 * @example
 * The following are valid `VariantValue`s:
 *
 * ```ts
 * const variantValue = "p-4 m-4";
 * ```
 *
 * ```ts
 * const variantValue = ["p-4", "m-4"];
 * ```
 *
 * When `compile` is called, the `VariantValue` is returned as a string
 * containing all of the values separated by a space ("p-4 m-4").
 *
 */
export type VariantValue = string | string[];

/**
 * A Variant is a single variant of a package.
 *
 * @example
 *
 * ```ts
 * const variant = new Variant({
 *   value: "p-4",
 *   default: "sm"
 * });
 *
 * variant.compile();
 * ```
 */
export class Variant extends Map<string, VariantValue> {
  constructor(obj: Record<string, VariantValue>) {
    super();
    for (const key in obj) {
      this.set(key, obj[key]);
    }
  }

  compile(key?: string): string {
    if (key) {
      const value = this.get(key);
      if (value) {
        if (Array.isArray(value)) {
          return value.join(" ");
        }
        return value;
      }
    }

    if (this.has("default")) {
      const value = this.get("default");
      if (Array.isArray(value)) {
        return value.join(" ");
      }
      return value;
    }
  }
}
