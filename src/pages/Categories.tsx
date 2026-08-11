import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';

export const CategoriesPage = () => {
  const { slug } = useParams();
  const products = useProducts();
  const filtered = slug ? products.filter(p => p.category === slug) : products;
  const title = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'All Categories';

  const descriptions: Record<string, string> = {
    perfume: 'Signature scents, long-lasting projection, gift box integration. ROOH AQUA, AVANT, NOIR, GOLD, VELVET.',
    bags: 'Structured office totes and evening clutch collection. Matte black leather with polished gold hardware.',
    jewellery: 'Highly polished gold, abstract pendant, fine chain gauge, diamond dust stone setting.',
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="mb-10">
          <Link to="/shop" className="text-[11px] tracking-widest uppercase text-white/50 hover:text-white transition-colors">← Back to Shop</Link>
          <h1 className="font-display text-[40px] leading-none mt-4 uppercase tracking-wide text-white">{title}</h1>
          {slug && descriptions[slug] && <p className="text-[13px] text-white/60 mt-3 max-w-[520px]">{descriptions[slug]}</p>}
        </div>

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-6">
        {['perfume', 'bags', 'jewellery'].map(cat => (
          <Link
            key={cat}
            to={`/categories/${cat}`}
            className={`px-5 py-2.5 text-[11px] tracking-widest uppercase border transition-all duration-200 ${
              slug === cat
                ? 'bg-crown-gold text-[#0A0A0A] border-crown-gold font-semibold'
                : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white bg-white/5'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <ProductGrid products={filtered} title={`${filtered.length} Products in ${title}`} />
    </div>
    </div>
  );
};
