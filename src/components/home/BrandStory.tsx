import { ScrollReveal } from '../ui/ScrollReveal';
import { ScrollParallax } from '../ui/ScrollParallax';

export const BrandStory = () => {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">

        {/* Label */}
        <ScrollReveal direction="up" distance={16} duration={0.7}>
          <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-4 md:mb-6 flex items-center gap-3">
            <span className="h-px w-6 bg-crown-gold/60 inline-block" />
            Our Blueprint
          </div>
        </ScrollReveal>

        {/* Mobile layout */}
        <div className="md:hidden space-y-8">
          <ScrollReveal direction="up" distance={24} duration={0.85}>
            <h2 className="font-display text-[44px] sm:text-[56px] leading-[0.9] tracking-tight text-white">
              The Art<br />
              <span className="italic font-light text-crown-gold">of Curation.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="zoom" scale={0.96} duration={0.9}>
            <div className="relative aspect-[4/5] sm:aspect-[4/5] w-full max-h-[520px] sm:max-h-none overflow-hidden rounded-sm bg-[#111] border border-white/10 shadow-2xl">
              <ScrollParallax speed={0.1} offset={20} className="w-full h-full">
                <img
                  src="/assets/products/curation-art.jpg"
                  alt="TCV Art of Curation"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </ScrollParallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent pointer-events-none" />
              {/* Gold overlay strip */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-crown-gold" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={0.8} delay={0.1}>
            <div className="space-y-4 text-[13px] leading-[1.9] text-white/50 font-light">
              <p>Inspired by international blueprints, we translate luxury into an accessible, premium reality for the discerning Pakistani clientele.</p>
              <p>Soft window photography, matte finishes, and highly polished accents. Every detail is meticulously considered.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={0.8} stagger={0.1} className="flex items-center gap-10 border-t border-white/8 pt-6">
            {[['Est.', '2026'], ['Origin', 'Pakistan'], ['Products', '25+']].map(([label, val]) => (
              <div key={label}>
                <div className="font-display text-[28px] text-white leading-none">{val}</div>
                <div className="text-[8px] tracking-[0.28em] uppercase text-white/30 mt-1.5">{label}</div>
              </div>
            ))}
          </ScrollReveal>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Text */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <ScrollReveal direction="up" distance={32} duration={0.95}>
              <h2 className="font-display text-[64px] lg:text-[90px] xl:text-[112px] leading-[0.88] tracking-tight text-white lg:-mr-16">
                The Art<br />
                <span className="italic font-light text-crown-gold">of Curation.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={24} duration={0.85} delay={0.15}>
              <div className="mt-12 space-y-5 text-[14px] md:text-[15px] leading-[2] text-white/45 font-light max-w-[440px]">
                <p>Inspired by international blueprints, we translate luxury schematics into an accessible, premium reality for the discerning clientele.</p>
                <p>Soft window photography, matte finishes, and highly polished accents. Every detail is meticulously considered, stripping away the unnecessary to reveal pure elegance.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} duration={0.8} stagger={0.12} delay={0.25} className="mt-14 flex items-center gap-12 border-t border-white/8 pt-10">
              {[['Est.', '2026'], ['Origin', 'Pakistan'], ['Products', '25+']].map(([label, val]) => (
                <div key={label}>
                  <div className="font-display text-[36px] text-white leading-none">{val}</div>
                  <div className="text-[8px] tracking-[0.28em] uppercase text-white/30 mt-2">{label}</div>
                </div>
              ))}
            </ScrollReveal>
          </div>

          {/* Image with Luxury Parallax Scrub */}
          <ScrollReveal direction="zoom" scale={0.96} duration={1.1} className="order-1 lg:order-2 w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
            <div className="relative aspect-[4/5] sm:aspect-[4/5] w-full overflow-hidden rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <ScrollParallax speed={0.14} offset={28} className="w-full h-full">
                <img
                  src="/assets/products/curation-art.jpg"
                  alt="TCV Art of Curation"
                  className="w-full h-full object-cover object-center scale-110 transition-transform duration-[3s] ease-out hover:scale-115"
                />
              </ScrollParallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-crown-gold shadow-[0_0_8px_rgba(201,168,106,0.8)]" />
              {/* Logo watermark */}
              <div className="absolute bottom-6 right-6 w-14 h-14 bg-black/40 backdrop-blur-md p-2.5 flex items-center justify-center rounded-full border border-white/10 shadow-lg">
                <img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain brightness-0 invert opacity-90" />
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};

