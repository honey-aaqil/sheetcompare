# SheetCompare

SheetCompare is a React web app for comparing two spreadsheet files and surfacing data differences quickly.

Upload two files, choose the fields to match and compare, then review results across focused views:

- Missing Records: shows whether each key from Sheet 1 exists in Sheet 2.
- Fetch Data: pulls a selected field from Sheet 2 into Sheet 1 rows by key.
- Compare Values: compares a selected field between both sheets with Match or Mismatch status.

The app runs fully in the browser and uses client-side parsing and export.

## Features

- Drag-and-select style file upload for two sheets
- Supports `.xlsx`, `.xls`, and `.csv`
- Automatic header detection and field configuration
- Case-insensitive key matching
- Smart comparison summary with key metrics
- One-click export of active tab results to Excel
- Lightweight, responsive UI powered by React + Vite

## Tech Stack

- React 19
- Vite 8
- xlsx (SheetJS) for spreadsheet parsing/export
- lucide-react for icons
- ESLint 9 for linting

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open the local URL shown in your terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Start local development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## How It Works

1. Upload Sheet 1 and Sheet 2.
2. Click Start Compare.
3. Select the fields:
- Key Field: identifier used to match rows across both sheets.
- Compare Field: value checked between sheets.
- Fetch Field: value pulled from Sheet 2 for matched keys.
4. Review results in each tab.
5. Export active tab results to an Excel file.

## Project Structure

```text
src/
	components/
		ComparisonDashboard.jsx
		FileUploader.jsx
		Instructions.jsx
	hooks/
		useComparison.js
	App.jsx
	App.css
	index.css
	main.jsx
```

## Result Logic Summary

- Missing Records:
	For every row in Sheet 1, check if `keyField` exists in Sheet 2.
- Fetch Data:
	Build a lookup map from Sheet 2 by `keyField`, then attach `fetchField` values to Sheet 1 rows.
- Compare Values:
	Compare `compareField` from Sheet 1 and Sheet 2 for the same key, marking Match, Mismatch, or Not Found.

## Notes

- Comparison keys are normalized with trim + lowercase matching.
- Only the first sheet in a workbook is parsed.
- Empty sheets are rejected with a user-facing error toast.

## Roadmap Ideas

- Multi-sheet selection support
- Duplicate key conflict handling options
- Column mapping for mismatched header names
- Pagination/virtualized rendering for very large datasets
- Download reports with multiple tabs in one workbook
