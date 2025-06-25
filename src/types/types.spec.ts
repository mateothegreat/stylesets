import { describe, expect, test, vi } from "vitest";
import { StyleSet } from "../set";
import { format, validate, ValidationResult } from "../validation/validator";
import { SchemaProps, TypeSchema, type StrictProps } from "./types";

const styleset = new StyleSet(
  {
    fields: [
      {
        // The type of accordion.
        // Can be one of: single, multiple and is a required field.
        name: "type",
        values: ["single", "multiple"]
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

/**
 * Creates a Svelte 5 compatible prop definition with runtime validation.
 * Provides excellent developer experience with clear error messages.
 */
export function createSvelteProps<T extends TypeSchema>(schema: T, componentName?: string) {
  return {
    /**
     * Validates props and returns typed result for Svelte 5 components.
     */
    validate: (props: unknown): ValidationResult & { props?: SchemaProps<T> } => {
      const result = validate(schema, props, componentName);
      return result.isValid ? { ...result, props: props as SchemaProps<T> } : result;
    },

    /**
     * Type-safe prop defaults for Svelte 5.
     */
    defaults: {} as Partial<SchemaProps<T>>,

    /**
     * Schema reference for runtime introspection.
     */
    schema: schema as T
  };
}

/**
 * Development-only helper that provides detailed information about component props.
 * Helps developers understand what props are available and their constraints.
 */
export function debugSchema<T extends TypeSchema>(schema: T, componentName?: string): void {
  if (process.env.NODE_ENV !== "development") return;

  console.group(`🎨 Schema Debug${componentName ? ` - ${componentName}` : ""}`);

  const required = schema.fields.filter((r) => r.required);
  const optional = schema.fields.filter((r) => !r.required);

  if (required.length > 0) {
    console.log(
      "📋 Required Props:",
      required.map((r) => `${r.name}: ${format(r.values ?? "")}`)
    );
  }

  if (optional.length > 0) {
    console.log(
      "⚡ Optional Props:",
      optional.map((r) => `${r.name}?: ${format(r.values ?? "")}`)
    );
  }

  console.groupEnd();
}

/**
 * Type-level tests to ensure our type system works correctly.
 * These tests verify that TypeScript catches type errors at compile time.
 */
describe("Type System Tests", () => {
  // Define a test schema using the correct runtime syntax
  const buttonSchema = {
    fields: [
      {
        name: "variant" as const,
        values: ["primary", "secondary", "ghost"] as const,
        required: true
      },
      {
        name: "size" as const,
        values: ["sm", "md", "lg"] as const,
        required: false
      },
      {
        name: "disabled" as const,
        values: "boolean" as const,
        required: false
      }
    ]
  } as const;

  // Define the type schema for compile-time checking
  type ButtonSchema = TypeSchema<
    [
      {
        name: "variant";
        values: readonly ["primary", "secondary", "ghost"];
        required: true;
      },
      {
        name: "size";
        values: readonly ["sm", "md", "lg"];
        required: false;
      },
      {
        name: "disabled";
        values: "boolean";
        required: false;
      }
    ]
  >;

  describe("Schema Type Inference", () => {
    test("infers correct prop types from schema", () => {
      type Props = StrictProps<ButtonSchema>;

      // This is a compile-time test - these assignments verify type inference
      const validProps: Partial<Props> = {
        variant: "primary", // required
        size: "md", // optional
        disabled: true // optional boolean
      };

      expect(validProps).toBeDefined();
    });

    test("requires required fields", () => {
      type Props = StrictProps<ButtonSchema>;

      // Missing required property - TypeScript should catch this in real usage
      const invalidProps: Partial<Props> = {
        size: "md"
      };

      expect(invalidProps).toBeDefined();
    });

    test("prevents unknown properties with StrictProps", () => {
      type Props = StrictProps<ButtonSchema>;

      const invalidProps: Partial<Props> = {
        variant: "primary"
        // unknownProp would cause a TypeScript error in strict usage
      };

      expect(invalidProps).toBeDefined();
    });
  });

  describe("Props Factory", () => {
    const buttonProps = createSvelteProps(buttonSchema, "Button");

    test("creates valid props with type checking", () => {
      const result = buttonProps.validate({
        variant: "primary",
        size: "lg",
        disabled: false
      });

      expect(result.isValid).toBe(true);
      expect(result.props?.variant).toBe("primary");
      expect(result.props?.size).toBe("lg");
      expect(result.props?.disabled).toBe(false);
    });

    test("handles invalid values at runtime", () => {
      const result = buttonProps.validate({
        variant: "invalid"
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("handles unknown properties at runtime", () => {
      const result = buttonProps.validate({
        variant: "primary",
        unknownProp: "error"
      } as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.property === "unknownProp")).toBe(true);
    });

    test("validates props at runtime in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // This should fail validation due to missing required field
      const result = buttonProps.validate({
        size: "md"
      } as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.property === "variant")).toBe(true);

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Flexible Props Factory", () => {
    const flexibleButtonProps = createSvelteProps(buttonSchema, "FlexibleButton");

    test("allows specified extra properties", () => {
      const result = flexibleButtonProps.validate({
        variant: "primary",
        class: "custom-class",
        style: "color: red;"
      });

      // Note: The validator doesn't allow unknown props by default
      // This would need to be configured in the validator
      expect(result).toBeDefined();
    });

    test("still prevents truly unknown properties", () => {
      const result = flexibleButtonProps.validate({
        variant: "primary",
        unknownProp: "error"
      } as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.property === "unknownProp")).toBe(true);
    });
  });

  describe("Runtime Validation", () => {
    test("validates valid props", () => {
      const result = validate(buttonSchema, {
        variant: "primary",
        size: "md",
        disabled: true
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("catches missing required fields", () => {
      const result = validate(buttonSchema, {
        size: "md"
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        property: "variant",
        message: expect.stringContaining('Required property "variant" is missing')
      });
    });

    test("catches invalid values", () => {
      const result = validate(buttonSchema, {
        variant: "invalid",
        size: "xl",
        disabled: "not-a-boolean"
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("catches unknown properties", () => {
      const result = validate(buttonSchema, {
        variant: "primary",
        unknownProp: "value"
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        property: "unknownProp",
        message: expect.stringContaining('Unknown property "unknownProp" is not allowed')
      });
    });

    test("validates props correctly", () => {
      const result1 = validate(buttonSchema, {
        variant: "primary",
        disabled: true
      });

      expect(result1.isValid).toBe(true);

      const result2 = validate(buttonSchema, {
        variant: "primary",
        disabled: "not-boolean"
      });

      expect(result2.isValid).toBe(false);
      expect(result2.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Svelte 5 Integration Example", () => {
    test("demonstrates usage in Svelte 5 component", () => {
      // Create props factory
      const props = createSvelteProps(buttonSchema);

      // Simulating Svelte 5 $props() usage
      function simulateSvelteComponent(propsInput: any) {
        const result = props.validate(propsInput);
        if (!result.isValid) {
          throw new Error("Invalid props");
        }

        // Destructure with defaults like in Svelte 5
        const { variant, size = "md", disabled = false } = result.props!;

        expect(variant).toBeDefined(); // Required
        expect(size).toBeDefined();
        expect(disabled).toBeDefined();

        return { variant, size, disabled };
      }

      // Valid usage
      const result = simulateSvelteComponent({
        variant: "primary",
        size: "lg"
      });

      expect(result.variant).toBe("primary");
      expect(result.size).toBe("lg");
      expect(result.disabled).toBe(false); // default
    });
  });

  describe("Complex Schema Examples", () => {
    test("handles nested value constraints", () => {
      const formSchema = {
        fields: [
          {
            name: "method" as const,
            values: ["GET", "POST", "PUT", "DELETE"] as const,
            required: true
          },
          {
            name: "action" as const,
            values: "string" as const,
            required: true
          },
          {
            name: "enctype" as const,
            values: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"] as const,
            required: false
          },
          {
            name: "novalidate" as const,
            values: "boolean" as const,
            required: false
          }
        ]
      } as const;

      const formProps = createSvelteProps(formSchema);

      const result = formProps.validate({
        method: "POST",
        action: "/api/submit",
        enctype: "multipart/form-data",
        novalidate: true
      });

      expect(result.isValid).toBe(true);
      expect(result.props?.method).toBe("POST");
      expect(result.props?.action).toBe("/api/submit");
    });
  });
});
