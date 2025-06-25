import { StyleSet } from "../..";
import type { OptionalProps, RequiredProps, SchemaProps } from "../types";

// Create the same styleset
const styleset = new StyleSet(
  {
    fields: [
      {
        name: "type",
        values: ["single", "multiple"]
      },
      {
        name: "size",
        values: ["sm", "md", "lg"],
        required: true
      },
      {
        name: "class",
        values: ["class-1", "class-2", "class-3"]
      }
    ]
  },
  {}
);

// Let's see what types we get
type MySchema = typeof styleset.schema;
type MySchemaProps = SchemaProps<MySchema>;
type MyOptionalProps = OptionalProps<MySchema>;
type MyRequiredProps = RequiredProps<MySchema>;

// Check if the issue is with the schema having an index signature
type CheckIndexSig = keyof MyOptionalProps;
type CheckChildren = "children" extends keyof MyOptionalProps ? true : false;

// Try a simpler approach
type SimpleProps = {
  type?: "single" | "multiple";
  size: "sm" | "md" | "lg";
  class?: "class-1" | "class-2" | "class-3";
  children?: () => any;
};

const simpleTest: SimpleProps = {
  type: "single",
  size: "sm",
  class: "class-1",
  children: () => "Hello"
};

// Export to prevent unused variable errors
export { simpleTest, type CheckChildren, type CheckIndexSig };
