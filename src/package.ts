import { identify } from "./util";
import { Variant, VariantResult, type VariantValue } from "./variant";

/**
 * A Package is a collection of variants.
 *
 * @example
 *
 * ```ts
 * const package = new Package({
 *   padding: {
 *     sm: "p-1.5",
 *     md: "p-4",
 *     lg: "p-6",
 *     default: "sm"
 *   },
 *   spacing: {
 *     sm: "gap-1.5",
 *     md: "gap-4",
 *     lg: "gap-6",
 *     default: "sm"
 *   }
 * });
 *
 * // Returns the string "p-4 gap-1.5" (default values are used):
 * package.compile({ padding: "md" });
 *
 * // Returns the string "p-1.5 gap-1.5":
 * package.compile({ padding: "sm", spacing: "sm" });
 * ```
 */
export class Package<
  T extends Record<string, Record<string, VariantValue>> = Record<string, Record<string, VariantValue>>
> {
  variants: Map<string, Variant>;

  constructor(v: T) {
    this.variants = new Map<string, Variant>();
    for (const key in v) {
      this.variants.set(key, new Variant(v[key]));
    }
  }

  /**
   * Helper method to check if a variant matches a given name.
   */
  #variantMatchesName(variant: Variant, name: string): boolean {
    // Customize this based on how your variants store their names
    // This might involve checking keys in the variant's children Map

    // Check if the variant has this key
    if (variant.variants.has(name)) {
      return true;
    }

    // Or check if the variant has a name property
    const variantObj = variant as any;
    if (variantObj.name === name || variantObj.key === name) {
      return true;
    }

    return false;
  }

  search(...identifiers: string[]): VariantResult | null {
    const variations: (string | string[])[] = [];

    for (const identifier of identifiers) {
      const path = identify(identifier);
      const variant = this.variants.get(path.variant);

      if (path.variation === null || path.variation === "*") {
        variations.push(...Array.from(variant.variants.values()).flatMap((v) => v));
        return new VariantResult(variations);
      }

      variations.push(variant.variants.get(path.variation));
    }

    return new VariantResult(variations.flatMap((v) => v));
  }
}

export class PackageResult {
  public value: VariantResult;

  constructor(value: VariantResult) {
    this.value = value;
  }

  get length() {
    if (Array.isArray(this.value)) {
      return this.value.length;
    }
    return 1;
  }

  toString() {
    if (Array.isArray(this.value)) {
      return this.value.flatMap((v) => v.toString()).join(" ");
    }
    return this.value;
  }
}
