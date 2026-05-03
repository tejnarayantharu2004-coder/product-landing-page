import nodemailer from "nodemailer";
import type { OrderRecord } from "./order-schema";

function env(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function currency(value: number) {
  return `NPR ${Number(value).toLocaleString("en-NP")}`;
}

function baseShell(title: string, body: string) {
  return `
  <div style="margin:0;padding:0;background:#f8f3e8;font-family:Arial,Helvetica,sans-serif;color:#173326;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f3e8;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #eadcbf;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#0f5132;padding:26px 28px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:1.4px;text-transform:uppercase;color:#f6c34a;font-weight:700;">${process.env.BRAND_NAME || "Braniva Oils"}</div>
                <h1 style="margin:8px 0 0;font-size:26px;line-height:1.25;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function row(label: string, value: string | number) {
  return `<tr><td style="padding:9px 0;color:#6b705f;font-size:14px;">${label}</td><td align="right" style="padding:9px 0;font-weight:700;font-size:14px;color:#173326;">${value}</td></tr>`;
}

function detailsTable(rows: string) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #efe2c7;border-bottom:1px solid #efe2c7;margin:14px 0 20px;">${rows}</table>`;
}

export function businessEmailHtml(order: OrderRecord) {
  const body = `
    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">A new Cash on Delivery order has been received.</p>
    <div style="display:inline-block;background:#e8f5ed;color:#0f5132;border-radius:999px;padding:8px 14px;font-weight:700;font-size:13px;margin-bottom:18px;">New Order</div>
    ${detailsTable(
      row("Order ID", order.orderId) +
        row("Date & Time", order.dateTime) +
        row("Customer Name", order.customerName) +
        row("Phone Number", order.phone) +
        row("Email Address", order.email) +
        row("Exact Location", order.location)
    )}
    <h2 style="font-size:18px;margin:0 0 10px;color:#0f5132;">Product Details</h2>
    ${detailsTable(
      row("Product Name", order.productName) +
        row("Quantity", order.quantity) +
        row("Price Per Piece", currency(order.pricePerPiece)) +
        row("Total Price", currency(order.totalPrice))
    )}
    <h2 style="font-size:18px;margin:0 0 10px;color:#0f5132;">Payment Details</h2>
    ${detailsTable(row("Payment Method", order.paymentMethod) + row("Order Status", order.orderStatus))}
    <div style="background:#fff8e8;border-left:4px solid #d7a11f;padding:16px;border-radius:10px;font-weight:700;color:#4f3a07;">Please call the customer soon to confirm this order.</div>
  `;
  return baseShell(`New order received`, body);
}

export function customerEmailHtml(order: OrderRecord) {
  const brand = process.env.BRAND_NAME || "Braniva Oils";
  const reply = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || "";
  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;">Hi ${order.customerName},</p>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">Thank you for your order. We have received your order successfully.</p>
    ${detailsTable(
      row("Order ID", order.orderId) +
        row("Product", order.productName) +
        row("Quantity", order.quantity) +
        row("Total Price", currency(order.totalPrice)) +
        row("Payment Method", order.paymentMethod)
    )}
    <div style="background:#e8f5ed;border-left:4px solid #0f5132;padding:16px;border-radius:10px;margin:18px 0;color:#173326;">Our sales representative will call you soon to confirm your order.</div>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">For support or changes, reply to this email: <strong>${reply}</strong></p>
    <p style="margin:18px 0 0;font-size:16px;line-height:1.6;">Thank you,<br/><strong>${brand}</strong></p>
  `;
  return baseShell(`Thank you for your order`, body);
}

export async function sendOrderEmails(order: OrderRecord) {
  const port = Number(env("SMTP_PORT"));
  const smtpPass = env("SMTP_PASS").replace(/\s/g, "");
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const from = env("EMAIL_FROM");
  const businessEmail = env("BUSINESS_EMAIL");
  const brand = process.env.BRAND_NAME || "Braniva Oils";

  const mailOptions = [
    {
      from,
      to: businessEmail,
      replyTo: order.email,
      subject: `New Product Order Received - ${order.orderId}`,
      html: businessEmailHtml(order)
    },
    {
      from,
      to: order.email,
      replyTo: from,
      subject: `Your Order Has Been Received - ${brand}`,
      html: customerEmailHtml(order)
    }
  ];

  async function sendWithTransport(transportPort: number) {
    const transporter = nodemailer.createTransport({
      host,
      port: transportPort,
      secure: transportPort === 465,
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 20000,
      auth: {
        user,
        pass: smtpPass
      }
    });

    await Promise.all(mailOptions.map((options) => transporter.sendMail(options)));
  }

  try {
    await sendWithTransport(port);
  } catch (error) {
    if (host.includes("gmail.com") && port === 465) {
      console.warn("Gmail SMTP port 465 failed; retrying with port 587.", error);
      await sendWithTransport(587);
      return;
    }

    throw error;
  }
}
