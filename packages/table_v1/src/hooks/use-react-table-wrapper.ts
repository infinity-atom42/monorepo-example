'use client'
'use no memo'

import { useReactTable, type TableOptions } from '@tanstack/react-table'

/**
 * Wrapper around TanStack Table's useReactTable to isolate React Compiler incompatibility.
 *
 * @see https://github.com/TanStack/table/issues/5567
 * @todo Remove this wrapper once TanStack Table is compatible with React Compiler
 *
 * The "use no memo" directive is required because useReactTable returns functions
 * with "interior mutability" that cannot be safely memoized by React Compiler.
 * This wrapper isolates the incompatibility to a single file, allowing the rest
 * of the codebase to benefit from React Compiler optimizations.
 */
export function useReactTableWrapper<TData>(options: TableOptions<TData>) {
	// eslint-disable-next-line react-hooks/incompatible-library
	return useReactTable(options)
}
