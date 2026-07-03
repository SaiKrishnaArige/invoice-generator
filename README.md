# The Home Editors — Estimation Generator

A production-ready, client-side-only invoice/estimation generator for interior design
quotations. Built with React 19, TypeScript, Vite, Tailwind CSS, shadcn-style UI
primitives, React Hook Form + Zod, and React PDF. No backend — everything is stored in
the browser's LocalStorage.

## Features

- Client & quotation details form (auto-generated quotation number, dates, validation)
- Dynamic line-item table (add/delete rows) with auto-calculated **SFT** and **Amount**
- Optional extra charges (Transportation, False Ceiling, Kitchen Accessories, Electrical,
  Plumbing, Deep Cleaning, Custom)
- Summary panel: Total SFT, Subtotal, Discount %, GST %, Grand Total, Round Off, Final Total
- Terms & Conditions retained exactly from the source estimate, editable in Settings
- Split-screen live PDF preview (form on the left, printable A4 preview on the right),
  with a tabbed layout on mobile
- One-click high-quality PDF download (React PDF), with correct page breaks and a
  repeating header/footer
- Invoice History with search, load, duplicate and delete
- Export / Import all invoices as JSON
- Light/Dark mode
- Editable company logo, contact details, GST number, bank details, digital signature,
  company stamp, and a UPI payment QR code generated from your UPI ID

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui-style primitives ·
React Hook Form · Zod · @react-pdf/renderer · qrcode · LocalStorage (no backend)

## Project Structure

```
src/
  components/
    ui/          Reusable primitives (Button, Input, Card, Modal, ...)
    layout/       Toolbar, Settings
    invoice/      InvoiceHeader, InvoiceTable, InvoiceRow, InvoiceSummary,
                   ExtraCharges, TermsConditions, InvoiceForm
    pdf/          PDFDocument (react-pdf layout), PDFPreview (viewer + download)
    history/      InvoiceHistory
  context/         InvoiceContext (CRUD, totals), ThemeContext
  hooks/           useInvoice, useTheme, useLocalStorage, useAutoCalculate
  lib/             calculations.ts, validation.ts (Zod), storage.ts, defaults.ts, utils.ts
  pages/           EstimatorPage (split-screen layout)
  types/           Domain model
```

## 1. Local setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## 2. Production build

```bash
npm run build
npm run preview   # optional local check of the production build
```

## 3. Add this code to your Git repository

You said you've already created and cloned an empty repo. From inside your cloned
repo folder, copy in all the files from this project (everything except
`node_modules` and `dist`, which are already git-ignored), then:

```bash
cd path/to/your-cloned-repo

# copy in the project files (adjust the source path as needed)
# e.g. cp -r /path/to/the-home-editors-estimator/. .

npm install
git add .
git commit -m "Initial commit: The Home Editors Estimation Generator"
git push origin main
```

## 4. Deploy to GitHub Pages

1. Open `package.json` and update the `homepage` field with your GitHub username:
   ```json
   "homepage": "https://<your-github-username>.github.io/the-home-editors-estimator"
   ```
2. Open `vite.config.ts` and confirm `REPO_NAME` matches your repository's exact name
   (this sets the correct base path for GitHub Pages).
3. Install the deploy dependency (already in `package.json`) and deploy:
   ```bash
   npm run deploy
   ```
   This builds the app and pushes the `dist` folder to a `gh-pages` branch using the
   `gh-pages` package.
4. In your GitHub repository, go to **Settings → Pages** and set the source to the
   `gh-pages` branch (root). Your app will be live at the `homepage` URL above within
   a minute or two.

## Notes

- All data (invoices, company settings, theme) is stored in the browser's
  LocalStorage under keys prefixed `the-home-editors:estimator:*`. Nothing is sent to
  a server.
- Use **Export** in the toolbar to download a JSON backup of every saved invoice, and
  **Import** to restore or merge a backup on another device/browser.
- The Terms & Conditions text is pre-filled with the exact wording from the source
  estimate and can be edited from the Settings panel (gear icon) if it needs to change
  in future.
