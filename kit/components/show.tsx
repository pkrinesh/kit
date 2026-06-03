import * as React from "react";

export type NonNullableTuple<T extends readonly unknown[]> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type RenderFn<T extends readonly unknown[]> = (
  ...when: NonNullableTuple<T>
) => React.ReactNode;

export type MaybeRender<T extends readonly unknown[]> = React.ReactNode | RenderFn<T>;

export interface ShowProps<T extends readonly unknown[]> {
  /**
   * A tuple of values that must all be non-null for the component to render.
   * These values will be passed to children/fallback render functions.
   */
  when: readonly [...T];

  /**
   * Optional additional condition.
   * Runs only after all values are verified non-null.
   */
  and?: (...when: NonNullableTuple<T>) => boolean;

  /**
   * What to render when all values are non-null
   * and the `and` predicate resolves to true.
   * Can be JSX or a render function receiving the non-null tuple.
   */
  children: MaybeRender<T>;

  /**
   * What to render when conditions fail.
   * Can also be JSX or a render function.
   */
  fallback?: MaybeRender<T>;
}

/**
 * A strongly typed conditional rendering component.
 *
 * It ensures:
 * - all `when` must be non-null before rendering children
 * - `children` receives fully non-null values (type-safe)
 * - optional `and` predicate for extra conditions
 * - `fallback` supports both JSX and render functions
 *
 * Inspired by SolidJS `Show`, but fully type-safe for React.
 *
 * @example Basic
 * ```tsx
 * <Show when={[user]}>
 *   {(u) => <UserCard user={u} />}
 * </Show>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <Show when={[user]} fallback={<Login />}>
 *   {(u) => <Dashboard user={u} />}
 * </Show>
 * ```
 *
 * @example With predicate
 * ```tsx
 * <Show
 *   when={[user, posts]}
 *   and={(u, p) => p.length > 0}
 *   fallback="No posts available"
 * >
 *   {(u, p) => <PostList posts={p} user={u} />}
 * </Show>
 * ```
 */
export function Show<T extends readonly unknown[]>({
  when,
  and,
  children,
  fallback = null,
}: ShowProps<T>) {
  // Ensure all when are non-null
  const allNonNull = when.every(Boolean);
  const safeValues = when as NonNullableTuple<T>;

  // Check optional predicate
  const ok = allNonNull && (and ? and(...safeValues) : true);

  const isFn = (node: MaybeRender<T>): node is RenderFn<T> => typeof node === "function";

  const render = (node: MaybeRender<T>) => (isFn(node) ? node(...safeValues) : node);

  return <>{ok ? render(children) : render(fallback)}</>;
}
