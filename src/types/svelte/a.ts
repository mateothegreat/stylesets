// export type SvedddlteComponentProps<
//   S extends TypeSchema,
//   Extras extends Record<string, any> = {},
//   AdditionalTypes extends
//     | Record<string, any>
//     | readonly Record<string, any>[] = {},
//   AllowUnknown extends boolean = false
// > = AllowUnknown extends true
//   ? SchemaProps<S>
//   : SchemaProps<S> &
//       SvelteStandardProps &
//       Extras &
//       (AdditionalTypes extends readonly Record<string, any>[]
//         ? UnionToIntersection<AdditionalTypes[number]>
//         : AdditionalTypes) &
//       Record<
//         Exclude<
//           string,
//           | keyof SchemaProps<S>
//           | keyof SvelteStandardProps
//           | keyof Extras
//           | keyof (AdditionalTypes extends readonly Record<string, any>[]
//               ? UnionToIntersection<AdditionalTypes[number]>
//               : AdditionalTypes)
//         >,
//         never
//       >;
