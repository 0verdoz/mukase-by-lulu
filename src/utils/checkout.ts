import { CartItem, CustomerDetails, Order } from '../types';

export const LULU_PHONE_NUMBER = '14045550198'; // Lulu's official business WhatsApp/SMS line
export const LULU_CASHAPP_TAG = '$MukaseByLulu';
export const LULU_ZELLE_CONTACT = 'orders@mukasebylulu.com (404-555-0198)';
export const LULU_APPLE_CASH = '404-555-0198';

/**
 * Generate a unique 6-character order tracking code
 * e.g., MUK-8492
 */
export function generateOrderCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MUK-${randomNum}`;
}

/**
 * Format the full order message for WhatsApp, iMessage, and SMS
 */
export function formatOrderMessage(order: Order): string {
  const { id, customer, items, subtotal, deliveryFee, tax, total } = order;

  let itemDetails = '';
  items.forEach((item, index) => {
    const isOffMenu = item.customization?.isOffMenuCustom;
    const title = isOffMenu && item.customization?.offMenuDishName
      ? `[CUSTOM CHEF SPECIAL] ${item.customization.offMenuDishName}`
      : item.menuItem.name;

    itemDetails += `${index + 1}. *${item.quantity}x ${title}* — $${item.itemTotalPrice.toFixed(2)}\n`;
    if (item.customization) {
      if (item.customization.selectedSideOrSwallow) {
        itemDetails += `   • Side/Swallow: ${item.customization.selectedSideOrSwallow}\n`;
      }
      if (item.customization.protein) {
        itemDetails += `   • Protein: ${item.customization.protein} ${item.customization.proteinExtraPrice > 0 ? `(+$${item.customization.proteinExtraPrice.toFixed(2)})` : ''}\n`;
      }
      itemDetails += `   • Spice: ${item.customization.spiceLevel}\n`;
      if (item.customization.selectedAddOns.length > 0) {
        const addOnsStr = item.customization.selectedAddOns.map(a => `${a.name} (+$${a.price.toFixed(2)})`).join(', ');
        itemDetails += `   • Add-ons: ${addOnsStr}\n`;
      }
      if (item.customization.customizationFee && item.customization.customizationFee > 0) {
        itemDetails += `   • Custom Prep Surcharge: +$${item.customization.customizationFee.toFixed(2)}\n`;
      }
      if (item.customization.offMenuDetails) {
        itemDetails += `   • Dish Details: "${item.customization.offMenuDetails}"\n`;
      }
      if (item.customization.specialInstructions) {
        itemDetails += `   • Kitchen Note: "${item.customization.specialInstructions}"\n`;
      }
    }
  });

  const paymentMethodLabel = 
    customer.preferredPayment === 'cashapp' ? `Cash App (${LULU_CASHAPP_TAG})` :
    customer.preferredPayment === 'zelle' ? `Zelle (${LULU_ZELLE_CONTACT})` :
    `Apple Cash (${LULU_APPLE_CASH})`;

  return `🍲 *MUKASE BY LULU — ORDER REQUEST*
Order Code: *${id}*
Date: ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
------------------------------------------
👤 *CUSTOMER DETAILS:*
• Name: ${customer.name}
• Phone: ${customer.phone}
• Delivery Address: ${customer.address}${customer.apartmentSuite ? `, Apt/Ste ${customer.apartmentSuite}` : ''}, ${customer.city}
${customer.deliveryNotes ? `• Instructions: ${customer.deliveryNotes}\n` : ''}
📋 *FOOD ITEMS:*
${itemDetails}
💵 *FINANCIAL BREAKDOWN:*
• Food Subtotal: $${subtotal.toFixed(2)}
• Delivery Fee: $${deliveryFee.toFixed(2)}
• Tax & Fees: $${tax.toFixed(2)}
• *TOTAL DUE: $${total.toFixed(2)}*
------------------------------------------
💳 *PAYMENT INSTRUCTIONS:*
Method: ${paymentMethodLabel}
Sender Handle/Name: ${customer.paymentIdentifier || 'Not provided'}
⚠️ *MANDATORY ANTI-FRAUD MEMO:* "${id}"

Please include your exact Order Code *${id}* in your payment memo/note so Chef Lulu's staff can instantly verify your payment and start cooking!`;
}

/**
 * Generate WhatsApp Direct Link
 */
export function getWhatsAppUrl(order: Order): string {
  const message = formatOrderMessage(order);
  return `https://wa.me/${LULU_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate iMessage / SMS Link with encoded body
 * iOS uses &body=, Android often uses ?body=
 */
export function getSmsUrl(order: Order, isAppleDevice: boolean = false): string {
  const message = formatOrderMessage(order);
  const separator = isAppleDevice ? '&' : '?';
  return `sms:${LULU_PHONE_NUMBER}${separator}body=${encodeURIComponent(message)}`;
}

/**
 * Detect if user is on iOS / macOS (for native iMessage routing)
 */
export function isApplePlatform(): boolean {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|macintosh/.test(ua);
}
