import { google } from "googleapis";
import type { OrderRecord } from "./order-schema";

const columns = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes"
];

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(value: string) {
  let key = value.trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, "\n");
}

function quoteSheetName(name: string) {
  return `'${name.replace(/'/g, "''")}'`;
}

async function ensureSheetReady(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  preferredTabName: string
) {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title"
  });

  const existingSheets = metadata.data.sheets || [];
  const existingTitles = existingSheets.map((sheet) => sheet.properties?.title).filter(Boolean) as string[];
  const exactSheet =
    existingSheets.find((sheet) => sheet.properties?.title === preferredTabName) ||
    existingSheets.find((sheet) => sheet.properties?.title?.trim().toLowerCase() === preferredTabName.trim().toLowerCase());
  const exactTitle = exactSheet?.properties?.title;

  const tabName = exactTitle || preferredTabName;
  let sheetId = exactSheet?.properties?.sheetId;

  if (!exactTitle) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName
              }
            }
          }
        ]
      }
    });
    sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId;
  }

  const headerRange = `${quoteSheetName(tabName)}!A1:M1`;
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange
  });

  if (!headerResponse.data.values?.[0]?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [columns]
      }
    });
  }

  if (typeof sheetId === "number") {
    try {
      await formatOrderSheet(sheets, spreadsheetId, sheetId);
    } catch (error) {
      console.warn("Google Sheet formatting skipped:", error);
    }
  }

  return tabName;
}

async function formatOrderSheet(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, sheetId: number) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 1
              },
              tabColor: {
                red: 0.058,
                green: 0.318,
                blue: 0.196
              }
            },
            fields: "gridProperties.frozenRowCount,tabColor"
          }
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: columns.length
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.058,
                  green: 0.318,
                  blue: 0.196
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1
                  },
                  bold: true,
                  fontSize: 11
                }
              }
            },
            fields: "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)"
          }
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: columns.length
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 1,
                  green: 0.992,
                  blue: 0.969
                },
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 0.09,
                    green: 0.2,
                    blue: 0.15
                  },
                  fontSize: 10
                },
                wrapStrategy: "WRAP"
              }
            },
            fields: "userEnteredFormat(backgroundColor,verticalAlignment,textFormat,wrapStrategy)"
          }
        },
        {
          setBasicFilter: {
            filter: {
              range: {
                sheetId,
                startRowIndex: 0,
                startColumnIndex: 0,
                endColumnIndex: columns.length
              }
            }
          }
        },
        ...[
          { start: 0, end: 1, width: 170 },
          { start: 1, end: 2, width: 150 },
          { start: 2, end: 3, width: 180 },
          { start: 3, end: 4, width: 130 },
          { start: 4, end: 5, width: 220 },
          { start: 5, end: 6, width: 280 },
          { start: 6, end: 7, width: 260 },
          { start: 7, end: 8, width: 95 },
          { start: 8, end: 10, width: 130 },
          { start: 10, end: 11, width: 165 },
          { start: 11, end: 12, width: 150 },
          { start: 12, end: 13, width: 180 }
        ].map(({ start, end, width }) => ({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS" as const,
              startIndex: start,
              endIndex: end
            },
            properties: {
              pixelSize: width
            },
            fields: "pixelSize"
          }
        })),
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 8,
              endColumnIndex: 10
            },
            cell: {
              userEnteredFormat: {
                numberFormat: {
                  type: "CURRENCY",
                  pattern: '"NPR" #,##0'
                }
              }
            },
            fields: "userEnteredFormat.numberFormat"
          }
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 11,
              endColumnIndex: 12
            },
            cell: {
              dataValidation: {
                condition: {
                  type: "ONE_OF_LIST",
                  values: [
                    { userEnteredValue: "New Order" },
                    { userEnteredValue: "Order Confirmed" },
                    { userEnteredValue: "Order Ongoing" },
                    { userEnteredValue: "Delivered" },
                    { userEnteredValue: "Cancelled" }
                  ]
                },
                strict: true,
                showCustomUi: true
              },
              userEnteredFormat: {
                backgroundColor: {
                  red: 1,
                  green: 0.961,
                  blue: 0.78
                },
                textFormat: {
                  bold: true,
                  foregroundColor: {
                    red: 0.058,
                    green: 0.318,
                    blue: 0.196
                  }
                }
              }
            },
            fields: "dataValidation,userEnteredFormat(backgroundColor,textFormat)"
          }
        }
      ]
    }
  });
}

export async function appendOrderToSheet(order: OrderRecord) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(requiredEnv("GOOGLE_PRIVATE_KEY"));
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Braniva oils order";

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const readyTabName = await ensureSheetReady(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${quoteSheetName(readyTabName)}!A:M`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes
        ]
      ]
    }
  });
}

export { columns as sheetColumns };
