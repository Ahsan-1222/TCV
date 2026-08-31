export const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-PK')}`;

export const whatsappLink = (message: string, phone: string = "923217244813") => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

export const productWhatsAppMessage = (productName: string, price: number, url: string, color?: string) => {
  const colorStr = color ? ` (Color: ${color})` : '';
  return `Assalam-o-Alaikum! I'm interested in ${productName}${colorStr} (${formatPrice(price)}) from THE CROWN VAULT.\n\nProduct Link: ${url}\n\nIs this available for COD?`;
};

export const cartWhatsAppMessage = (items: { name: string; qty: number; price: number; color?: string }[], total: number) => {
  const lines = items.map(i => `• ${i.name}${i.color ? ' (Color: ' + i.color + ')' : ''} x${i.qty} - ${formatPrice(i.price * i.qty)}`).join('\n');
  return `Hello THE CROWN VAULT team!\nI want to place an order:\n\n${lines}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and delivery details. COD Available?`;
};
