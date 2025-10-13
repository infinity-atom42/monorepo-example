# Decimal Schema

Shared decimal validation and transformation utilities using [decimal.js](https://mikemcl.github.io/decimal.js/) for arbitrary-precision decimal arithmetic.

## Why Use This?

JavaScript's native number type uses binary floating-point, which causes precision issues:

```javascript
0.1 + 0.2 // 0.30000000000000004 ❌
```

Decimal.js solves this:

```javascript
import { add } from '@packages/schemas/decimal'

add('0.1', '0.2') // '0.3' ✅
```

## Installation

This package is already available in the monorepo. Import from:

```typescript
import { add, formatCurrency, price } from '@packages/schemas/decimal'
```

## Validation Schemas

### Basic Schemas

#### `decimalString`

Validates that a string represents a valid decimal number.

```typescript
import { decimalString } from '@packages/schemas/decimal'

decimalString.parse('123.45') // '123.45'
decimalString.parse('1.23e-4') // '0.000123'
decimalString.parse('invalid') // throws ZodError
```

#### `decimal`

Transforms string to Decimal.js instance for calculations.

```typescript
import { decimal } from '@packages/schemas/decimal'

const value = decimal.parse('123.45') // Decimal instance
value.plus(10).toString() // '133.45'
```

### Pre-built Schemas

#### `price`

For monetary values (non-negative, max 2 decimal places).

```typescript
import { price } from '@packages/schemas/decimal'

price.parse('99.99') // ✅ '99.99'
price.parse('100') // ✅ '100'
price.parse('-10') // ❌ throws error
price.parse('10.555') // ❌ throws error (too many decimals)
```

#### `positiveDecimal`

Must be greater than 0.

```typescript
import { positiveDecimal } from '@packages/schemas/decimal'

positiveDecimal.parse('10.5') // ✅
positiveDecimal.parse('0') // ❌ throws error
```

#### `nonNegativeDecimal`

Must be greater than or equal to 0.

```typescript
import { nonNegativeDecimal } from '@packages/schemas/decimal'

nonNegativeDecimal.parse('10.5') // ✅
nonNegativeDecimal.parse('0') // ✅
nonNegativeDecimal.parse('-5') // ❌ throws error
```

#### `percentage`

0-100 with up to 2 decimal places.

```typescript
import { percentage } from '@packages/schemas/decimal'

percentage.parse('99.99') // ✅
percentage.parse('100') // ✅
percentage.parse('101') // ❌ throws error
```

## Schema Builders

### `decimalMin(min)`

Creates schema with minimum value constraint.

```typescript
import { decimalMin } from '@packages/schemas/decimal'

const positiveOnly = decimalMin(0)
positiveOnly.parse('10') // ✅
positiveOnly.parse('-5') // ❌
```

### `decimalMax(max)`

Creates schema with maximum value constraint.

```typescript
import { decimalMax } from '@packages/schemas/decimal'

const maxPrice = decimalMax(9999.99)
maxPrice.parse('100') // ✅
maxPrice.parse('10000') // ❌
```

### `decimalRange(min, max)`

Creates schema with min and max constraints.

```typescript
import { decimalRange } from '@packages/schemas/decimal'

const percentage = decimalRange(0, 100)
percentage.parse('50') // ✅
percentage.parse('101') // ❌
```

### `decimalPlaces(maxPlaces)`

Creates schema with decimal places constraint.

```typescript
import { decimalPlaces } from '@packages/schemas/decimal'

const twoDecimals = decimalPlaces(2)
twoDecimals.parse('10.50') // ✅
twoDecimals.parse('10.555') // ❌
```

## Helper Functions

### Arithmetic Operations

All operations return strings to maintain precision.

#### `add(...values)`

```typescript
import { add } from '@packages/schemas/decimal'

add('10.1', '20.2', '30.3') // '60.6'
add('0.1', '0.2') // '0.3' (no floating point issues!)
```

#### `subtract(a, b)`

```typescript
import { subtract } from '@packages/schemas/decimal'

subtract('10.5', '5.2') // '5.3'
```

#### `multiply(...values)`

```typescript
import { multiply } from '@packages/schemas/decimal'

multiply('10.5', '2', '3') // '63'
```

#### `divide(a, b, decimals?)`

```typescript
import { divide } from '@packages/schemas/decimal'

divide('10', '3') // '3.333333333333333333333333333333333333333'
divide('10', '3', 2) // '3.33' (rounded to 2 decimals)
```

#### `round(value, decimals)`

```typescript
import { round } from '@packages/schemas/decimal'

round('10.555', 2) // '10.56'
round('10.554', 2) // '10.55'
```

### Formatting

#### `formatCurrency(value, options?)`

```typescript
import { formatCurrency } from '@packages/schemas/decimal'

formatCurrency('99.5') // '$99.50'
formatCurrency('1234.567', { decimals: 3 }) // '$1,234.567'
formatCurrency('99.99', {
  currency: 'EUR',
  locale: 'de-DE',
}) // '99,99 €'
```

#### `formatPercentage(value, options?)`

```typescript
import { formatPercentage } from '@packages/schemas/decimal'

formatPercentage('0.125') // '12.50%' (0.125 = 12.5%)
formatPercentage('50', { isDecimal: false }) // '50.00%'
```

## Real-World Examples

### E-commerce Product Schema

```typescript
import { createInsertSchema } from 'drizzle-zod'

import { price as priceSchema } from '@packages/schemas/decimal'

import { products } from './schema'

const productRefinements = {
  price: () => priceSchema,
}

export const createProductBody = createInsertSchema(products, productRefinements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
```

### Price Calculations

```typescript
import { add, formatCurrency, multiply } from '@packages/schemas/decimal'

// Calculate order total
const itemPrice = '29.99'
const quantity = '3'
const taxRate = '0.08'

const subtotal = multiply(itemPrice, quantity) // '89.97'
const tax = multiply(subtotal, taxRate) // '7.1976'
const total = add(subtotal, tax) // '97.1676'

console.log(formatCurrency(total)) // '$97.17'
```

### Discount Calculations

```typescript
import { formatPercentage, multiply, subtract } from '@packages/schemas/decimal'

const originalPrice = '100.00'
const discountPercent = '15' // 15%

const discountAmount = multiply(originalPrice, '0.15') // '15.00'
const finalPrice = subtract(originalPrice, discountAmount) // '85.00'

console.log(`Save ${formatPercentage(discountPercent, { isDecimal: false })}!`)
// 'Save 15.00%!'
```

### Percentage Calculations

```typescript
import { divide, formatPercentage } from '@packages/schemas/decimal'

const completed = '75'
const total = '100'

const percentComplete = divide(completed, total) // '0.75'
console.log(formatPercentage(percentComplete)) // '75.00%'
```

## Direct Decimal.js Usage

For advanced operations, import the Decimal class directly:

```typescript
import { Decimal } from '@packages/schemas/decimal'

const x = new Decimal('123.456')
const y = new Decimal('987.654')

x.plus(y) // Decimal instance
x.times(2) // Decimal instance
x.sqrt() // Decimal instance
x.toFixed(2) // '123.46'
```

See the [decimal.js documentation](https://mikemcl.github.io/decimal.js/) for all available methods.

## Best Practices

1. **Always use strings for input** to avoid JavaScript floating-point issues:

   ```typescript
   // ❌ DON'T
   price.parse(10.99) // might have precision issues

   // ✅ DO
   price.parse('10.99') // always accurate
   ```

2. **Store decimals as strings in your database** (use Drizzle's `decimal` type):

   ```typescript
   import { decimal } from 'drizzle-orm/pg-core'

   export const products = pgTable('products', {
     price: decimal('price', { precision: 10, scale: 2 }).notNull(),
   })
   ```

3. **Use helper functions** for calculations to maintain precision:

   ```typescript
   // ❌ DON'T
   const total = parseFloat(price1) + parseFloat(price2)

   // ✅ DO
   const total = add(price1, price2)
   ```

4. **Format for display, not storage**:

   ```typescript
   // Store as string
   const price = '99.99'
   // Format for display
   const displayPrice = formatCurrency(price) // '$99.99'
   ```

## API Reference

For complete API documentation, see the [decimal.js docs](https://mikemcl.github.io/decimal.js/).
