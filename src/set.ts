import { HierarchicalContainer } from "@mateothegreat/ts-kit";
import { Package } from "./package";
import type { TypeSchema } from "./types/types";
import { identify } from "./util";
import { VariantResult, type VariantValue } from "./variant";

/**
 * A StyleSet is a collection of packages.
 *
 * @example
 * ```ts
 * const styleset = new StyleSet({
 *   fields: [
 *     {
 *       name: "size",
 *       values: ["sm", "md", "lg"],
 *       required: true
 *     }
 *   ]},
 *   {
 *     packageOne: {
 *       variantA: {
 *         variation1: ["a", "b"],
 *         variation2: "c"
 *       },
 *       variantB: {
 *         variation2: "d",
 *         variation3: ["e"]
 *       }
 *     },
 *     packageTwo: {
 *       variantZ: {
 *         variation3: ["f", "g", "h"],
 *         variation4: "i"
 *       }
 *     }
 *   }
 * });
 * ```
 */
export class StyleSet<
  T extends Record<string, Record<string, Record<string, VariantValue>>> = Record<
    string,
    Record<string, Record<string, VariantValue>>
  >
> {
  schema: TypeSchema;
  container: HierarchicalContainer<Package>;

  constructor(schema: TypeSchema, obj: T) {
    this.schema = schema;
    this.container = new HierarchicalContainer<Package>();
    for (const key in obj) {
      this.container.addChild(key, new Package(obj[key]));
    }
  }

  /**
   * Searches for a variant using dot-notation path.
   * Path format: "package.variant.size" where:
   * - package: the package name (e.g., "outline", "filled")
   * - variant: the variant name (e.g., "size", "color")
   * - size: the variant key (e.g., "sm", "md", "lg")
   *
   * @param searchPath A dot-separated path string like "outline.size.md"
   * @returns The compiled variant result or null if not found
   */
  search(...paths: string[]): VariantResult | null {
    const variations: (string | string[])[] = [];

    /**
     * We're going to start by searching for the package(s) and then the
     * variant(s) and then the variation(s).
     */
    for (const path of paths) {
      const identifiers = identify(path);
      const packageContainer = this.findPackageByName(identifiers.package);

      if (!packageContainer) {
        console.warn(`Package "${identifiers.package}" not found`);
        return null;
      }

      if (identifiers.variation === null || identifiers.variation === "*") {
        variations.push(...Array.from(packageContainer.value.variants.values()).flatMap((v) => v.toString()));
        continue;
      }

      const variant = packageContainer.value.search(identifiers.getFullString());

      if (!variant) {
        return null;
      }

      variations.push(variant.toString());
    }

    return new VariantResult(variations.flatMap((v) => v));
  }

  /**
   * Helper method to find a package by name.
   */
  private findPackageByName(packageName: string): HierarchicalContainer<Package> | null {
    for (const child of this.container.children) {
      const childPackageName = this.getPackageName(child);
      if (childPackageName === packageName) {
        return child;
      }
    }
    return null;
  }

  /**
   * Helper method to get the package name from a container.
   * You'll need to customize this based on how you store package names.
   */
  private getPackageName(packageContainer: HierarchicalContainer<Package>): string {
    // This is a placeholder - you'll need to implement based on your data structure
    // For now, assuming you might store the name as a property
    const packageValue = packageContainer.value as any;

    if (packageValue.name) {
      return packageValue.name;
    }
    if (packageValue.key) {
      return packageValue.key;
    }

    return packageContainer.id;
  }
}
