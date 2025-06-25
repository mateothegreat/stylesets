# stylesets

```yaml
                                                                                      {
                                                            ┌                           sm: "border-2",
                                                        ┌──┼┼   Variant: "border"   =   md: "border-4",
                                                        │   └                           lg" "border-4"
                                                        │                             }
                                                        │
                            ┌                           │
                       ┌───┼┼   Package: "button"    ───┤
                       │    └                           │
                       │                                │
                       │                                │                             {
                       │                                │   ┌                           sm: "gap-2 padding-2",
                       │                                └──┼┼   Variant: "spacing"  =   md: "gap-4 padding-4",
                       │                                    └                           lg" "gap-6 padding-6"
                       │                                                              }
                       │
                       │
                       │
                       │
                       │                                                              {
                       │                                    ┌                           sm: "border-2",
                       │                                ┌──┼┼   Variant: "border"   =   md: "border-4",
                       │                                │   └                           lg" "border-4"
                       │                                │                             }
                       │                                │
                       │    ┌                           │
  new StyleSet(..) ────┼───┼┼  Package: "accordion"  ───┤
                       │    └                           │
                       │                                │
                       │                                │                             {
                       │                                │   ┌                           sm: "gap-2 padding-2",
                       │                                └──┼┼   Variant: "spacing"  =   md: "gap-4 padding-4",
                       │                                    └                           lg" "gap-6 padding-6"
                       │                                                              }
                       │
                       │
                       │
                       │
                       │                                                              {
                       │                                    ┌                           sm: "border-2",
                       │                                ┌──┼┼   Variant: "border"   =   md: "border-4",
                       │                                │   └                           lg" "border-4"
                       │                                │                             }
                       │                                │
                       │    ┌                           │
                       └───┼┼    Package: "modal"    ───┤
                            └                           │
                                                        │
                                                        │                             {
                                                        │   ┌                           sm: "gap-2 padding-2",
                                                        └──┼┼   Variant: "spacing"  =   md: "gap-4 padding-4",
                                                            └                           lg" "gap-6 padding-6"
                                                                                      }
```

## Usage

First, we create a `StyleSet` which contains all of our pre-defined variants and defaults:

```svelte
import { StyleSet } from "@mateothegreat/stylesets";

export const styleset = new StyleSet(
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
        spacing: ["p-2", "gap-2"],
        typography: ["text-sm", "font-normal"],
        outline: [
          "border-2",
          "border-[color:var(--color-invert-light,theme(colors.gray.900))]",
          "dark:border-[color:var(--color-invert-dark,var(--border))]",
          "rounded-md"
        ]
      },
      md: {
        spacing: ["p-4", "gap-4"],
        typography: ["text-base", "font-normal"],
        outline: [
          "border-4",
          "border-[color:var(--color-invert-light,theme(colors.gray.900))]",
          "dark:border-[color:var(--color-invert-dark,var(--border))]",
          "rounded-md"
        ]
      },
      lg: {
        spacing: ["p-6", "gap-6"],
        typography: ["text-lg", "font-normal"],
        outline: [
          "border-4",
          "border-[color:var(--color-invert-light,theme(colors.gray.900))]",
          "dark:border-[color:var(--color-invert-dark,var(--border))]",
          "rounded-md"
        ]
      }
    }
  }
);
```

Now we can render our variations all day long!

```svelte
<script lang="ts">
  import type { SvelteComponentProps } from "@mateothegreat/stylesets";
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import { styleset } from "./style";

  let {
    size = "sm",
    class: className,
    type: t = "single" as "single" | "multiple",
    children,
    ref = $bindable(null),
    value = $bindable<any>(""),
    ...rest
  }: SvelteComponentProps<
    // We use the styleset schema to define the props that are allowed
    // for this component:
    typeof styleset.schema,
    [
      // We add the AccordionPrimitive.RootProps to allow the passing
      // of the underlying bits-ui props:
      AccordionPrimitive.RootProps,
      // Now we can further widen the type to allow the passing of props
      // that we handle directly within this component:
      {
        children?: () => Snippet;
        type?: "single" | "multiple";
        size?: "sm" | "md" | "lg";
        class?: string | string[];
      }
    ]
  > = $props();
</script>

<AccordionPrimitive.Root
  bind:ref
  bind:value
  type={t}
  data-slot="accordion"
  class={styleset.search(`root.${size}.outline`).toString()}
  {...rest} />
```