# Constants Directory

This directory contains shared constants and reference data used throughout the application.

## Files

### `countries.js`

Contains the list of all countries with their ISO codes and display labels.

**Exports:**

- `countries` - Array of country objects with `value` (country code) and `label` (country name)
- `getCountryLabel(code)` - Helper function to get country name from code
- `getCountryCode(label)` - Helper function to get country code from name

**Usage:**

```javascript
import { countries, getCountryLabel } from "../constants/countries";
// or
import { countries, getCountryLabel } from "../constants";

// Use in a dropdown
<Select>
  {countries.map((country) => (
    <MenuItem key={country.value} value={country.value}>
      {country.label}
    </MenuItem>
  ))}
</Select>;

// Get country name from code
const countryName = getCountryLabel("US"); // "United States"
```

### `index.js`

Central export file that re-exports all constants for cleaner imports.

## Adding New Constants

To add new constants:

1. Create a new file in this directory (e.g., `grades.js`, `roles.js`)
2. Export your constants from that file
3. Add the export to `index.js`
4. Document the new constant in this README

**Example:**

```javascript
// grades.js
export const grades = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Grade ${i + 1}`,
}));

// index.js
export { grades } from "./grades";
```

## Best Practices

- Keep constants immutable
- Use descriptive names
- Add JSDoc comments for complex constants
- Provide helper functions for common operations
- Group related constants in the same file
