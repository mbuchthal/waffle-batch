# Waffle Batch 🧇

**High-Performance React Faceting Engine**

`waffle-batch` is a specialized charting engine designed to render **thousands of small multiples** ("trellis charts") efficiently. It solves the performance bottlenecks of rendering massive dashboard grids by leveraging virtualization, shared resource scaling, and optimized data splitting.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19-blue)
![Vite](https://img.shields.io/badge/vite-6-purple)

## 🚀 Features

-   **High-Performance Rendering**: Uses `react-intersection-observer` to virtualize charts, rendering only what is in the viewport (with skeleton loading states).
-   **Trellis Architecture**: Automatically groups flat datasets into faceted grids based on any key (e.g., `Region`, `Category`).
-   **Shared Scales**: Calculates global min/max domains across the entire dataset to ensure visual consistency between charts.
-   **Statistical Sorting**: Built-in analytics engine to sort charts by:
    -   **Total Value** (Sum)
    -   **Volatility** (Standard Deviation)
    -   **Trend Direction** (Linear Regression Slope)
    -   **Custom Logic** (User-defined functions)
-   **Interactive Search & URL Sync**: Filters charts with debouncing and synchronizes state (Search, Sort, Config) with URL query parameters for deep linking.
-   **Contextual Drill-Down**: Supports clickable charts that can navigate to external dashboards (e.g., `waffle-board`) with context-specific query parameters.
-   **Responsive Layout**: CSS Grid-based layout that adapts chart width to available screen space.

## 📦 Installation
You can use `waffle-batch` as a standalone library in your React application.

```bash
npm install waffle-batch
# OR
npm install git+https://github.com/mbuchthal/waffle-batch.git
```

**Peer Dependencies:**
- `react` >= 18
- `react-dom` >= 18

## 🛠 Usage

### The `Trellis` Component

The core of the library is the `Trellis` component.

```tsx
import { Trellis } from 'waffle-batch';

// 1. Prepare your data (flat array)
const salesData = [
  { region: 'West', month: 'Jan', value: 400 },
  { region: 'West', month: 'Feb', value: 300 },
  // ...
  { region: 'East', month: 'Jan', value: 200 },
];

// 2. Render
<Trellis
  data={salesData}
  facetKey="region" // Group by 'region'
  valueKey="value"  // Metric for scaling/sorting
  ChartComponent={MyChartComponent} // Your chart renderer
  minChartWidth={300}
  height={150}
  sharedScale={true} // Enforce same Y-axis across all charts
  
  // Optional: Sorting
  sortConfig={{
    type: 'trend', // Sort by growth trend
    direction: 'desc'
  }}
  
  // Optional: Drill-Down Interaction
  onChartClick={(key) => {
     window.location.href = `/details?id=${key}`;
  }}
/>
```

### Sorting Config

The `sortConfig` prop accepts predefined algorithms or custom functions:

```typescript
// Sort by Volatility (Standard Deviation)
sortConfig={{ type: 'deviation', direction: 'desc' }}

// Sort by Custom Function (e.g., Max Value)
sortConfig={{ 
  type: (data) => Math.max(...data.map(d => d.value)),
  direction: 'desc' 
}}
```

## 🏗 Development

The project supports a dual-build workflow:

1.  **Demo App** (Development):
    ```bash
    npm run dev
    ```
    Starts the interactive playground with mock data generation.

2.  **Library Build** (Distribution):
    ```bash
    npm run build:lib
    ```
    Compiles `src/index.ts` into a redistributable package (`dist/lib`).

## ✅ Testing

Unit tests are written in **Vitest**.

```bash
npm test
```

Includes coverage for:
-   Faceting logic
-   Search debouncing
-   Sorting algorithms (including custom functions)
-   Shared scale calculation

## 📄 License

MIT
