/**
 * Client-side helper service to trigger email notifications via backend API route.
 */
export async function sendOrderNotificationEmail(orderData: any): Promise<{ success: boolean; error?: string }> {
  // Prevent duplicate notification attempts if flag is already set on order
  if (orderData?.emailNotificationSent) {
    console.log(`[Email Service] Order #${orderData.orderId} already sent notification email. Skipping duplicate.`);
    return { success: true };
  }

  try {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json().catch(() => ({
      success: false,
      error: `Server returned HTTP status ${response.status}`,
    }));

    if (response.ok && result.success) {
      console.log(`[Email Service] Email notification successfully dispatched for Order #${orderData.orderId}`);
      return { success: true };
    } else {
      console.warn(`[Email Service Warning] Email notification issue for Order #${orderData.orderId}:`, result.error || result);
      return { success: false, error: result.error || 'Server error sending email' };
    }
  } catch (error) {
    // Log error cleanly without interrupting customer checkout UI
    console.error(`[Email Service Error] Network exception while triggering email for Order #${orderData.orderId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reach email service endpoint',
    };
  }
}
