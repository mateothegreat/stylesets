export * from "./svelte";
/**
 * Compile-time type system for schema-driven prop validation in Svelte 5.
 * Provides strict type safety without any runtime overhead.
 */

import type { SvelteStandardProps } from "./svelte";

/**
 * Represents a single schema field definition at the type level.
 * Supports string literals, arrays of literals, or primitive type names.
 */
export type SchemaField<
  Name extends string = string,
  Values extends string | readonly string[] | "string" | "number" | "boolean" =
    | string
    | readonly string[]
    | "string"
    | "number"
    | "boolean",
  Required extends boolean = boolean
> = {
  readonly name: Name;
  readonly values?: Values;
  readonly required?: Required;
  readonly description?: string;
  readonly defaultValue?: Values extends readonly string[]
    ? Values[number]
    : Values extends "string"
      ? string
      : Values extends "number"
        ? number
        : Values extends "boolean"
          ? boolean
          : never;
};

/**
 * Type-level schema definition using const assertions.
 * This is a pure type with no runtime representation.
 */
export type TypeSchema<Fields extends readonly SchemaField[] = readonly SchemaField[]> = {
  readonly fields: Fields;
};

/**
 * Extracts all field names from a type-level schema.
 */
export type SchemaFieldNames<S extends TypeSchema> = S["fields"][number]["name"];

/**
 * Extracts the field definition for a specific field name.
 */
export type GetSchemaField<S extends TypeSchema, Name extends SchemaFieldNames<S>> = Extract<
  S["fields"][number],
  { name: Name }
>;

/**
 * Converts schema field values to TypeScript types.
 */
export type FieldValueToType<V> = V extends "string"
  ? string
  : V extends "number"
    ? number
    : V extends "boolean"
      ? boolean
      : V extends readonly string[]
        ? V[number]
        : V extends string
          ? V
          : never;

/**
 * Extracts the TypeScript type for a specific field.
 */
export type GetFieldType<S extends TypeSchema, Name extends SchemaFieldNames<S>> = FieldValueToType<
  GetSchemaField<S, Name>["values"]
>;

/**
 * Helper type to check if a field is required
 */
export type IsFieldRequired<F> = F extends { required: infer R } ? (R extends true ? true : false) : false;

/**
 * Extract required field names from schema
 */
export type ExtractRequiredFieldNames<Fields> = Fields extends readonly [infer First, ...infer Rest]
  ? First extends SchemaField
    ? IsFieldRequired<First> extends true
      ? First["name"] | ExtractRequiredFieldNames<Rest>
      : ExtractRequiredFieldNames<Rest>
    : ExtractRequiredFieldNames<Rest>
  : never;

/**
 * Creates required props type from schema.
 */
export type RequiredProps<S extends TypeSchema> = {
  [K in ExtractRequiredFieldNames<S["fields"]>]: GetFieldType<S, K>;
};

/**
 * Creates optional props type from schema.
 */
export type OptionalProps<S extends TypeSchema> = {
  [K in Exclude<SchemaFieldNames<S>, ExtractRequiredFieldNames<S["fields"]>>]?: GetFieldType<S, K>;
};

/**
 * Main props type that combines required and optional fields.
 */
export type SchemaProps<S extends TypeSchema> = RequiredProps<S> & OptionalProps<S>;

/**
 * Utility type that prevents excess properties.
 * This is the key to strict prop validation at compile time.
 *
 * Note: Due to TypeScript limitations without strict mode,
 * this currently just returns T without preventing excess properties.
 * Consider enabling strict mode in tsconfig.json for full type safety.
 */
export type Exact<T, U = T> = T & Record<Exclude<keyof U, keyof T>, never>;

/**
 * Strict props that prevent any unknown properties.
 * Use this with Svelte 5's $props() for compile-time validation.
 */
// export type StrictProps<S extends TypeSchema> = SchemaProps<S> &
//   Record<Exclude<string, keyof SchemaProps<S>>, never>;
export type StrictProps<
  S extends TypeSchema,
  Extras extends Record<string, any> = {},
  AllowUnknown extends boolean = false
> = AllowUnknown extends true
  ? SchemaProps<S> & SvelteStandardProps & Extras & Record<string, any>
  : SchemaProps<S> &
      SvelteStandardProps &
      Extras &
      Record<Exclude<string, keyof SchemaProps<S> | keyof SvelteStandardProps | keyof Extras>, never>;
/**
 * Props with additional allowed properties beyond the schema.
 * Use when you need to allow specific extra props like 'class' or 'style'.
 */
export type PropsWithExtras<S extends TypeSchema, Extras extends Record<string, any> = {}> = Exact<
  SchemaProps<S> & {
    [K in keyof Extras as K extends SchemaFieldNames<S> ? never : K]: Extras[K];
  }
>;

/**
 * Type helper for Svelte 5 $props() with strict typing.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * type Schema = TypeSchema<[
 *   { name: 'variant'; values: readonly ['primary', 'secondary']; required: true },
 *   { name: 'size'; values: readonly ['sm', 'md', 'lg'] },
 *   { name: 'disabled'; values: 'boolean' }
 * ]>;
 *
 * type Props = SvelteProps<Schema>;
 * const { variant, size = 'md', disabled = false } = $props<Props>();
 * </script>
 * ```
 */
export type StyleSetProps<S extends TypeSchema> = StrictProps<S>;

/**
 * Type guard to check if a field is required.
 * Useful for conditional type logic.
 */
export type IsRequired<S extends TypeSchema, Name extends SchemaFieldNames<S>> =
  GetSchemaField<S, Name> extends { required: true } ? true : false;

/**
 * Extract only required field names from a schema.
 */
export type RequiredFieldNames<S extends TypeSchema> = ExtractRequiredFieldNames<S["fields"]>;

/**
 * Extract only optional field names from a schema.
 */
export type OptionalFieldNames<S extends TypeSchema> = Exclude<SchemaFieldNames<S>, RequiredFieldNames<S>>;

/**
 * Type-safe prop defaults based on schema.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * type Schema = TypeSchema<[
 *   { name: 'size'; values: readonly ['sm', 'md', 'lg'] }
 * ]>;
 *
 * type Props = SvelteProps<Schema>;
 * type Defaults = PropDefaults<Schema>;
 *
 * const defaults: Defaults = { size: 'md' };
 * const { size = defaults.size } = $props<Props>();
 * </script>
 * ```
 */
export type PropDefaults<S extends TypeSchema> = {
  [K in OptionalFieldNames<S>]?: GetFieldType<S, K>;
};

/**
 * Schema definition helper type for cleaner syntax.
 * Use this to define schemas with proper const assertions.
 *
 * @example
 * ```typescript
 * type ButtonSchema = Schema<[
 *   { name: 'variant'; values: readonly ['primary', 'secondary']; required: true },
 *   { name: 'size'; values: readonly ['sm', 'md', 'lg'] },
 *   { name: 'disabled'; values: 'boolean' }
 * ]>;
 * ```
 */
export type Schema<Fields extends readonly SchemaField[]> = {
  readonly fields: Fields;
};

/**
 * A type helper for creating strictly typed Svelte 5 component props that
 * include properties from a StyleSet schema and allow for other passthrough
 * properties, while properly supporting standard Svelte 5 props.
 *
 * This is useful when you are building a component that wraps another
 * component and you want to enforce strict typing for both the props
 * defined in your schema and the props of the wrapped component.
 *
 * @template S The StyleSet schema.
 * @template Rest The variadic type parameters for passthrough properties.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * import type { ComponentProps } from "@mateothegreat/stylesets";
 * import { SomeOtherComponent } from "some-library";
 * import { styleset } from "./style";
 *
 * type Props = ComponentProps<typeof styleset.schema, SomeOtherComponent.Props>;
 *
 * let { size, children, ...rest }: Props = $props();
 * </script>
 *
 * <SomeOtherComponent {...rest}>
 *   {@render children?.()}
 * </SomeOtherComponent>
 * ```
 */
export type ComponentProps<S extends TypeSchema, Rest extends readonly Record<string, any>[] = []> = SchemaProps<S> &
  (Rest extends readonly [infer First, ...infer Tail]
    ? First & ComponentProps<S, Tail extends readonly Record<string, any>[] ? Tail : []>
    : {});

/**
 * Flexible component props that allow schema props, standard Svelte props,
 * and additional custom props while preventing truly unknown properties.
 */
export type FlexibleComponentProps<
  S extends TypeSchema,
  Extras extends Record<string, any> = {},
  AllowUnknown extends boolean = false
> = AllowUnknown extends true
  ? SchemaProps<S> & SvelteStandardProps & Extras & Record<string, any>
  : SchemaProps<S> &
      SvelteStandardProps &
      Extras &
      Record<Exclude<string, keyof SchemaProps<S> | keyof SvelteStandardProps | keyof Extras>, never>;

/**
 * Utility type to convert a union of types to an intersection.
 * This helps with properly merging multiple additional type objects.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type OptionalPropsFixed<S extends TypeSchema> = S["fields"][number]["name"] extends never
  ? {}
  : {
      [K in Exclude<SchemaFieldNames<S>, ExtractRequiredFieldNames<S["fields"]>> as K extends string
        ? K
        : never]?: GetFieldType<S, K>;
    };
