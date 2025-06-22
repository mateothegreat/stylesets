import { Package } from "./package";
import { StyleSet } from "./set";
import { Variant } from "./variant";

export type Unset = undefined | null;
export const unset: Unset = null;

export type Searchable =
  | Pick<StyleSet, "children">
  | Pick<Package, "children">
  | Pick<Variant, "children">;
export type RecursiveArray<T> = T | RecursiveArray<T>[];

export const path = (path: string) => {
  const [key, ...rest] = path.split(".");
  return {
    key,
    children: rest,
    rest: rest.join("."),
  };
};

export const search = (
  tree: RecursiveArray<Searchable>,
  key: string,
  value: string,
  target: Searchable,
  prop: string
) => {
  // Handle array of searchables by recursively searching each element
  if (Array.isArray(tree)) {
    for (const item of tree) {
      const result = search(item, key, value, target, prop);
      if (result !== unset) {
        return result;
      }
    }
    return unset;
  }

  // Base case: we've reached a single searchable item
  const searchable = tree as Searchable;

  // If this is our target type, perform the search
  if (searchable instanceof target.constructor) {
    if (searchable instanceof StyleSet) {
      return searchable.search(key);
    } else if (searchable instanceof Package) {
      return searchable.search(key);
    } else if (searchable instanceof Variant) {
      return searchable.compile(key);
    }
  }

  // If this searchable has a search method or property we can traverse
  if (searchable instanceof StyleSet && searchable.children) {
    const pathInfo = path(key);
    const childSearchable = searchable.children.get(pathInfo.key);
    if (childSearchable && pathInfo.children.length > 0) {
      return search(childSearchable, pathInfo.rest, value, target, prop);
    }
  } else if (searchable instanceof Package && searchable.children) {
    const pathInfo = path(key);
    const childSearchable = searchable.children.get(pathInfo.key);
    if (childSearchable && pathInfo.children.length > 0) {
      return search(childSearchable, pathInfo.rest, value, target, prop);
    }
  }

  return unset;
};
