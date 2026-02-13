# Lunaria Order System Setup

Follow these steps to complete the setup of your order system.

## 1. Google Sheets Setup

1. Create a new Google Sheet.
2. Rename the sheet tab to `Sheet1` (default).
3. Add the following headers in the first row:
   | Order ID | Date | Time | Name | Phone | Email | Address | Product | Quantity | Price | Delivery | Total | Payment | Type | Status |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 2. Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a Project.
3. Enable **Google Sheets API**.
4. Create **Service Account** credentials.
5. Download the JSON key file.
6. Share your Google Sheet with the `client_email` from the JSON key file (give Editor access).

## 3. Environment Variables

Add the following to your `.env.local` (for local dev) and Vercel Project Settings:

```env
GOOGLE_SHEET_ID=your_spreadsheet_id_from_url
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key_including_newlines"
```

## 4. Run Locally

To test the API locally, you need Vercel CLI because Vite doesn't serve `/api` functions by default.

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel dev`
3. Visit `http://localhost:3000`

If you only run `npm run dev`, the frontend will work but the checkout submission will fail (404 on `/api/submit-order`).

## 5. Deployment

1. Push changes to GitHub.
2. Vercel will automatically deploy.
3. Ensure Environment Variables are set in Vercel.
