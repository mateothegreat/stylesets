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

export class VariantResult {
  public value: VariantValue;

  constructor(value: VariantValue) {
    if (Array.isArray(value)) {
      this.value = value;
    } else {
      this.value = value.split(" ");
    }
  }

  get length() {
    if (Array.isArray(this.value)) {
      return this.value.length;
    }
    return 1;
  }

  toString() {
    if (Array.isArray(this.value)) {
      return this.value.join(" ");
    }
    return this.value;
  }
}
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
export class Variant {
  children = new Map<string, VariantValue>();

  constructor(obj: Record<string, VariantValue>) {
    for (const key in obj) {
      this.children.set(key, obj[key]);
    }
  }

  compile(key?: string): VariantResult {
    /**
     * `key` did not reference a valid variant, so we need to check if we
     * can use a default.
     */
    if (this.children.has("default")) {
      const value = this.children.get("default");

      /**
       * The default value is a string, but it may be a key to another variant.
       *
       * If it is, we need to return the value of that variant.
       * If it is not, we need to return the value of the default variant.
       */
      if (typeof value === "string") {
        if (this.children.has(value)) {
          return new VariantResult(this.children.get(value));
        }

        /**
         * The default value does not reference another variant,
         * so we can return it directly.
         */
        return new VariantResult(value);
      }
    }
  }
}
