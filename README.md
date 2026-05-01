# Braniva Oils Cash On Delivery Funnel

Complete Next.js sales funnel for Braniva Rice Bran Oil with:

- Product landing page at `/`
- Checkout page at `/checkout`
- Thank you page at `/thank-you`
- Order API at `/api/order`
- Google Spreadsheet order saving
- Business Gmail order notification
- Customer order received email

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Google Sheets API via `googleapis`
- Gmail/SMTP email via `nodemailer`

## Local Setup

```bash
npm.cmd install
npm.cmd run optimize:images
npm.cmd run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUSINESS_EMAIL=tejnarayan1667@gmail.com
EMAIL_FROM=tejnarayan1667@gmail.com
BRAND_NAME=Braniva Oils

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=Braniva oils order
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

EMAIL_SERVICE_API_KEY=

FRONTEND_URL=http://localhost:3000
```

For Gmail SMTP, use a Gmail App Password in `SMTP_PASS`, not your normal Gmail password.

## Google Spreadsheet Setup

1. Create a Google Spreadsheet.
2. Rename the sheet/tab to `Braniva oils order` or set your own name in `GOOGLE_SHEET_TAB_NAME`.
3. Add these columns in row 1:

```text
Order ID
Date & Time
Customer Name
Phone Number
Email Address
Exact Location
Product Name
Quantity
Price Per Piece
Total Price
Payment Method
Order Status
Notes
```

4. Select the header row and enable filters from `Data > Create a filter`.
5. Add a dropdown for the `Order Status` column from `Data > Data validation`.
6. Use these status options:

```text
New Order
Order Confirmed
Order Ongoing
Delivered
Cancelled
```

7. Copy the Google Sheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/[THIS_IS_THE_SHEET_ID]/edit
```

8. Create a Google Cloud service account and enable the Google Sheets API.
9. Add the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
10. Add the private key to `GOOGLE_PRIVATE_KEY`. Keep the `\n` newline characters if pasting into Vercel.
11. Share the spreadsheet with the service account email as an Editor.

## Order Flow

1. Customer chooses a product size and quantity on the landing page.
2. The CTA passes product name, quantity, price per piece, and total price to `/checkout`.
3. Customer enters name, phone, email, and exact location.
4. The checkout form posts JSON to `/api/order`.
5. The API validates all required fields and verifies the total price.
6. The API creates an order ID, date/time, payment method `Cash On Delivery`, and status `New Order`.
7. The API appends the order to Google Sheets.
8. The API sends the business order notification email.
9. The API sends the customer order received email.
10. The customer is redirected to `/thank-you`.

## Testing Order Submission

Before credentials are added, submitting an order should return a clear missing environment variable error. After credentials are added:

1. Start the app with `npm.cmd run dev`.
2. Place a test order from the landing page.
3. Confirm the row appears in the Google Sheet.
4. Confirm the business email arrives at `BUSINESS_EMAIL`.
5. Confirm the customer receives the order email.
6. Confirm the browser redirects to `/thank-you`.

## Deploying on Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to your production domain.
5. Deploy.
6. Place a real test order after deployment.

## Editing Products

Product prices, offers, benefits, testimonials, FAQs, and video links are in:

```text
src/lib/product.ts
```

Replace images in:

```text
public/images
```
