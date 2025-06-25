export type Unset = undefined | null;
export const unset: Unset = null;

/**
 * PathParser provides utilities for parsing dot-notation paths used in style variant lookups.
 * Handles paths in formats like "variant", "variant.variation", or "package.variant.variation".
 */
export class Identifier {
  public package: string | null;
  public variant: string;
  public variation: string | null;

  constructor(path: string) {
    const parts = path.split(".");

    if (!parts) {
      throw new Error(`invalid path: ${path}`);
    }

    if (parts.length === 1) {
      this.package = null;
      this.variant = parts[0];
      this.variation = null;
    } else if (parts.length === 2) {
      this.package = null;
      this.variant = parts[0];
      this.variation = parts[1];
    } else {
      this.package = parts[0];
      this.variant = parts[1];
      this.variation = parts[2];
    }
  }

  /**
   * Gets the variant portion of the path.
   */
  getVariantString(): string {
    return this.variant;
  }

  /**
   * Gets the full path as a reconstructed string.
   */
  getFullString(): string {
    const parts = [];
    if (this.package) parts.push(this.package);
    parts.push(this.variant);
    if (this.variation) parts.push(this.variation);
    return parts.join(".");
  }

  /**
   * Gets the variation portion of the path.
   */
  getVariation(): string | null {
    return this.variation;
  }
}

export const identify = (search: string): Identifier => {
  return new Identifier(search);
};
