/**
 * Generic type for extracting style keys from a component's style configuration.
 * This utility type enables type-safe prop definitions across UI components by
 * automatically inferring available style variant keys from the style object.
 *
 * @template T - The style configuration object type
 */
export type StyleSetKeys<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any> ? K : never;
    }[keyof T]
  : never;

/**
 * Utility type for creating component props that include style variant options.
 * This type combines the base component props with optional style variant props,
 * providing a consistent interface for styled components throughout the UI library.
 *
 * @template BaseProps - The base component props type
 * @template StyleConfig - The style configuration object type
 */
export type StyleSetProps<BaseProps, StyleConfig> = BaseProps &
  Partial<Record<StyleSetKeys<StyleConfig>, string>> & {
    class?: string;
  };
