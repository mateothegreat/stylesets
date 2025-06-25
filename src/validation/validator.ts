import type { SchemaProps, TypeSchema } from "../types/types";

/**
 * Enhanced prop validation with detailed error reporting.
 * Provides clear feedback for debugging and development.
 */
export type ValidationResult = {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
};

export type ValidationError = {
  readonly property: string;
  readonly message: string;
  readonly expectedType: string;
  readonly actualValue: unknown;
};

export const format = (values: string | readonly string[] | undefined): string => {
  if (!values) return "any";
  if (values === "boolean") return "boolean";
  if (values === "string") return "string";
  if (values === "number") return "number";
  if (Array.isArray(values)) return values.join(" | ");
  return values.toString();
};

export const evaluate = (value: unknown, values: string | readonly string[] | undefined): boolean => {
  if (!values) return true; // No constraints means any value is valid

  if (values === "boolean") {
    return typeof value === "boolean";
  }

  if (values === "string") {
    return typeof value === "string";
  }

  if (values === "number") {
    return typeof value === "number";
  }

  if (Array.isArray(values)) {
    return values.includes(value as string);
  }

  if (typeof values === "string") {
    return value === values;
  }

  return false;
};

export const validate = <T extends TypeSchema>(
  schema: T,
  props: unknown,
  componentName?: string
): ValidationResult & { props?: SchemaProps<T> } => {
  const errors: ValidationError[] = [];

  if (typeof props !== "object" || props === null) {
    errors.push({
      property: "root",
      message: "Props must be an object",
      expectedType: "object",
      actualValue: props
    });
    return { isValid: false, errors };
  }

  const propObj = props as Record<string, any>;
  const allowedProps = new Set(schema.fields.map((r) => r.name));

  // Validate each schema property
  for (const record of schema.fields) {
    const value = propObj[record.name];

    if (record.required && value === undefined) {
      errors.push({
        property: record.name,
        message: `Required property "${record.name}" is missing${
          componentName ? ` in component ${componentName}` : ""
        }`,
        expectedType: format(record.values),
        actualValue: undefined
      });
      continue;
    }

    if (value !== undefined && !evaluate(value, record.values)) {
      errors.push({
        property: record.name,
        message: `Invalid value for property "${record.name}"`,
        expectedType: format(record.values),
        actualValue: value
      });
    }
  }

  // Check for unknown properties
  for (const key in propObj) {
    if (!allowedProps.has(key)) {
      errors.push({
        property: key,
        message: `Unknown property "${key}" is not allowed`,
        expectedType: `One of: ${Array.from(allowedProps).join(", ")}`,
        actualValue: propObj[key]
      });
    }
  }

  return { isValid: errors.length === 0, errors };
};
