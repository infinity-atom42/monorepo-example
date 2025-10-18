import { z } from 'zod'

import { paginationMeta } from './base'

type AnyZodObject = z.ZodObject<z.ZodRawShape>
type ShapeOf<T extends AnyZodObject> = T extends z.ZodObject<infer S> ? S : never

type OptionalizeSelectedShape<
    TBaseShape extends z.ZodRawShape,
    TSelectableShape extends z.ZodRawShape,
> = {
    [K in keyof TBaseShape]: K extends keyof TSelectableShape
        ? z.ZodOptional<TBaseShape[K]>
        : TBaseShape[K]
}

type PartialObjectShape<TShape extends z.ZodRawShape> = {
    [K in keyof TShape]: z.ZodOptional<TShape[K]>
}

type RelationsReturnShape<TRelations extends Record<string, AnyZodObject>> = {
    [K in keyof TRelations]: z.ZodOptional<z.ZodObject<PartialObjectShape<ShapeOf<TRelations[K]>>>>
}

type ReturnItemShape<
    TBase extends AnyZodObject,
    TSelectable extends AnyZodObject | undefined,
    TRelations extends Record<string, AnyZodObject> | undefined,
> = OptionalizeSelectedShape<
    ShapeOf<TBase>,
    TSelectable extends AnyZodObject ? ShapeOf<TSelectable> : Record<never, never>
> & (TRelations extends Record<string, AnyZodObject> ? RelationsReturnShape<TRelations> : object)

/**
 * Creates a complete paginated response schema with optional select/include support.
 *
 * - If `selectable` is provided, base fields become optional to reflect dynamic selection.
 * - If `includable` is provided, relation properties are optional and their fields are optional.
 * - If neither is provided, it returns the base schema unchanged.
 */
export function createPaginatedResponse<
	TBase extends z.ZodObject<z.ZodRawShape>,
	TSelectable extends z.ZodObject<z.ZodRawShape> | undefined,
	TRelations extends Record<string, z.ZodObject<z.ZodRawShape>> | undefined,
>(
	baseSchema: TBase,
	options?: { selectable?: TSelectable; includable?: TRelations },
) {
    const { selectable, includable } = options ?? {}

    const baseObject = baseSchema as AnyZodObject
    const itemShape: Record<string, z.ZodTypeAny> = {
        ...(baseObject.shape as unknown as Record<string, z.ZodTypeAny>),
    }

    // Apply selectable: make only selectable base fields optional
    if (selectable) {
        const selectableShape = (selectable as AnyZodObject).shape
        for (const key of Object.keys(selectableShape)) {
            if (key in itemShape) {
                itemShape[key] = (itemShape[key] as z.ZodTypeAny).optional()
            }
        }
    }

    // Apply includable: add optional relation objects whose inner fields are optional
    if (includable) {
        for (const relationName of Object.keys(includable as object)) {
            const relationSchema = (includable as Record<string, AnyZodObject>)[relationName]
            if (!relationSchema) continue
            const relationObject = relationSchema as AnyZodObject
            const relPartialShape: Record<string, z.ZodTypeAny> = {}
            for (const relKey of Object.keys(relationObject.shape)) {
                relPartialShape[relKey] = (relationObject.shape[relKey] as z.ZodTypeAny).optional()
            }
            itemShape[relationName as string] = z.strictObject(relPartialShape).optional()
        }
    }

    const item = z.strictObject(
        itemShape as unknown as ReturnItemShape<TBase, TSelectable, TRelations>,
    )

    return z.strictObject({
        data: z.array(item),
        meta: paginationMeta,
    })
}
