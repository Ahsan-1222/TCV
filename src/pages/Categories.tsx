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
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div className="mb-10">
        <Link to="/shop" className="text-[11px] tracking-widest uppercase opacity-50 hover:opacity-100">← Back to Shop</Link>
        <h1 className="font-display text-[40px] leading-none mt-4 uppercase tracking-wide">{title}</h1>
        {slug && descriptions[slug] && <p className="text-[13px] opacity-60 mt-3 max-w-[520px]">{descriptions[slug]}</p>}
      </div>

      <div className="flex gap-2 mb-8 border-b pb-6">
        {['perfume', 'bags', 'jewellery'].map(cat => (
          <Link key={cat} to={`/categories/${cat}`} className={`px-5 py-2.5 text-[11px] tracking-widest uppercase border transition-colors ${slug===cat?'bg-black text-white border-black':'bg-white hover:border-black'}`}>{cat}</Link>
        ))}
      </div>

      <ProductGrid products={filtered} title={`${filtered.length} Products in ${title}`} />
    </div>
  );
};
