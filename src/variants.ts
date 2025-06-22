import { type Unset } from "./util";
import { Variant } from "./variant";

export enum Size {
  sm = "sm",
  md = "md",
  lg = "lg"
}

/**
 * `CompileArgs` represents the arguments passed to `Variant.compile("sm")`.
 */
export type CompileArgs = string | Unset;

/**
 * `Variants` represents a collection of variants.
 *
 * @example
 *
 */
export type Variants = Record<string, Variant>;
