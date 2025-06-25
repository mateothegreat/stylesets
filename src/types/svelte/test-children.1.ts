import { StyleSet, type SchemaProps } from "../..";

// Test the type inference
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

// Check what SchemaProps resolves to
type TestSchem aProps = SchemaProps<typeof styleset.schema>;
// ^? hover to see type

// Check if children exists in schema
type HasChildren = "children" extends keyof TestSchemaProps ? true : false;
// ^? hover to see type

// Check the actual type of TestSchemaProps
// @ts-ignore TS6196: 'TestSchemaProps' is declared but never used.
// tslint:disable:no-unused-variable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Keys = keyof TestSchemaProps;

// Try using the type directly
type DirectProps = {
  type?: "single" | "multiple";
  size: "sm" | "md" | "lg";
  class?: "class-1" | "class-2" | "class-3";
  children?: () => any;
};

const testDirect: DirectProps = {
  type: "single",
  size: "sm",
  class: "class-1",
  children: () => "Hello"
};
