import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { formatPrice, whatsappLink, productWhatsAppMessage } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Minus, Plus, Star, Truck, Shield, MessageCircle, ChevronRight, CheckCircle2, MessageSquarePlus, Send, Sparkles } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { saveProductToDB } from '../services/dbService';
import { trackViewContent } from '../services/metaPixel';
import type { Product, ProductReview } from '../types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const ProductDetail = () => {
  const { slug } = useParams();
  const products = useProducts();
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const reduce = useReducedMotion();

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const rAf = requestAnimationFrame(() => { window.scrollTo(0, 0); });
    return () => cancelAnimationFrame(rAf);
  }, [slug]);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    if (product) { trackViewContent(product); }
  }, [slug, product]);

  if (!product) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white/40 text-[13px] tracking-widest uppercase">
      Product not found
    </div>
  );

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format', alt: product.name, isMain: true }];
  const mainImg = productImages[activeImage] || productImages[0];
  const selectedColorName = mainImg?.color || mainImg?.alt || (productImages.length > 1 ? `Option ${activeImage + 1}` : undefined);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const maxAvailable = typeof product.stock === 'number' && product.stock > 0 ? product.stock : 99;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const reviewsList = product.reviews || [];
  const totalReviews = reviewsList.length;

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => {
    const count = reviewsList.filter(r => Math.floor(r.rating) === stars).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, pct };
  });

  const ratingLabels: Record<number, string> = {
    5: 'Exceptional', 4: 'Very Good', 3: 'Average', 2: 'Fair', 1: 'Poor',
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewerName.trim()) return;

    setIsSubmitting(true);
    try {
      const newRev: ProductReview = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userName: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verified: true,
      };

      const updatedReviews = [newRev, ...reviewsList];
      const totalRatingSum = updatedReviews.reduce((acc, item) => acc + item.rating, 0);
      const newAvgRating = parseFloat((totalRatingSum / updatedReviews.length).toFixed(1));

      const updatedProd: Product = {
        ...product,
        reviews: updatedReviews,
        rating: newAvgRating,
        reviewCount: updatedReviews.length,
        updatedAt: new Date().toISOString(),
      };

      await saveProductToDB(updatedProd);

      setReviewSuccessMsg('★ Thank you! Your live review has been published.');
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);

      setTimeout(() => setReviewSuccessMsg(''), 6000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-white antialiased">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── BREADCRUMB ───────────────────────────────────────────────── */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-[1560px] items-center gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.35em] text-white/35 sm:px-8 lg:px-14">
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight size={10} className="text-white/20" />
          <Link to="/shop" className="transition-colors hover:text-white">Shop</Link>
          <ChevronRight size={10} className="text-white/20" />
          <span className="truncate text-crown-gold">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN PDP ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1560px] px-5 py-10 sm:px-8 md:py-14 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">

          {/* ── GALLERY (sticky on desktop) ────────────────────────── */}
          <div className="relative">
            <div className="lg:sticky lg:top-24">
              <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">

                {/* Vertical thumbnail rail (desktop) */}
                {productImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {productImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`group relative shrink-0 overflow-hidden border transition-all duration-500 ${
                          activeImage === i
                            ? 'border-crown-gold'
                            : 'border-white/10 opacity-55 hover:opacity-100'
                        }`}
                      >
                        <div className="h-16 w-16 md:h-20 md:w-20">
                          <img
                            src={img.url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        {activeImage === i && (
                          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-crown-gold" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="relative flex-1">
                  <motion.div
                    key={activeImage}
                    initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="group relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#0E0E0E]"
                  >
                    <img
                      src={mainImg.url}
                      alt={mainImg.alt}
                      className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
                        mainImg?.position === 'left' ? 'object-left' : mainImg?.position === 'right' ? 'object-right' : 'object-center'
                      }`}
                    />

                    {/* Discount tag */}
                    {discount > 0 && (
                      <div className="absolute left-5 top-5 flex items-center gap-2 border border-crown-gold/50 bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-crown-gold backdrop-blur-md">
                        −{discount}%
                      </div>
                    )}

                    {/* Image counter */}
                    {productImages.length > 1 && (
                      <div className="absolute bottom-5 right-5 border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.28em] text-white/70 backdrop-blur-md">
                        {String(activeImage + 1).padStart(2, '0')} / {String(productImages.length).padStart(2, '0')}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* ── INFO COLUMN ──────────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Status row */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'animate-pulse bg-crown-gold'}`} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.36em] text-crown-gold">
                  {product.category}
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {isOutOfStock ? 'Sold Out' : `In Stock${typeof product.stock === 'number' && product.stock < 10 ? ` · ${product.stock} left` : ''}`}
                </span>
              </div>
              <span className="hidden text-[9px] uppercase tracking-[0.36em] text-white/25 sm:block">SKU · CV-{product.id?.slice(-4).toUpperCase() ?? '0001'}</span>
            </div>

            {/* Title */}
            <motion.h1
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              className="mt-6 font-display text-[clamp(2rem,5.4vw,3.6rem)] font-normal uppercase leading-[0.96] tracking-[-0.02em] text-white"
            >
              {product.name}
            </motion.h1>

            {/* Short description */}
            <p className="mt-4 max-w-[560px] text-[14px] font-light leading-[1.9] text-white/50">
              {product.shortDescription}
            </p>

            {/* Rating */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14}
                    fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'}
                    color={i < Math.floor(product.rating) ? '#C9A86A' : '#333'} />
                ))}
              </div>
              <span className="text-[12px] font-medium text-white">{product.rating}</span>
              <span className="h-3 w-px bg-white/15" />
              <button
                type="button"
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[11px] uppercase tracking-[0.24em] text-white/40 underline-offset-8 transition hover:text-crown-gold hover:underline"
              >
                {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
              </button>
            </div>

            {/* Price block */}
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-y border-white/10 py-6">
              <div>
                <div className="text-[9px] uppercase tracking-[0.36em] text-white/35">Price</div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-display text-[34px] font-medium leading-none text-crown-gold md:text-[42px]">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-[15px] text-white/25 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Save message */}
              {product.comparePrice && (
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-[0.36em] text-white/35">You Save</div>
                  <div className="mt-2 font-display text-[20px] text-white">
                    {formatPrice(product.comparePrice - product.price)}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 space-y-5 text-[13.5px] font-light leading-[1.95] text-white/55">
              <p>{product.description}</p>
            </div>

            {/* Scent notes */}
            {product.scentNotes && (
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  ['Top', product.scentNotes.top],
                  ['Heart', product.scentNotes.heart],
                  ['Base', product.scentNotes.base],
                ].map(([label, notes]) => (
                  <div key={label as string}>
                    <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.36em] text-crown-gold">
                      {label}
                    </div>
                    <div className="text-[12px] leading-[1.7] text-white/55">
                      {(notes as string[]).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Online discount banner */}
            <div className="mt-7 flex items-start gap-3 border border-crown-gold/25 bg-crown-gold/[0.06] p-4">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-crown-gold" />
              <div className="text-[12.5px] leading-relaxed text-white/60">
                <strong className="block text-[13px] text-white">Save Rs. 100 — pay online</strong>
                Instant discount with Easypaisa. Cash on Delivery available at original price.
              </div>
            </div>

            {/* Variant selector */}
            {productImages.length > 1 && (
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/45">
                    Select Variant
                  </span>
                  {selectedColorName && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-crown-gold">
                      {selectedColorName}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {productImages.map((img, i) => {
                    const colorName = img.color || img.alt || `Option ${i + 1}`;
                    const isSelected = activeImage === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`group flex items-center gap-2.5 border px-3.5 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-400 ${
                          isSelected
                            ? 'border-crown-gold bg-crown-gold/[0.08] text-white'
                            : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <span className={`relative h-5 w-5 overflow-hidden rounded-full border ${isSelected ? 'border-crown-gold' : 'border-white/25'}`}>
                          <img src={img.url} alt="" className="h-full w-full object-cover" />
                        </span>
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="mt-8 space-y-3">
              <div className="flex gap-3">
                {/* Qty */}
                <div className="flex h-14 shrink-0 items-center border border-white/15">
                  <button
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    disabled={qty <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                    className="flex h-full w-12 items-center justify-center text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-[14px] font-medium tabular-nums text-white">
                    {isOutOfStock ? 0 : qty}
                  </span>
                  <button
                    onClick={() => setQty(prev => Math.min(maxAvailable, prev + 1))}
                    disabled={isOutOfStock || qty >= maxAvailable}
                    aria-label="Increase quantity"
                    className="flex h-full w-12 items-center justify-center text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, qty, selectedColorName, mainImg.url)}
                  className={`group relative flex h-14 flex-1 items-center justify-center gap-3 overflow-hidden text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 ${
                    isOutOfStock
                      ? 'cursor-not-allowed border border-white/10 bg-white/[0.04] text-white/30'
                      : 'bg-crown-gold text-black hover:text-black'
                  }`}
                >
                  {!isOutOfStock && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                    />
                  )}
                  <span className="relative z-10">
                    {isOutOfStock ? 'Out of Stock' : `Add to Cart — ${formatPrice(product.price * qty)}`}
                  </span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center border transition-all duration-400 ${
                    inWishlist
                      ? 'border-crown-gold bg-crown-gold text-black'
                      : 'border-white/15 text-white/55 hover:border-crown-gold hover:text-crown-gold'
                  }`}
                >
                  <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
                </button>
              </div>

              {/* WhatsApp + COD */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={whatsappLink(productWhatsAppMessage(product.name, product.price, window.location.href, selectedColorName))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2.5 border border-[#25D366]/60 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#25D366] transition-colors duration-300 hover:bg-[#25D366] hover:text-black"
                >
                  <MessageCircle size={14} /> Order on WhatsApp
                </a>
                <div className="flex h-12 items-center justify-center gap-2.5 border border-white/10 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  <Truck size={14} /> COD Available
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                [Shield, 'Authentic', '100% original'],
                [Truck, 'Nationwide', 'Rs. 200 delivery'],
                [MessageCircle, 'WhatsApp', 'Instant reply'],
              ].map(([Icon, title, sub]) => (
                <div key={title as string} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  {/* @ts-ignore */}
                  <Icon size={16} className="shrink-0 text-crown-gold/70" />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                      {title as string}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/30">{sub as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────── */}
      <section id="reviews" className="relative border-t border-white/10 bg-[#0B0B0B]">
        <div className="mx-auto max-w-[1560px] px-5 py-16 sm:px-8 md:py-24 lg:px-14">

          {/* Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-10 bg-crown-gold/70" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
                    Customer Feedback
                  </span>
                </div>
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-none tracking-[-0.02em] text-white">
                  Reviews &amp; <span className="italic font-light text-crown-gold">experience.</span>
                </h2>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="group inline-flex items-center justify-center gap-2.5 border border-crown-gold bg-crown-gold px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-black transition-colors duration-300 hover:bg-transparent hover:text-crown-gold"
              >
                <MessageSquarePlus size={14} />
                {showReviewForm ? 'Close Form' : 'Write a Review'}
              </button>
            </div>
          </ScrollReveal>

          {/* Success */}
          <AnimatePresence>
            {reviewSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex items-center gap-3 border border-crown-gold/40 bg-crown-gold/[0.08] p-4 text-[12px] uppercase tracking-[0.2em] text-crown-gold"
              >
                <CheckCircle2 size={16} />
                <span>{reviewSuccessMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddReview}
                className="mt-8 overflow-hidden border border-crown-gold/25 bg-[#101010] p-6 shadow-2xl md:p-10"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <h3 className="font-display text-[22px] text-white">Share your thoughts</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-crown-gold">
                    Verified Customer
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                      Your Name <span className="text-crown-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hammad Khan"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full border border-white/15 bg-[#080808] px-4 py-3.5 text-[13px] text-white placeholder-white/20 outline-none transition-colors focus:border-crown-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                      Overall Rating <span className="text-crown-gold">*</span>
                    </label>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating || reviewRating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform duration-200 hover:scale-110 focus:outline-none"
                            >
                              <Star size={22}
                                fill={active ? '#C9A86A' : 'none'}
                                color={active ? '#C9A86A' : '#444'}
                                strokeWidth={1.5} />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-crown-gold">
                        {ratingLabels[hoverRating || reviewRating]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                    Your Experience <span className="text-crown-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your thoughts about scent quality, longevity, packaging, or customer service..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-white/15 bg-[#080808] p-4 text-[13px] leading-relaxed text-white placeholder-white/20 outline-none transition-colors focus:border-crown-gold"
                  />
                </div>

                <div className="mt-8 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 bg-crown-gold px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-black transition-colors duration-300 hover:bg-white disabled:opacity-50"
                  >
                    <Send size={13} />
                    {isSubmitting ? 'Publishing...' : 'Submit Review'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Rating summary */}
          <ScrollReveal direction="up" distance={25} duration={0.85}>
            <div className="mt-12 grid gap-10 border border-white/10 bg-[#0E0E0E] p-6 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="flex flex-col items-center justify-center text-center lg:col-span-4 lg:border-r lg:border-white/10 lg:pr-10">
              <div className="font-display text-[72px] leading-none tracking-[-0.02em] text-white">
                {product.rating}
              </div>
              <div className="my-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18}
                    fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'}
                    color={i < Math.floor(product.rating) ? '#C9A86A' : '#444'} />
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-[0.36em] text-white/40">
                {totalReviews} {totalReviews === 1 ? 'Review' : 'Verified Reviews'}
              </div>
            </div>

            <div className="space-y-3 lg:col-span-8">
              {ratingCounts.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-4 text-[11px]">
                  <span className="w-14 shrink-0 font-medium text-white/55">{stars} Stars</span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: (5 - stars) * 0.08, ease: EASE_OUT }}
                      className="h-full rounded-full bg-crown-gold"
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right tabular-nums text-white/40">
                    {count} · {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

          {/* Reviews list */}
          <div className="mt-12 space-y-4">
            {reviewsList.length === 0 ? (
              <div className="border border-dashed border-white/10 py-16 text-center text-[11px] uppercase tracking-[0.32em] text-white/30">
                No reviews yet · Be the first to leave one
              </div>
            ) : (
              reviewsList.map((r, i) => (
                <ScrollReveal key={r.id || i} direction="up" delay={i * 0.06}>
                  <div className="group border border-white/10 bg-[#0E0E0E] p-6 transition-colors duration-500 hover:border-crown-gold/30 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-crown-gold/40 bg-crown-gold/[0.08] font-display text-[16px] font-semibold text-crown-gold">
                          {r.userName ? r.userName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-[14px] font-medium text-white">{r.userName}</span>
                            {r.verified && (
                              <span className="inline-flex items-center gap-1 border border-crown-gold/30 bg-crown-gold/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-crown-gold">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            )}
                          </div>
                          <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-white/30">
                            {r.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} size={13}
                            fill={starIdx < r.rating ? '#C9A86A' : 'none'}
                            color={starIdx < r.rating ? '#C9A86A' : '#333'} />
                        ))}
                      </div>
                    </div>

                    <p className="mt-5 pl-0 text-[13.5px] font-light leading-[1.95] text-white/60 md:pl-15">
                      {r.comment}
                    </p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1560px] px-5 py-16 sm:px-8 md:py-24 lg:px-14">
            <ProductGrid products={related} title="You May Also Like" />
          </div>
        </section>
      )}
    </div>
  );
};