import { HierarchicalContainer } from "@mateothegreat/ts-kit";
import { Package } from "./package";
import type { VariantValue } from "./variant";

/**
 * A StyleSet is a collection of packages.
 *
 * @example
 */
export class StyleSet<
  T extends Record<
    string,
    Record<string, Record<string, VariantValue>>
  > = Record<string, Record<string, Record<string, VariantValue>>>
> {
  container: HierarchicalContainer<Package>;

  constructor(obj: T) {
    this.container = new HierarchicalContainer<Package>();
    for (const key in obj) {
      this.container.add(null, new Package(obj[key]));
    }
  }

  /**
   * Compiles the selected variant options from all packages by joining their
   * compiled class values into a single string.
   *
   * @param args - An object mapping package names to their variant selection arguments.
   *               Each package receives its corresponding argument object for compilation.
   *               If a package is not specified in `args`, it will use its default behavior.
   *
   * @example
   * ```ts
   * const variantSet = new VariantSet({
   *   outline: new Package({
   *     size: { sm: "small", lg: "large", default: "sm" },
   *     color: { red: "text-red", blue: "text-blue" }
   *   }),
   *   filled: new Package({
   *     size: { sm: "small-filled", lg: "large-filled" }
   *   })
   * });
   *
   * variantSet.compile({
   *   outline: { size: "lg", color: "red" },
   *   filled: { size: "sm" }
   * });
   * // => "large text-red small-filled"
   * ```
   *
   * @remarks
   * This method iterates through all packages in the set, compiles each package
   * with its corresponding arguments, and joins all resulting class strings with spaces.
   * Empty or undefined compilation results are filtered out automatically.
   */
  compile(
    args?: Partial<Record<keyof T, Partial<Record<string, string>>>>
  ): string {
    const classes: VariantValue[] = [];

    for (const [key, pkg] of this.children.entries()) {
      const value = pkg.compile(args?.[key as keyof T]);

      if (value) {
        classes.push(value);
      }
    }

    return classes.join(" ");
  }

  search(key: string) {}
}
