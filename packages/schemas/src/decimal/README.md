# Decimal Schemas

Four simple decimal validation schemas using Decimal.js and Zod for precise numeric handling.

## Features

- **API-ready**: Accepts string input (as all API data is)
- **Type-safe**: Full TypeScript support with Decimal.js
- **Flexible output**: Choose between Decimal objects (for calculations) or strings (for storage)
- **Validated**: Ensures finite, valid decimals with proper constraints

## Schemas

### 1. `decimal`

Basic decimal validator - returns Decimal object.

- **Input**: `string` (from API)
- **Validates**: Finite decimals (not NaN, not Infinity)
- **Returns**: `Decimal` object
- **Use for**: Calculations with any decimal values

```typescript
import { decimal } from '@packages/schemas/decimal'

const schema = z.object({
  amount: decimal,
})

const result = schema.parse({ amount: "123.456" })
result.amount.plus(10)  // Decimal object - can do math
result.amount.toString() // "123.456"
```

### 2. `decimalString`

Basic decimal validator - returns string.

- **Input**: `string` (from API)
- **Validates**: Finite decimals (not NaN, not Infinity)
- **Returns**: `string`
- **Use for**: Storing general decimal values in database

```typescript
import { decimalString } from '@packages/schemas/decimal'

const schema = z.object({
  amount: decimalString,
})

schema.parse({ amount: "123.456" })  // ✅ "123.456"
schema.parse({ amount: "-45.67" })   // ✅ "-45.67"
schema.parse({ amount: "NaN" })      // ❌ Error
schema.parse({ amount: "Infinity" }) // ❌ Error
```

### 3. `money`

Monetary values validator - returns Decimal object.

- **Input**: `string` (from API)
- **Validates**: Positive (>= 0), max 2 decimals, precision 10 (matches DB `decimal(10,2)`)
- **Returns**: `Decimal` object
- **Use for**: Calculations with money (tax, totals, discounts)

```typescript
import { money } from '@packages/schemas/decimal'

const orderSchema = z.object({
  subtotal: money,
  tax: money,
})

const result = orderSchema.parse({ 
  subtotal: "100.00", 
  tax: "10.00" 
})

// Calculate total using Decimal methods
const total = result.subtotal.plus(result.tax)
total.toString() // "110"
```

### 4. `moneyString`

Monetary values validator - returns formatted string.

- **Input**: `string` (from API)
- **Validates**: Positive (>= 0), max 2 decimals, precision 10 (matches DB `decimal(10,2)`)
- **Returns**: `string` with exactly 2 decimal places
- **Use for**: Storing prices in database, API responses

```typescript
import { moneyString } from '@packages/schemas/decimal'

const productSchema = z.object({
  price: moneyString,
})

productSchema.parse({ price: "99.99" })        // ✅ "99.99"
productSchema.parse({ price: "10" })           // ✅ "10.00" (formatted to 2 decimals)
productSchema.parse({ price: "10.5" })         // ✅ "10.50" (formatted to 2 decimals)
productSchema.parse({ price: "0" })            // ✅ "0.00"
productSchema.parse({ price: "-10" })          // ❌ Error (must be positive)
productSchema.parse({ price: "99.999" })       // ❌ Error (max 2 decimals)
productSchema.parse({ price: "999999999.99" }) // ❌ Error (exceeds precision)
```

## Quick Reference

| Schema | Input | Output | Negative? | Max Decimals | Max Value |
|--------|-------|--------|-----------|--------------|-----------|
| `decimal` | `string` | `Decimal` | ✅ Yes | Very large* | Very large* |
| `decimalString` | `string` | `string` (as-is) | ✅ Yes | Very large* | Very large* |
| `money` | `string` | `Decimal` | ❌ No | 2 | 99,999,999.99 |
| `moneyString` | `string` | `string` (always 2 decimals) | ❌ No | 2 | 99,999,999.99 |

*Decimal.js supports extremely large numbers (exponent range ±9e15) but is not mathematically infinite.

## Naming Convention

- **Base name** (e.g., `decimal`, `money`) → Returns `Decimal` object for calculations
- **`...String` suffix** (e.g., `decimalString`, `moneyString`) → Returns `string` for storage

**Note**: `moneyString` uses `toFixed(2)` to ensure consistent formatting with exactly 2 decimal places. `decimalString` uses `toString()` which preserves the input format without adding trailing zeros.
