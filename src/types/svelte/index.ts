/**
 * Standard Svelte 5 component props that should be allowed on all components.
 * Based on Svelte 5.0.0+ prop conventions.
 */

import { StyleSet, type SchemaProps, type TypeSchema } from "../..";

/**
 * Generic snippet type that represents a Svelte 5 snippet without importing from svelte package.
 * This allows for flexible component composition while maintaining type safety.
 *
 * The structure matches Svelte 5's internal Snippet type to ensure compatibility
 * with {@render} syntax and component composition.
 */
export type GenericSnippet<T extends readonly unknown[] = []> = {
  (...args: T): string | GenericSnippet<[]>;
} & {
  /** Svelte 5 internal snippet marker for {@render} compatibility */
  "{@render ...} must be called with a Snippet": "import type { Snippet } from 'svelte'";
  /** Marker to identify this as a snippet for {@render} */
  [Symbol.toStringTag]: "Snippet";
};

/**
 * Alternative snippet type that provides a more flexible structure
 * for cases where you need to work with snippet-like objects.
 */
export type FlexibleSnippet<T extends readonly unknown[] = []> = {
  (...args: T): any;
} & {
  /** Marker to identify this as a snippet for {@render} */
  [Symbol.toStringTag]: "Snippet";
};

/**
 * Standard Svelte 5 component props that should be allowed on all components.
 * Based on Svelte 5.0.0+ prop conventions with support for snippets and components.
 */
export type SvelteStandardProps = {
  /** Children snippet for multiple child content. */
  // children?: GenericSnippet | FlexibleSnippet | (() => any);
  /** CSS class string for styling. */
  class?: string;
  /** Inline style string or object. */
  style?: string | Record<string, string | number> | null | undefined;
  /** Component reference for binding. */
  ref?: HTMLElement | null | undefined;
}

/**
 * Enhanced StyleSetProps that includes standard Svelte 5 props.
 * Use this for components that need schema props plus standard Svelte props.
 */
export type SvelteComponentProps<
  S extends TypeSchema,
  Rest extends Record<string, any> | readonly Record<string, any>[] = {}
> = SchemaProps<S> & SvelteStandardProps & Rest;

const styleset = new StyleSet(
  {
    fields: [
      {
        // The type of accordion.
        // Can be one of: single, multiple and is a required field.
        name: "type",
        values: ["single", "multiple"],
        required: true
      },
      {
        // The size of the accordion.
        // Can be one of: sm, md, lg andis a required field.
        name: "size",
        values: ["sm", "md", "lg"],
        required: true
      },
      {
        // Additional css class names to add to the components.
        // Can be any valid string | string[] (css class names) and is an optional field.
        name: "class",
        values: "string",
        required: false
      }
    ]
  },
  {
    root: {
      sm: {
        outline: [
          "border",
          "border-[color:var(--color-invert-light,theme(colors.gray.900))]",
          "dark:border-[color:var(--color-invert-dark,var(--border))]",
          "rounded-md"
        ]
      }
    }
  }
);

const { children, ...rest }: SvelteComponentProps<typeof styleset.schema & {}> = {
  type: "single",
  size: "sm",
  class: "class-1",
  children: () => "Hello"
};

console.log(children, rest);
/**
 * Utility type to convert a union of types to an intersection.
 * This helps with properly merging multiple additional type objects.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
