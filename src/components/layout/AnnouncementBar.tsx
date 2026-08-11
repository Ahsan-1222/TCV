export const AnnouncementBar = () => {
  const items = [
    '✦ Cash on Delivery Available',
    '✦ Pay Online & Get Rs. 100 OFF',
    '✦ Nationwide Delivery',
    '✦ WhatsApp Order: +92 321 7244813',
    '✦ 100% Authentic Luxury Products',
  ];

  const marqueeContent = [...items, ...items];

  return (
    <div className="bg-crown-gold overflow-hidden py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {marqueeContent.map((item, i) => (
          <span
            key={i}
            className="text-[#0A0A0A] text-[10px] tracking-[0.22em] uppercase font-semibold mx-8"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
