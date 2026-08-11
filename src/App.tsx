import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { WhatsAppFloat } from './components/ui/WhatsAppFloat';

// Lazy pages for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Wishlist = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const SearchPage = lazy(() => import('./pages/Search').then(m => ({ default: m.SearchPage })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const CheckoutSuccess = lazy(() => import('./pages/Checkout').then(m => ({ default: m.CheckoutSuccess })));
const CategoriesPage = lazy(() => import('./pages/Categories').then(m => ({ default: m.CategoriesPage })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const ProductsAdmin = lazy(() => import('./pages/admin/ProductsAdmin').then(m => ({ default: m.ProductsAdmin })));
const OrdersAdmin = lazy(() => import('./pages/admin/OrdersAdmin').then(m => ({ default: m.OrdersAdmin })));
const CustomersAdmin = lazy(() => import('./pages/admin/OrdersAdmin').then(m => ({ default: m.CustomersAdmin })));
const SettingsAdmin = lazy(() => import('./pages/admin/OrdersAdmin').then(m => ({ default: m.SettingsAdmin })));
const BannerAdmin = lazy(() => import('./pages/admin/BannerAdmin').then(m => ({ default: m.BannerAdmin })));

const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-[11px] tracking-widest uppercase mt-4 opacity-60">Loading The Crown Vault</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
              <Routes>
                {/* Admin Routes without Header/Footer */}
                <Route path="/admin" element={
                  <Suspense fallback={<Loading />}><AdminLayout /></Suspense>
                }>
                  <Route index element={<Suspense fallback={<Loading />}><AdminDashboard /></Suspense>} />
                  <Route path="products" element={<Suspense fallback={<Loading />}><ProductsAdmin /></Suspense>} />
                  <Route path="orders" element={<Suspense fallback={<Loading />}><OrdersAdmin /></Suspense>} />
                  <Route path="banners" element={<Suspense fallback={<Loading />}><BannerAdmin /></Suspense>} />
                  <Route path="customers" element={<Suspense fallback={<Loading />}><CustomersAdmin /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<Loading />}><SettingsAdmin /></Suspense>} />
                </Route>

                {/* Store Routes */}
                <Route path="/*" element={
                  <>
                    <Header />
                    <CartDrawer />
                    <WhatsAppFloat />
                    <main className="flex-1">
                      <Suspense fallback={<Loading />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/categories/:slug" element={<CategoriesPage />} />
                          <Route path="/product/:slug" element={<ProductDetail />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/search" element={<SearchPage />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/checkout/success" element={<CheckoutSuccess />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
