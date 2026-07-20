# THE CROWN VAULT — Luxury Curations Pakistan

Premium, modern, luxury e-commerce website built from scratch with:

- **React 19** + **Vite 8** + **TypeScript (strict)**
- **Tailwind CSS 3.4**
- **Framer Motion**
- **React Router DOM 7** — code splitting, lazy loading
- **Firebase-ready architecture**

## Brand
**TcV — THE CROWN VAULT**
- Luxury Curations - Pakistan Market Adaptation
- Categories: Perfumes (Primary), Ladies Bags, Jewellery (Watches blueprint as extension)
- Assets: ROOH Fragrances (AQUA, AVANT, NOIR, GOLD, VELVET)

### Reference Inspiration
Rumitrends.com layout analyzed — replicated only:
- Layout & page structure
- Navigation & megamenu behavior
- UI/UX patterns (product grid, quick add, COD/WA badges)
- Shopping experience (drawer cart, WhatsApp order)

Branding, colors, images, texts are original TcV luxury.

## Pages Implemented
- `/` Home — Hero, Featured Categories, Featured Products, Bundle Offer (Pack of 3 inspired by Rumi), Best Sellers, Brand Story Blueprint, Testimonials, Footer
- `/shop` — All products, category filter, price filter, sort
- `/categories/:slug` — perfume | bags | jewellery
- `/product/:slug` — Gallery, scent notes, reviews, quantity, wishlist, WhatsApp inquiry (COD, Nationwide)
- `/wishlist`
- `/search?q=`
- `/cart` — Shipping summary
- `/checkout` — Shipping form, COD / WhatsApp payment, free shipping > Rs.2500
- `/checkout/success`
- `/about` — Brand story per blueprint quadrants
- `/contact` — WhatsApp contact, FAQ
- `/admin/*` — Secure Admin Dashboard

## Features
- Product Search (live, tags)
- Category Filter
- Wishlist (localStorage, Firebase-ready)
- Add to Cart + Drawer + Quantity Selector
- Product Reviews (display + blueprint)
- Shipping Summary
- Responsive Navigation (mobile drawer) + Announcement bar (Free Delivery over 2500)
- **WhatsApp Float + Inline** — Floating chat button similar to reference:
  - Global floating button with preview + cart awareness
  - Product page WhatsApp order: `productWhatsAppMessage`
  - Cart page WhatsApp order: `cartWhatsAppMessage`
  - Uses `https://wa.me/923001234567?text=`
- SEO optimized meta, lazy images, code splitting
- Premium minimalist UI: marble background, gold #C9A86A, black #0A0A0A, serif display (Playfair + Cormorant), sans (Montserrat)

## Admin Panel
Secure, responsive Admin Dashboard with:

- Auth: `admin@thecrownvault.pk / Admin@123` demo (Firebase Auth ready)
- Dashboard analytics (total products, stock, revenue demo, customers)
- Add/edit/delete products — fields: name, SKU, categories, stock, pricing, featured, short/long description, tags, SEO metadata (seoTitle)
- Upload multiple product images (UI ready, Firebase Storage ready — currently uses placeholder picsum + local assets)
- Manage categories, stock, SKU, variants blueprint ready (ProductVariant interface), pricing, featured, tags, SEO
- Orders & Customers (reads last order from localStorage, Firestore orders ready)
- Products added from Admin automatically appear on website without code changes — implemented via `localStorage tcv_products` + `useProducts()` hook merging + future Firestore onSnapshot listener stub in `src/lib/firebase.ts`

### Admin persistence
```ts
localStorage.setItem('tcv_products', JSON.stringify(products))
localStorage.setItem('tcv_admin_products', JSON.stringify(products))
```
Shop/Home/Categories use `useProducts()` which reads `tcv_products` if present.

## Firebase Ready Structure
`src/lib/firebase.ts`:

- `firebaseConfig` from env `VITE_FIREBASE_*`
- `collections`: products, orders, users, wishlists
- Comments show future integration: `initializeApp`, `getAuth`, `getFirestore`, `getStorage`
- Interfaces prepared for: Authentication, Firestore CRUD, Storage image upload, Orders, Wishlist, Admin role check

File structure:

```
src/
  components/
    layout/ Header, Footer, CartDrawer, AnnouncementBar
    product/ ProductCard, ProductGrid
    home/ Hero, FeaturedCategories, BrandStory, Testimonials
    ui/ WhatsAppFloat
  pages/
    Home, Shop, Categories, ProductDetail, Wishlist, Search, Cart, Checkout, About, Contact
    admin/ AdminLayout, Dashboard, ProductsAdmin, OrdersAdmin
  context/ CartContext, WishlistContext, AuthContext
  hooks/ useProducts
  data/ products.ts (ROOH demo with cover + gallery logic)
  types/ Product, Category, Order...
  lib/ utils (formatPrice, whatsappLink), firebase (stub)
```

## Product Image Logic (as requested)
- Use attached perfume images to create realistic demo products
- Automatically select most suitable as main (cover): AQUA bottle front, AVANT bottle, NOIR dark bottle, GOLD amber, VELVET clear — via `isMain: true`
- Remaining images as gallery (trio marble shot, box set)
- Cover displayed on product cards, listings, featured sections via `(images.find(i=>isMain)||images[0])`

## Run

```bash
npm install
npm run dev    # localhost:5173
npm run build
npm run preview
```

## Deployment Ready
- Strict TypeScript, SOLID, reusable components, custom hooks, utility functions
- No duplicate code
- Fast loading, lazy loading, code splitting via `manualChunks`
- Mobile-first responsive, accessible
- High Lighthouse potential: minimal JS, optimized images, Tailwind purge

## WhatsApp Configuration
Edit `src/lib/utils.ts` `whatsappLink` default phone: `923001234567`
Replace with actual store number.

## Notes
- TcV logo gold on black — premium, elegant, minimalist
- Footer clean, simple, elegant similar to reference (grid, COD • WhatsApp • Nationwide)
- Perfume-first shopping experience prioritized
- All images in `/public/assets/products/` copied from uploads

Enjoy — THE CROWN VAULT.
