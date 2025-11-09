/**
 * Maps each property of `T` so that `undefined` is removed from its possible value.
 */
export type OmitUndefined<T extends Record<string, unknown>> = {
	[K in keyof T]?: Exclude<T[K], undefined>
}

/**
 * Returns a shallow copy of `obj` with all `undefined` values removed.
 *
 * @example
 * ```ts
 * omitUndefined({ foo: 'bar', baz: undefined });
 * // => { foo: 'bar' }
 * ```
 *
 * @example
 * ```ts
 * // title: string | undefined;
 * const props = { id: 'item-1', label: undefined, {...omitUndefined({ title })} };
 *
 * // resulting object will be either
 *    => { id: 'item-1', label: undefined, title: 'Hello, world!' }
 * or => { id: 'item-1', label: undefined }
 * ```
 */
export function omitUndefined<T extends Record<string, unknown>>(obj: T): OmitUndefined<T> {
	return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as OmitUndefined<T>
}
