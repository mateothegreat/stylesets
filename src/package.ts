import { HierarchicalContainer } from "@mateothegreat/ts-kit";
import { path } from "./util";
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
  T extends Record<string, Record<string, VariantValue>> = Record<
    string,
    Record<string, VariantValue>
  >
> {
  container: HierarchicalContainer<Variant>;

  constructor(v: T) {
    this.container = new HierarchicalContainer<Variant>();
    for (const key in v) {
      this.container.add(null, new Variant(v[key]));
    }
  }

  /**
   * Compiles the selected variant options by joining all class values
   * into a single string.
   *
   * @param args - An object mapping variant names to their selected keys.
   *               Only keys present in the package's variants are allowed.
   *               If a variant is not specified in `args`, its "default" key will be used if present.
   *
   * @example
   * ```ts
   * const variants = new Package({
   *   withDefault: {
   *     sm: "small",
   *     default: "sm"
   *   },
   *   withoutDefault: {
   *     sm: "small"
   *   },
   *   arrayWithDefault: {
   *     sm: ["small", "medium"],
   *     default: "sm"
   *   },
   *   arrayWithoutDefault: {
   *     sm: ["small", "medium"]
   *   }
   * });
   *
   * package.compile({ withDefault: "sm" });
   * // => "small"
   *
   * package.compile({ arrayWithoutDefault: "sm" });
   * // => "small medium"
   * ```
   *
   * @remarks
   * This method iterates over all variants in the package, determines the correct key
   * to use for each (from `args` or the variant's "default"), and compiles their values
   * into a single space-separated string.
   */
  compile(...packageNames: string[]): PackageResult {
    const matches: VariantValue[] = [];
    for (const search of packageNames) {
      const p = path(search);
      const variant = this.children.get(p.key);

      console.log(variant);

      if (variant) {
        matches.push(variant.compile(p.children.join(".")));
      }
    }

    return new PackageResult(matches);
  }

  search(key: string) {
    const [pkg, ...rest] = key.split(".");
    return this.children.get(pkg)?.compile(rest.join("."));
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
