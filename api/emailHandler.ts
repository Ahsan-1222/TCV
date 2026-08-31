import { Resend } from 'resend';

/**
 * Escapes HTML characters in user-provided text to prevent injection vulnerabilities.
 */
function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats currency values in PKR (Rs.)
 */
function formatCurrency(amount: number | string): string {
  const num = Number(amount) || 0;
  return 'Rs. ' + num.toLocaleString('en-PK');
}

/**
 * Generates clean, professional HTML email for new order alerts.
 */
export function generateOrderHtml(order: any): string {
  const safeId = escapeHtml(order.orderId || 'N/A');
  const safeName = escapeHtml(order.name || 'N/A');
  const safeEmail = escapeHtml(order.email || 'N/A');
  const safePhone = escapeHtml(order.phone || 'N/A');
  const safeAddress = escapeHtml(order.address || 'N/A');
  const safeCity = escapeHtml(order.city || 'N/A');
  const safeProvince = escapeHtml(order.province || 'N/A');
  const safePayment = escapeHtml(order.payment ? String(order.payment).toUpperCase() : 'N/A');
  const safeStatus = escapeHtml(order.status ? String(order.status).toUpperCase() : 'PENDING');
  
  let orderDate = 'N/A';
  if (order.createdAt) {
    if (typeof order.createdAt === 'string') {
      orderDate = escapeHtml(order.createdAt);
    } else if (order.createdAt.seconds) {
      orderDate = escapeHtml(new Date(order.createdAt.seconds * 1000).toLocaleString());
    } else {
      orderDate = escapeHtml(new Date().toLocaleString());
    }
  } else {
    orderDate = escapeHtml(new Date().toLocaleString());
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const itemsHtml = items.map((item: any, index: number) => {
    const productName = escapeHtml(item.product?.name || `Product #${index + 1}`);
    const quantity = item.quantity || 1;
    const price = item.product?.price || 0;
    const lineTotal = price * quantity;
    const variantInfo = item.variant?.name ? `<br><small style="color: #888888;">Variant: ${escapeHtml(item.variant.name)}</small>` : '';

    return `
      <tr>
        <td style="padding: 12px 15px; border-bottom: 1px solid #222222; color: #FFFFFF; font-size: 14px;">
          <strong>${productName}</strong>${variantInfo}
        </td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #222222; color: #CCCCCC; font-size: 14px; text-align: center;">
          ${quantity}
        </td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #222222; color: #CCCCCC; font-size: 14px; text-align: right;">
          ${formatCurrency(price)}
        </td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #222222; color: #C09450; font-size: 14px; font-weight: bold; text-align: right;">
          ${formatCurrency(lineTotal)}
        </td>
      </tr>
    `;
  }).join('');

  const subtotal = order.subtotal ?? order.total ?? 0;
  const shipping = order.shipping ?? 0;
  const discount = order.discount ?? 0;
  const grandTotal = order.total ?? 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order #${safeId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #E5E5E5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #111111; border: 1px solid #2A2A2A; border-radius: 8px; overflow: hidden; max-width: 600px; width: 100%;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #161616; padding: 30px; text-align: center; border-bottom: 2px solid #C09450;">
              <h1 style="margin: 0; color: #C09450; font-size: 22px; letter-spacing: 3px; text-transform: uppercase;">THE CROWN VAULT</h1>
              <p style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 16px; font-weight: 600;">🔔 New Order Received</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Order Summary Header Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order ID</td>
                        <td style="color: #C09450; font-size: 15px; font-weight: bold; text-align: right;">#${safeId}</td>
                      </tr>
                      <tr>
                        <td style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-top: 8px;">Order Date</td>
                        <td style="color: #DDDDDD; font-size: 13px; text-align: right; padding-top: 8px;">${orderDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-top: 8px;">Payment Method</td>
                        <td style="color: #DDDDDD; font-size: 13px; font-weight: 600; text-align: right; padding-top: 8px;">${safePayment}</td>
                      </tr>
                      <tr>
                        <td style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-top: 8px;">Order Status</td>
                        <td style="color: #25D366; font-size: 13px; font-weight: 600; text-align: right; padding-top: 8px;">${safeStatus}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Customer Details Card -->
              <h3 style="color: #C09450; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0;">👤 Customer Information</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 18px; font-size: 13px; line-height: 1.8; color: #CCCCCC;">
                    <strong style="color: #FFFFFF;">Name:</strong> ${safeName}<br>
                    <strong style="color: #FFFFFF;">Phone:</strong> ${safePhone}<br>
                    <strong style="color: #FFFFFF;">Email:</strong> ${safeEmail}<br>
                    <strong style="color: #FFFFFF;">Shipping Address:</strong> ${safeAddress}, ${safeCity}, ${safeProvince}
                  </td>
                </tr>
              </table>

              <!-- Ordered Products Table -->
              <h3 style="color: #C09450; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0;">📦 Order Items</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 25px; background-color: #181818; border: 1px solid #262626; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #202020; text-align: left;">
                    <th style="padding: 10px 15px; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Product</th>
                    <th style="padding: 10px 15px; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Qty</th>
                    <th style="padding: 10px 15px; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Price</th>
                    <th style="padding: 10px 15px; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Financial Summary -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #888888; font-size: 13px; padding-bottom: 6px;">Subtotal</td>
                        <td style="color: #DDDDDD; font-size: 13px; text-align: right; padding-bottom: 6px;">${formatCurrency(subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="color: #888888; font-size: 13px; padding-bottom: 6px;">Shipping Charges</td>
                        <td style="color: #DDDDDD; font-size: 13px; text-align: right; padding-bottom: 6px;">${shipping === 0 ? 'Free Shipping' : formatCurrency(shipping)}</td>
                      </tr>
                      ${discount > 0 ? `
                      <tr>
                        <td style="color: #C09450; font-size: 13px; padding-bottom: 6px;">Discount</td>
                        <td style="color: #C09450; font-size: 13px; text-align: right; padding-bottom: 6px;">- ${formatCurrency(discount)}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="color: #FFFFFF; font-size: 15px; font-weight: bold; border-t: 1px solid #333333; padding-top: 10px;">Total Amount</td>
                        <td style="color: #C09450; font-size: 18px; font-weight: bold; text-align: right; border-t: 1px solid #333333; padding-top: 10px;">${formatCurrency(grandTotal)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #161616; padding: 20px; text-align: center; border-t: 1px solid #262626; color: #666666; font-size: 12px;">
              This is an automated transactional order alert from <strong>THE CROWN VAULT</strong> system.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends an email notification using Resend API.
 */
export async function sendOrderEmail(orderData: any): Promise<{ success: boolean; error?: string; data?: any }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@thecrownvault.com';
  const emailFrom = process.env.EMAIL_FROM || 'THE CROWN VAULT <onboarding@resend.dev>';

  if (!apiKey || !apiKey.trim()) {
    const warnMsg = '[Resend Email] RESEND_API_KEY is not set in environment variables. Email alert skipped.';
    console.warn(warnMsg);
    return { success: false, error: 'RESEND_API_KEY environment variable is not configured.' };
  }

  if (!orderData || !orderData.orderId) {
    return { success: false, error: 'Invalid order data payload.' };
  }

  try {
    const resend = new Resend(apiKey.trim());
    const subject = `🛍️ New Order Received - Order #${orderData.orderId}`;
    const htmlContent = generateOrderHtml(orderData);

    console.log(`[Resend Email] Attempting to send order email for #${orderData.orderId} to ${adminEmail}...`);

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Email Error]', error);
      return { success: false, error: error.message || JSON.stringify(error) };
    }

    console.log(`[Resend Email Success] Email sent for Order #${orderData.orderId}. Resend ID: ${data?.id}`);
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Email Exception]', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error sending email via Resend' 
    };
  }
}
