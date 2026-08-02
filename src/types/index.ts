export type ProductCategory = 'perfume' | 'jewellery' | 'bags' | 'watches';

export interface ProductImage {
  url: string;
  alt: string;
  isMain?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  tags: string[];
  featured: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  seoTitle?: string;
  seoDescription?: string;
  scentNotes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  concentration?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'whatsapp';
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
}
