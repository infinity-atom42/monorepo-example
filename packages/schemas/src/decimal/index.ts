import Decimal from 'decimal.js'
import { z } from 'zod'

// Base schema: validates string input and converts to Decimal
const baseDecimalSchema = z
	.string()
	.transform((val, ctx) => {
		try {
			return new Decimal(val)
		} catch {
			ctx.addIssue({
				code: 'custom',
				message: 'Invalid decimal value',
			})
			return z.NEVER
		}
	})
	.refine((val) => val.isFinite(), {
		message: 'Value must be a finite decimal number',
	})
	.refine((val) => !val.isNaN(), {
		message: 'Value cannot be NaN',
	})

// Money validation rules (reusable)
const moneySchema = baseDecimalSchema
	.refine((val) => !val.isNegative() || val.isZero(), {
		message: 'Value must be positive or zero',
	})
	.refine((val) => val.dp() <= 2, {
		message: 'Value cannot have more than 2 decimal places',
	})
	.refine(
		(val) => {
			const maxValue = new Decimal(10).pow(8).minus(new Decimal(10).pow(-2)) // 99999999.99
			return val.abs().lte(maxValue)
		},
		{
			message: 'Value exceeds maximum precision (10 digits, 2 decimals)',
		}
	)

/**
 * Decimal validator - returns Decimal object
 * - Accepts string input from API
 * - Validates it's a valid decimal (not NaN, not infinite)
 * - Returns Decimal object for calculations
 */
export const decimal = baseDecimalSchema

/**
 * Decimal validator - returns string
 * - Accepts string input from API
 * - Validates it's a valid decimal (not NaN, not infinite)
 * - Returns string for database storage
 */
export const decimalString = baseDecimalSchema.transform((val) => val.toString())

/**
 * Money validator - returns Decimal object
 * - Accepts string input from API
 * - Precision: 10 digits total, 2 decimal places (matches DB schema decimal(10,2))
 * - Positive values only (>= 0)
 * - Returns Decimal object for calculations
 */
export const money = moneySchema

/**
 * Money validator - returns string with 2 decimal places
 * - Accepts string input from API
 * - Precision: 10 digits total, 2 decimal places (matches DB schema decimal(10,2))
 * - Positive values only (>= 0)
 * - Returns string with exactly 2 decimal places for consistent formatting
 */
export const moneyString = moneySchema.transform((val) => val.toFixed(2))
