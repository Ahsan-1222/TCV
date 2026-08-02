export const AnnouncementBar = () => {
  return (
    <div className="bg-[#0A0A0A] text-white text-[11px] tracking-[0.18em] uppercase py-2.5 px-4 flex items-center justify-center gap-6 overflow-hidden">
      <div className="flex items-center gap-6 animate-[marquee_30s_linear_infinite] whitespace-nowrap md:animate-none">
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 bg-crown-gold rounded-full"></span>
          ✨ Cash on Delivery: Original Price
        </span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="hidden md:inline font-bold text-crown-gold">Pay Online & Get Rs. 100 OFF ✨</span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="hidden md:inline">Nationwide Delivery</span>
      </div>
    </div>
  );
};
