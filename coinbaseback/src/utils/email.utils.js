import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL;

/**
 * Email para confirmación de pago (Stripe)
 */
export async function sendStripeConfirmationEmail({ id, client_email, client_name }) {
  const url = `${FRONTEND_URL}/track-order`;

  const msg = {
    to: client_email,
    from: process.env.SENDGRID_SENDER,
    subject: `Order #${id} confirmed – Thank you for your payment`,
    html: `
      <h2>Thanks for your payment, ${client_name}!</h2>
      <p>Your order <strong>#${id}</strong> has been confirmed and paid via Stripe.</p>
      <p>You can track your order status here:</p>
      <p><a href="${url}" target="_blank">${url}</a></p>
      <br/>
      <p>We appreciate your business!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Stripe confirmation email sent to", client_email);
  } catch (error) {
    console.error("❌ Failed to send Stripe email:", error.response?.body || error.message);
    throw error;
  }
}

/**
 * Email para pagos manuales (Venmo/Zelle)
 */
export async function sendManualPaymentInstructions({ id, client_email, client_name }) {
  const url = `${FRONTEND_URL}/track-order?id=${id}`;

  const msg = {
    to: client_email,
    from: process.env.SENDGRID_SENDER,
    subject: `Order #${id} received – Upload your payment receipt`,
    html: `
      <h2>Hello ${client_name},</h2>
      <p>We received your order <strong>#${id}</strong>.</p>
      <p>To complete your purchase, please upload your payment receipt here:</p>
      <p><a href="${url}" target="_blank">${url}</a></p>
      <br/>
      <p>Once we verify the receipt, we’ll start processing your order.</p>
      <p>Thank you for shopping with us!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Manual payment email sent to", client_email);
  } catch (error) {
    console.error("❌ Failed to send manual payment email:", error.response?.body || error.message);
    throw error;
  }
}
