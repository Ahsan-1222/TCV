export const About = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-16">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <div className="text-crown-gold text-[11px] tracking-[0.3em] uppercase mb-6">Our Blueprint</div>
          <h1 className="font-display text-[48px] leading-[0.9]">The Crown<br />Vault</h1>
          <div className="mt-8 space-y-5 text-[14px] leading-7 opacity-70 font-light max-w-[500px]">
            <p>THE CROWN VAULT is luxury curations adapted for Pakistan market. We operate on four pillars inspired by your blueprint: Perfume — primary focus, Bags — handbag schematic, Watches — timepiece layout, Jewellery — jewellery concept.</p>
            <p>Every product shot follows soft window photography, macro texture shot, and white marble staging. From stitch count per inch in our office totes to fine chain gauge in our pendants, we obsess over detail.</p>
            <p>ROOH Fragrances is our flagship perfume house — AQUA fresh & aquatic, AVANT bold & fruity-smoky, NOIR rich & warm oriental, GOLD spicy amber & oud extrait, VELVET smooth suede & musk extrait.</p>
          </div>
        </div>
        <div>
          <img src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.51 PM (1).jpeg')}`} alt="ROOH Gold Velvet" className="w-full object-cover aspect-[4/3]" />
          <div className="grid grid-cols-2 gap-[1px] bg-neutral-200 mt-[1px] border border-neutral-200">
            <div className="bg-white p-6"><div className="font-display text-2xl">COD</div><div className="text-[11px] uppercase tracking-widest opacity-60 mt-1">Available Nationwide, Pakistan Market Adaptation</div></div>
            <div className="bg-white p-6"><div className="font-display text-2xl">WhatsApp</div><div className="text-[11px] uppercase tracking-widest opacity-60 mt-1">Order & Inquiry — Premium responsive</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
