import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { formatPrice, whatsappLink, productWhatsAppMessage } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Minus, Plus, Star, Truck, Shield, MessageCircle, ChevronRight, CheckCircle2, MessageSquarePlus, Send, Sparkles } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProductToDB } from '../services/dbService';
import { trackViewContent } from '../services/metaPixel';
import type { Product, ProductReview } from '../types';

export const ProductDetail = () => {
  const { slug } = useParams();
  const products = useProducts();
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useEffect(() => { 
    window.scrollTo(0, 0); 
    if (product) {
      trackViewContent(product);
    }
  }, [slug, product?.id]);

  if (!product) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/40 text-[13px] tracking-widest uppercase">
      Product not found
    </div>
  );

  const mainImg = product.images[activeImage] || product.images[0];
  const selectedColorName = mainImg?.color || mainImg?.alt || (product.images.length > 1 ? `Option ${activeImage + 1}` : undefined);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);
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
    5: 'Exceptional (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average (3/5)',
    2: 'Fair (2/5)',
    1: 'Poor (1/5)',
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

      setTimeout(() => {
        setReviewSuccessMsg('');
      }, 6000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-5 pb-0">
        <div className="flex items-center gap-1.5 text-[9px] tracking-widest uppercase text-white/25">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-white/50">{product.name}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14">

          {/* Gallery */}
          <div className="space-y-3">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] sm:aspect-[4/5] max-h-[580px] sm:max-h-none bg-[#111111] overflow-hidden relative rounded-sm flex items-center justify-center border border-white/5 shadow-2xl"
            >
              <img src={mainImg.url} alt={mainImg.alt} className={`w-full h-full object-cover max-w-full ${
                mainImg?.position === 'left' ? 'object-left' : mainImg?.position === 'right' ? 'object-right' : 'object-center'
              }`} />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-crown-gold text-[#0A0A0A] text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold shadow-lg">
                  -{discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square bg-[#111111] overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-crown-gold' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-crown-gold/30 px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase text-crown-gold mb-4 w-fit">
              <span className="w-1 h-1 bg-crown-gold rounded-full animate-pulse" />
              {product.category} · {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            <h1 className="font-display text-[30px] sm:text-[38px] md:text-[46px] leading-[0.92] tracking-tight uppercase text-white">
              {product.name}
            </h1>
            <p className="text-[13px] text-white/45 mt-3 leading-relaxed">{product.shortDescription}</p>

            {/* Rating summary pill */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'}
                    color={i < Math.floor(product.rating) ? '#C9A86A' : '#333'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-white/50 font-medium">
                {product.rating} <span className="text-white/30">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display text-[30px] font-medium text-crown-gold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="line-through text-white/25 text-[14px]">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-white/8 pt-5 space-y-3 text-[13px] leading-[1.85] text-white/50">
              <p>{product.description}</p>
              {product.scentNotes && (
                <div className="grid grid-cols-3 gap-3 mt-5 text-[11px]">
                  {[['Top Notes', product.scentNotes.top], ['Heart', product.scentNotes.heart], ['Base', product.scentNotes.base]].map(([label, notes]) => (
                    <div key={label as string}>
                      <div className="text-[8px] tracking-[0.3em] uppercase text-crown-gold/70 mb-1.5">{label}</div>
                      <div className="text-white/60 leading-[1.6]">{(notes as string[]).join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Online discount banner */}
            <div className="mt-5 bg-crown-gold/10 border border-crown-gold/25 p-4 flex items-start gap-3 rounded-sm">
              <Sparkles size={16} className="text-crown-gold shrink-0 mt-0.5" />
              <div className="text-[12px] leading-relaxed text-white/60">
                <strong className="text-white block mb-0.5 text-[13px]">Save Rs. 100!</strong>
                Pay online (Easypaisa) to get an instant Rs. 100 discount. COD available at original price.
              </div>
            </div>

            {/* Color / Variant Selector */}
            {product.images.length > 1 && (
              <div className="mt-5 border-t border-white/8 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-medium">
                    Select Color / Option:
                  </span>
                  {selectedColorName && (
                    <span className="text-[11px] font-semibold text-crown-gold uppercase tracking-wider">
                      {selectedColorName}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.images.map((img, i) => {
                    const colorName = img.color || img.alt || `Option ${i + 1}`;
                    const isSelected = activeImage === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-2 border transition-all duration-300 ${isSelected
                            ? 'bg-crown-gold text-[#0A0A0A] border-crown-gold font-semibold shadow-md'
                            : 'border-white/20 text-white/70 hover:border-crown-gold hover:text-white bg-white/5'
                          }`}
                      >
                        <span className="w-4 h-4 rounded-full overflow-hidden border border-white/30 shrink-0">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </span>
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="mt-6 flex flex-wrap sm:flex-nowrap gap-2">
              <div className="flex items-center border border-white/15 shrink-0">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center text-[13px] text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
                  <Plus size={13} />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, qty, selectedColorName, mainImg.url);
                  // Meta Pixel — AddToCart
                  (window as any).fbq?.('track', 'AddToCart', {
                    content_ids: [product.id],
                    content_name: product.name,
                    content_type: 'product',
                    value: product.price * qty,
                    currency: 'PKR',
                    num_items: qty,
                  });
                }}
                className="flex-1 min-w-[160px] h-12 bg-crown-gold text-[#0A0A0A] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors flex justify-center items-center"
              >
                Add to Cart — {formatPrice(product.price * qty)}
              </button>
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-12 h-12 shrink-0 border flex items-center justify-center transition-all ${inWishlist
                    ? 'bg-crown-gold border-crown-gold text-[#0A0A0A]'
                    : 'border-white/15 text-white/50 hover:border-crown-gold hover:text-crown-gold'
                  }`}
              >
                <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
              </button>
            </div>

            {/* WhatsApp + COD */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={whatsappLink(productWhatsAppMessage(product.name, product.price, window.location.href, selectedColorName))}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#25D366] text-[#25D366] h-12 text-[10px] tracking-[0.2em] uppercase text-center flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <MessageCircle size={13} /> Order on WhatsApp
              </a>
              <div className="border border-white/10 h-12 text-[10px] tracking-[0.2em] uppercase text-center text-white/40 flex items-center justify-center gap-2">
                <Truck size={13} /> COD Available
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/8 pt-5 text-[10px]">
              {[
                [Shield, 'Authentic', '100% Original'],
                [Truck, 'Nationwide', 'Rs. 200 Delivery'],
                [MessageCircle, 'WhatsApp', 'Instant reply'],
              ].map(([Icon, title, sub]) => (
                <div key={title as string} className="flex gap-2">
                  {/* @ts-ignore */}
                  <Icon size={15} className="text-crown-gold/60 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">{title as string}</div>
                    <div className="text-white/25 text-[9px] mt-0.5">{sub as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE CUSTOMER REVIEWS & COMMENT SECTION ── */}
      <section className="border-t border-white/8 bg-[#0E0E0E] py-14 md:py-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">

          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-crown-gold mb-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-crown-gold" />
                  Customer Feedback
                </div>
                <h2 className="font-display text-[28px] sm:text-[36px] md:text-[44px] text-white leading-none uppercase tracking-wide">
                  Reviews & Experience
                </h2>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center justify-center gap-2.5 bg-crown-gold text-[#0A0A0A] px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-white transition-all duration-300 shadow-lg cursor-pointer rounded-sm"
              >
                <MessageSquarePlus size={14} />
                {showReviewForm ? 'Close Review Form' : 'Write a Review'}
              </button>
            </div>
          </ScrollReveal>

          {/* Success Notification */}
          <AnimatePresence>
            {reviewSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-crown-gold/15 border border-crown-gold/40 text-crown-gold text-[12px] uppercase tracking-wider flex items-center gap-3 rounded-sm"
              >
                <CheckCircle2 size={16} />
                <span>{reviewSuccessMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddReview}
                className="mt-8 bg-[#141414] border border-crown-gold/30 p-6 md:p-8 rounded-sm space-y-6 overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-display text-[20px] text-white">Write Your Review</h3>
                  <span className="text-[10px] uppercase tracking-widest text-crown-gold font-medium">Verified Customer</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2 font-medium">
                      Your Name <span className="text-crown-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hammad Khan"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/15 px-4 py-3 text-[13px] text-white placeholder-white/20 focus:border-crown-gold outline-none transition-colors rounded-sm"
                    />
                  </div>

                  {/* Star Rating Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2 font-medium">
                      Overall Rating <span className="text-crown-gold">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating || reviewRating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                size={22}
                                fill={active ? '#C9A86A' : 'none'}
                                color={active ? '#C9A86A' : '#444'}
                                strokeWidth={1.5}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-crown-gold font-medium tracking-wide">
                        {ratingLabels[hoverRating || reviewRating]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Text Area */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2 font-medium">
                    Your Experience & Comment <span className="text-crown-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your thoughts about scent quality, longevity, packaging, or customer service..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/15 p-4 text-[13px] text-white placeholder-white/20 focus:border-crown-gold outline-none transition-colors rounded-sm leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-crown-gold text-[#0A0A0A] px-8 py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-white transition-colors disabled:opacity-50 cursor-pointer rounded-sm"
                  >
                    <Send size={13} />
                    {isSubmitting ? 'Publishing...' : 'Submit Review '}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Rating Summary + Distribution */}
          <div className="grid lg:grid-cols-12 gap-8 items-center mt-10 p-6 md:p-10 bg-[#121212] border border-white/8 rounded-sm">

            {/* Left Score */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center lg:border-r border-white/10 lg:pr-8 py-2">
              <div className="font-display text-[64px] leading-none text-white font-medium">
                {product.rating}
              </div>
              <div className="flex gap-1 text-crown-gold my-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'}
                    color={i < Math.floor(product.rating) ? '#C9A86A' : '#444'}
                  />
                ))}
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
                Based on {totalReviews} {totalReviews === 1 ? 'Customer Review' : 'Verified Reviews'}
              </div>
            </div>

            {/* Right Rating Bars */}
            <div className="lg:col-span-8 space-y-2.5">
              {ratingCounts.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3 text-[11px]">
                  <span className="w-12 text-white/60 font-medium shrink-0">{stars} Stars</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: (5 - stars) * 0.1 }}
                      className="h-full bg-crown-gold rounded-full"
                    />
                  </div>
                  <span className="w-16 text-right text-white/40 font-light shrink-0">
                    {count} ({pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="mt-12 space-y-4">
            {reviewsList.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-[12px] uppercase tracking-widest border border-dashed border-white/10">
                No reviews yet. Be the first to leave a review!
              </div>
            ) : (
              reviewsList.map((r, i) => (
                <ScrollReveal key={r.id || i} direction="up" delay={i * 0.06}>
                  <div className="p-5 md:p-6 bg-[#121212] border border-white/8 hover:border-crown-gold/30 transition-all duration-300 rounded-sm">
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">
                        {/* Avatar Initial */}
                        <div className="w-9 h-9 rounded-full bg-crown-gold/20 border border-crown-gold/40 text-crown-gold flex items-center justify-center font-display text-[15px] font-semibold shrink-0">
                          {r.userName ? r.userName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-white">{r.userName}</span>
                            {r.verified && (
                              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-crown-gold bg-crown-gold/10 px-2 py-0.5 rounded-sm border border-crown-gold/20 font-medium">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/30 block mt-0.5">{r.date}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 text-crown-gold shrink-0">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx < r.rating ? '#C9A86A' : 'none'}
                            color={starIdx < r.rating ? '#C9A86A' : '#333'}
                          />
                        ))}
                      </div>

                    </div>

                    <p className="text-[13px] mt-4 text-white/60 leading-relaxed font-light pl-12">
                      {r.comment}
                    </p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-20 border-t border-white/5">
          <ProductGrid products={related} title="You May Also Like" />
        </div>
      )}
    </div>
  );
};
