import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Filter, Star, Eye, Check, Trash2, ArrowRight, Wallet, Award, RefreshCw, Smartphone, Sparkles, X, ChevronRight, MessageSquare, CreditCard } from 'lucide-react';
import { playMetallicClick, playSwoosh } from '../utils/audio';
import BorderGlow from './BorderGlow';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'balls' | 'apparel' | 'gear';
  subcategory: 'basketballs' | 'jerseys' | 'shoes' | 'sleeves' | 'nets' | 'cones' | 'trackers' | 'bottles' | 'kits';
  desc: string;
  image: string;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  specs: string[];
  reviews: { user: string; rating: number; text: string; date: string }[];
  highlightColor: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: 'p-classic',
    name: 'Wilson Classic Street',
    price: 2499,
    originalPrice: 2999,
    category: 'balls',
    subcategory: 'basketballs',
    desc: 'Authentic moisture-wicking micro-groove composite leather ball for indoor and outdoor grit.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    rating: 4.8,
    reviewsCount: 142,
    sizes: ['Size 7 (Official)', 'Size 6 (Intermediate)', 'Size 5 (Junior)'],
    specs: ['Composite Leather', 'Dual-Tension Cushion Core', 'Deep-Channel Pebbling'],
    highlightColor: 'from-orange-500 to-amber-600',
    reviews: [
      { user: 'Amit_Sharma', rating: 5, text: 'The absolute gold standard for indoor/outdoor court pickup runs. Pebble grain is perfect.', date: '3 days ago' },
      { user: 'Rahul_K', rating: 4, text: 'Holds pressure perfect. Best composite leather grip on gritty pavement so far.', date: '1 week ago' }
    ]
  },
  {
    id: 'p-carbon',
    name: 'Lunar Carbon 3D Core',
    price: 4999,
    category: 'balls',
    subcategory: 'basketballs',
    desc: 'Cybernetic matte composite build with integrated flight channels. High bounce responsiveness.',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=500&q=80',
    rating: 5.0,
    reviewsCount: 56,
    sizes: ['Size 7 (Official)'],
    specs: ['3D Structured Carbon Fibre', 'Anti-Slip Friction Skin', 'Zero-Airless Aerofoam'],
    highlightColor: 'from-purple-500 to-indigo-600',
    reviews: [
      { user: 'Sanjay_Nair', rating: 5, text: 'Unbelievable premium matte feel. Sounds completely different when hitting the backboard.', date: 'Yesterday' }
    ]
  },
  {
    id: 'p-vapor',
    name: 'Vapor Neon Dusk Glow',
    price: 3499,
    originalPrice: 3999,
    category: 'balls',
    subcategory: 'basketballs',
    desc: 'Night-reflection compound seams. Highly photo-reflective layout for late-night street matches.',
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&q=80',
    rating: 4.7,
    reviewsCount: 89,
    sizes: ['Size 7 (Official)', 'Size 6 (Intermediate)'],
    specs: ['Fluorescent Seam Fibres', 'Tough Rubber Skin', '24h Neon Reflection Cycle'],
    highlightColor: 'from-cyan-500 to-fuchsia-600',
    reviews: [
      { user: 'TwilightBaller', rating: 5, text: 'Looks phenomenal under twilight court LEDs. Really helps tracking high arcs!', date: '5 days ago' }
    ]
  },
  {
    id: 'p-jersey-kyoto',
    name: 'Bandra Mumbai Heavy Jersey',
    price: 1999,
    originalPrice: 2499,
    category: 'apparel',
    subcategory: 'jerseys',
    desc: 'Premium mesh street jersey featuring heat-pressed Bandra custom accents. High-ventilation fiber.',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=500&q=80',
    rating: 4.9,
    reviewsCount: 104,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: ['100% Recycled Polyester Mesh', 'Custom Heat-Press Graphics', 'Ultra dry cooling tech'],
    highlightColor: 'from-red-500 to-orange-500',
    reviews: [
      { user: 'Priya_S', rating: 5, text: 'Very breathable and fits perfectly loose. Love the athletic embroidery.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'p-sneaks',
    name: 'Bandra Court High-Tops',
    price: 6999,
    category: 'apparel',
    subcategory: 'shoes',
    desc: 'Asphalt-shield guard outer with explosive micro-spring ankle cushions. High friction traction rubber.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    rating: 4.9,
    reviewsCount: 61,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    specs: ['Asphalt-Shield Outsole', 'Double-Locked TPU Heel Strap', 'Responsive Gel-Energy Return'],
    highlightColor: 'from-yellow-500 to-red-600',
    reviews: [
      { user: 'CrossoverKing', rating: 5, text: 'No breaking-in needed at all. Absolutely locks my ankle down from high leaps.', date: 'Today' }
    ]
  },
  {
    id: 'p-sleeves',
    name: 'Hex-Flex Dynamic Compression Sleeve',
    price: 699,
    category: 'apparel',
    subcategory: 'sleeves',
    desc: 'Shock-absorbing protective elbow hex-guard with moisture cooling knit for muscle fatigue delay.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    rating: 4.6,
    reviewsCount: 231,
    sizes: ['S/M', 'L/XL'],
    specs: ['High-Elastic Breathable Nylon', '9mm Independent EVA Hex-Pads', 'Silicone Anti-Slip Border'],
    highlightColor: 'from-zinc-600 to-zinc-900',
    reviews: [
      { user: 'Marcus_V', rating: 4, text: 'Saved my elbows from two nasty falls on asphalt court cage already.', date: '4 days ago' }
    ]
  },
  {
    id: 'p-tracker',
    name: 'SmartShot Kinetic Basketball Sensor',
    price: 3499,
    category: 'gear',
    subcategory: 'trackers',
    desc: 'Slip-on mesh wristband with micro-gyroscope. Integrates with your phone to track shooting angles.',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=500&q=80', // placeholder with fitting vibe
    rating: 4.8,
    reviewsCount: 38,
    sizes: ['Universal Fit'],
    specs: ['9-Axis Inertial Gyroscope', 'Bluetooth 5.2 Low Energy', '14-Day Battery Standby'],
    highlightColor: 'from-emerald-500 to-teal-600',
    reviews: [
      { user: 'ShotDoctor', rating: 5, text: 'Syncs wrist release velocity instantly! Caught that my wrist snap was lazy after 50 shots.', date: 'Yesterday' }
    ]
  },
  {
    id: 'p-net',
    name: 'Championship Anti-Whip Steel Chain Net',
    price: 1199,
    category: 'gear',
    subcategory: 'nets',
    desc: 'Heavy-duty zinc coated steel chains. Corrosion-proof layout. Fits all standard 12-loop street rims.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    rating: 4.5,
    reviewsCount: 74,
    sizes: ['Standard 12-Loop Fit'],
    specs: ['Heavy Zinc Coated Steel Links', 'Anti-Rust Protection Gloss', 'Vibration-Damping S-Hooks'],
    highlightColor: 'from-gray-400 to-gray-700',
    reviews: [
      { user: 'MumbaiStreetCoop', rating: 5, text: 'That metallic swish sounds beautiful when you hit a clean deep three. Pure adrenaline.', date: '12 days ago' }
    ]
  },
  {
    id: 'p-cones',
    name: 'Neon Kinetic Agility Cones (6pk)',
    price: 499,
    category: 'gear',
    subcategory: 'cones',
    desc: 'High-visibility windproof agility boundary markers for dribble cross-over training exercises.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    rating: 4.4,
    reviewsCount: 110,
    sizes: ['6-Pack Kit'],
    specs: ['BPA-Free Flex Polyethylene', 'Collapse-Safety Memory Plastic', 'Reflective Top Strips'],
    highlightColor: 'from-amber-400 to-orange-500',
    reviews: [
      { user: 'DribbleGod', rating: 4, text: 'Standard cones but flexes back if you tread on them. Good price point.', date: '3 weeks ago' }
    ]
  },
  {
    id: 'p-bottle',
    name: 'Bandra Therma-Lock Insulated Shaker',
    price: 1299,
    category: 'gear',
    subcategory: 'bottles',
    desc: '24-hour ice insulated dual-wall stainless thermal bottle with spill-proof trigger cap.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    rating: 4.8,
    reviewsCount: 156,
    sizes: ['24 oz (710ml)', '32 oz (950ml)'],
    specs: ['Dual-wall 18/8 Pro Stainless Steel', 'Therma-Lock Vacuum Seal', 'Integrated Loop Finger Grip'],
    highlightColor: 'from-emerald-600 to-teal-700',
    reviews: [
      { user: 'HydrationGen', rating: 5, text: 'Left in baking Indian sun for 4 hours and water inside was still ice cold.', date: '2 days ago' }
    ]
  },
  {
    id: 'p-kit',
    name: 'Mumbai Elite Pro Kit Combo',
    price: 4499,
    originalPrice: 5499,
    category: 'apparel',
    subcategory: 'kits',
    desc: 'Full team-uniform bundle. Includes 1 custom mesh jersey, 1 high-flex track shorts, and matching arm sleeves.',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=500&q=80',
    rating: 5.0,
    reviewsCount: 42,
    sizes: ['S', 'M', 'L', 'XL'],
    specs: ['Sweat-wicking light mesh', 'Shorts with elastic silicone grip', 'Premium double-seamed stitching'],
    highlightColor: 'from-yellow-600 to-orange-600',
    reviews: [
      { user: 'Captain_H', rating: 5, text: 'Awesome value combo. Substantially cheaper than buying pieces individually. Fabric is world-class.', date: '1 week ago' }
    ]
  }
];

export function getProductGlowParams(productId: string) {
  if (productId === 'p-classic') {
    return {
      colors: ['#ef5410', '#ea580c', '#f59e0b'],
      glowColor: '24 85 55'
    };
  }
  if (productId === 'p-carbon') {
    return {
      colors: ['#a855f7', '#6366f1', '#4f46e5'],
      glowColor: '265 80 60'
    };
  }
  if (productId === 'p-vapor') {
    return {
      colors: ['#06b6d4', '#d946ef', '#f43f5e'],
      glowColor: '320 85 65'
    };
  }
  if (productId === 'p-jersey-kyoto') {
    return {
      colors: ['#ef4444', '#f97316', '#f59e0b'],
      glowColor: '12 85 55'
    };
  }
  if (productId === 'p-sneaks') {
    return {
      colors: ['#eab308', '#ef4444', '#dc2626'],
      glowColor: '45 90 55'
    };
  }
  if (productId === 'p-sleeves') {
    return {
      colors: ['#71717a', '#a1a1aa', '#3f3f46'],
      glowColor: '240 5 45'
    };
  }
  if (productId === 'p-tracker') {
    return {
      colors: ['#10b981', '#14b8a6', '#059669'],
      glowColor: '150 80 50'
    };
  }
  if (productId === 'p-net') {
    return {
      colors: ['#9ca3af', '#6b7280', '#4b5563'],
      glowColor: '200 15 60'
    };
  }
  return {
    colors: ['#ea580c', '#ef4444', '#f59e0b'],
    glowColor: '24 85 55'
  };
}

export default function StoreModule() {
  const [filterCategory, setFilterCategory] = useState<'all' | 'balls' | 'apparel' | 'gear'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Searching & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  
  // Sizing & Angle preview
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [previewAngle, setPreviewAngle] = useState<number>(0); // 0 to 360 degrees
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; product: Product; size: string; quantity: number }[]>([]);
  
  // Drawer states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'upi' | 'success'>('cart');
  
  // Promo Coupon states
  const [couponInput, setCouponInput] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [activeCoupon, setActiveCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  
  // Checkout fields
  const [shippingName, setShippingName] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingPhone, setShippingPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [upiTimer, setUpiTimer] = useState<number>(10);
  const [upiStatus, setUpiStatus] = useState<'pending' | 'verifying' | 'completed'>('pending');

  // Review submission state
  const [newReviewUser, setNewReviewUser] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');

  // Sync state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('y68_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      
      const storedCart = localStorage.getItem('y68_store_cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (e) {
      console.warn("Local storage loading error inside StoreModule", e);
    }
  }, []);

  const saveWishlist = (updated: string[]) => {
    setWishlist(updated);
    localStorage.setItem('y68_wishlist', JSON.stringify(updated));
  };

  const saveCart = (updated: typeof cart) => {
    setCart(updated);
    localStorage.setItem('y68_store_cart', JSON.stringify(updated));
  };

  const handleToggleWishlist = (pId: string) => {
    playMetallicClick();
    if (wishlist.includes(pId)) {
      saveWishlist(wishlist.filter(id => id !== pId));
    } else {
      saveWishlist([...wishlist, pId]);
      // Show notification on navbar or locally
    }
  };

  const handleAddToCart = (product: Product, size: string) => {
    playSwoosh();
    const actualSize = size || product.sizes[0] || 'Standard';
    const cartId = `${product.id}_${actualSize}`;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartId);
      let updated;
      if (existingIndex > -1) {
        updated = prev.map((item, idx) => idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        updated = [...prev, { id: cartId, product, size: actualSize, quantity: 1 }];
      }
      saveCart(updated);
      return updated;
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    playMetallicClick();
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === cartId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (cartId: string) => {
    playMetallicClick();
    setCart(prev => {
      const updated = prev.filter(item => item.id !== cartId);
      saveCart(updated);
      return updated;
    });
  };

  const handleSelectProduct = (product: Product) => {
    playMetallicClick();
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setPreviewAngle(0);
    
    // Reset review inputs
    setNewReviewUser('');
    setNewReviewRating(5);
    setNewReviewText('');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !newReviewUser.trim() || !newReviewText.trim()) return;

    playSwoosh();
    const newRev = {
      user: newReviewUser.trim(),
      rating: newReviewRating,
      text: newReviewText.trim(),
      date: 'Just now'
    };

    const updatedProduct = {
      ...selectedProduct,
      reviewsCount: selectedProduct.reviewsCount + 1,
      reviews: [newRev, ...selectedProduct.reviews]
    };

    // Update locally in dataset
    setSelectedProduct(updatedProduct);
    
    // Clear form
    setNewReviewUser('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  // UPI Simulation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (checkoutStep === 'upi' && upiStatus === 'pending') {
      interval = setInterval(() => {
        setUpiTimer(prev => {
          if (prev <= 1) {
            setUpiStatus('verifying');
            setTimeout(() => {
              setUpiStatus('completed');
              setCheckoutStep('success');
              setCart([]);
              saveCart([]);
            }, 1800);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkoutStep, upiStatus]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress || !shippingPhone) return;

    playSwoosh();
    if (paymentMethod === 'upi') {
      setUpiTimer(12);
      setUpiStatus('pending');
      setCheckoutStep('upi');
    } else {
      setCheckoutStep('success');
      setCart([]);
      saveCart([]);
    }
  };

  const calculateSubtotal = () => cart.reduce((acc, current) => acc + (current.product.price * current.quantity), 0);
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - discountAmount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'DUSKSLAM' || code === 'KYOTOVIP') {
      playSwoosh();
      const sub = calculateSubtotal();
      const disc = Math.round(sub * 0.20); // 20% discount
      setDiscountAmount(disc);
      setActiveCoupon(code);
      setCouponInput('');
    } else {
      playMetallicClick();
      setCouponError('Invalid coupon code. Try DUSKSLAM or KYOTOVIP.');
    }
  };

  const filteredProducts = PRODUCTS_DATA.filter(item => {
    const matchesCategory = filterCategory === 'all' ? true : item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="space-y-8" id="store-module-root">
      {/* Category header control filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 to-[#111] border border-white/[0.08] p-5 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PRODUCT GRID</span>
        </div>

        {/* Search & Sort Inline Inputs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3-lg gap-2 flex-grow max-w-xl mx-2">
          <input
            type="text"
            placeholder="Search ball bearings, composite leather, smart trackers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-neutral-950 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white outline-none w-full placeholder-zinc-500 hover:border-zinc-700 focus:border-orange-500/40 transition-colors shadow-inner"
          />
          <select
            value={sortBy}
            onChange={(e) => { playMetallicClick(); setSortBy(e.target.value as any); }}
            className="bg-neutral-950 border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer font-bold shrink-0 hover:border-zinc-700 focus:border-orange-500/40 transition-colors shadow-inner"
          >
            <option value="default">Default Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High first</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0 justify-end sm:justify-start">
          {(['all', 'balls', 'apparel', 'gear'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => { playMetallicClick(); setFilterCategory(cat); }}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterCategory === cat 
                  ? 'bg-orange-600 text-white shadow-xl' 
                  : 'bg-neutral-900/60 text-zinc-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {cat === 'all' ? 'All catalog' : cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2 shrink-0 justify-end">
          {/* Wishlist Icon */}
          <button 
            onClick={() => { playMetallicClick(); setIsWishlistOpen(true); }}
            className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white flex items-center gap-1.5 text-[9.5px] font-bold tracking-tight cursor-pointer uppercase"
          >
            <Heart size={12} className={wishlist.length > 0 ? "fill-red-500 text-red-500 animate-pulse" : "text-zinc-500"} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {/* Cart Icon */}
          <button 
            onClick={() => { playMetallicClick(); setIsCartOpen(true); setCheckoutStep('cart'); }}
            className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white flex items-center gap-1.5 text-[9.5px] font-bold tracking-tight cursor-pointer uppercase relative"
          >
            <ShoppingCart size={12} className="text-orange-500" />
            <span>Bag ({cart.reduce((ac, item) => ac + item.quantity, 0)})</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-600 text-[8px] font-bold rounded-full flex items-center justify-center text-white ring-2 ring-neutral-950">
                {cart.reduce((ac, item) => ac + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid displays items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isFavorited = wishlist.includes(product.id);
          const glowParams = getProductGlowParams(product.id);
          return (
            <BorderGlow
              key={product.id}
              className="transition-all duration-400 group hover:-translate-y-1.5 cursor-pointer h-full"
              backgroundColor="#0c0c0c"
              borderRadius={24}
              glowRadius={30}
              glowIntensity={1.2}
              edgeSensitivity={25}
              coneSpread={30}
              animated={true}
              colors={glowParams.colors}
              glowColor={glowParams.glowColor}
            >
              <div className="p-4 w-full h-full flex flex-col justify-between">
                {/* Top controls */}
                <div className="relative">
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-2.5 left-2.5 bg-red-600 px-2 py-0.5 rounded text-[8px] text-white font-extrabold uppercase tracking-wide">
                        SALE -₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    )}
                    {/* Category label */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[8px] text-orange-400 font-extrabold uppercase tracking-widest border border-white/5">
                      {product.subcategory}
                    </span>
                  </div>

                  {/* Wishlist heart overlay */}
                  <button 
                    onClick={() => handleToggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart size={12} className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                {/* Title & Info */}
                <div className="p-1 pt-3.5 text-left flex-grow space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-[12.5px] text-white font-bold uppercase tracking-wider line-clamp-1 leading-tight">{product.name}</h4>
                      <div className="flex items-center text-yellow-500 text-[10px] font-bold">
                        ★ {product.rating}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed mt-1 font-normal font-sans">
                      {product.desc}
                    </p>
                  </div>

                  {/* Settle Price & Action Row */}
                  <div className="product-card-action pt-3 mt-1.5 border-t border-white/[0.04] flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-orange-400 font-mono">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-[9px] text-zinc-600 line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleSelectProduct(product)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer border border-white/5 flex items-center justify-center"
                        title="Quick View Details"
                      >
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product, product.sizes[0] || 'Standard')}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 hover:text-black text-white text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                      >
                        Buy +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          );
        })}
      </div>

      {/* QUICK DETAIL MODAL WITH 360° PREVIEW & REVIEWS */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-neutral-950 border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row my-8 max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center z-50 text-sm cursor-pointer"
            >
              ×
            </button>

            {/* LEFT HALF: 360° SPIN INTERACTIVES AND SPEC LISTS */}
            <div className="w-full md:w-1/2 p-6 bg-gradient-to-b from-[#0a0a0a] to-[#121212] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 text-left">
              <div className="space-y-4">
                <span className="px-2 py-0.5 rounded bg-orange-600/10 border border-orange-500/20 text-[8px] text-orange-400 font-bold uppercase tracking-widest">
                  Interactive 360° Product Lab
                </span>

                {/* 360° SPIN CANVAS STYLING MOCK */}
                <div className="relative aspect-square w-full rounded-2xl bg-[#070707] border border-white/5 flex items-center justify-center overflow-hidden group">
                  
                  {/* Rotation Indicator overlay */}
                  <span className="absolute top-2.5 right-2.5 text-[8.5px] font-mono text-zinc-500 bg-black/40 px-2 py-0.5 rounded tracking-widest uppercase">
                    Angle: {previewAngle}°
                  </span>

                  {/* Render the Product Image with simulated shine skew based on angle */}
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-[72%] h-[72%] object-cover rounded-full grayscale group-hover:grayscale-0 transition-transform duration-300"
                    style={{ 
                      transform: `rotate(${previewAngle}deg) scale(1.15)`,
                      filter: `brightness(${0.8 + (Math.sin(previewAngle * Math.PI / 180) * 0.15)})` 
                    }}
                  />

                  {/* Shadow base ellipse */}
                  <div className="absolute bottom-6 w-1/2 h-2.5 rounded-full bg-black/80 blur-sm pointer-events-none" />

                  <div className="absolute inset-x-4 bottom-3 flex flex-col gap-1 items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[7.5px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Drag or slide to spin 360° preview</span>
                    <input 
                      type="range"
                      min="0"
                      max="360"
                      step="10"
                      value={previewAngle}
                      onChange={(e) => { playMetallicClick(); setPreviewAngle(parseInt(e.target.value)); }}
                      className="w-full accent-orange-500 appearance-none h-[3px] bg-neutral-800 rounded-full cursor-pointer outline-none mt-1"
                    />
                  </div>
                </div>

                {/* Build specs checklist */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Core Specifications:</span>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-zinc-300 font-mono">
                    {selectedProduct.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-orange-500">◆</span>
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic AI Product Recommendation engine segment */}
              <div className="mt-6 p-3 rounded-2xl bg-orange-600/5 border border-orange-500/10 space-y-1">
                <span className="text-[8.5px] font-bold text-orange-400 flex items-center gap-1 uppercase tracking-widest font-sans">
                  <Sparkles size={11} className="text-orange-400 animate-pulse" /> Slam-AI Recommendation
                </span>
                <p className="text-[10px] text-orange-200/80 leading-normal font-normal">
                  "Based on your tactical play, pairing this {selectedProduct.subcategory} with our <strong>Smart Sensor</strong> adds real-time wrist telemetry to perfect your form."
                </p>
              </div>
            </div>

            {/* RIGHT HALF: SELECTION FORM, REVIEWS LOG, WRITTEN INPUTS */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between text-left space-y-5">
              
              <div className="space-y-4">
                {/* Title Segment */}
                <div>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono leading-none">
                    <span>{selectedProduct.category}</span>
                    <span>/</span>
                    <span className="text-orange-400">{selectedProduct.subcategory}</span>
                  </div>
                  <h3 className="font-display font-medium text-2xl uppercase tracking-wider text-white mt-1 leading-none">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-yellow-500 text-[11px] font-bold gap-0.5">
                      {'★'.repeat(Math.round(selectedProduct.rating))}
                      {'☆'.repeat(5 - Math.round(selectedProduct.rating))}
                      <span className="text-zinc-400 font-semibold ml-1">({selectedProduct.rating} / 5.0)</span>
                    </div>
                    <span className="text-zinc-600">|</span>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase font-mono">{selectedProduct.reviewsCount} Registered reviews</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-2 pb-3 border-b border-white/5">
                  <span className="font-mono text-xl font-bold text-orange-400">₹{selectedProduct.price.toLocaleString()}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-zinc-500 line-through font-mono">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Size Selector */}
                {selectedProduct.sizes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider block">Select Size / Fit:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.sizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => { playMetallicClick(); setSelectedSize(sz); }}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-semibold tracking-wide border cursor-pointer uppercase transition-all ${
                            selectedSize === sz 
                              ? 'bg-orange-600 text-white border-orange-500 shadow-lg' 
                              : 'bg-neutral-900/60 text-zinc-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Ledger Board */}
                <div className="space-y-2 pt-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare size={10} /> Verified Player Reviews
                  </span>
                  
                  {/* Reviews stack list scrollable */}
                  <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 border border-white/5 p-2 rounded-xl bg-neutral-900/10 mb-2 scrollbar-thin">
                    {selectedProduct.reviews.map((rev, idx) => (
                      <div key={idx} className="pb-2 border-b border-white/[0.03] last:border-0 last:pb-0 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-zinc-300">@{rev.user}</span>
                          <span className="text-yellow-500">★ {rev.rating}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-zinc-400 mt-1 font-normal font-sans">{rev.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add short review form */}
                  <form onSubmit={handleAddReview} className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 space-y-2 text-left">
                    <span className="text-[8.5px] font-bold text-orange-400 uppercase tracking-wider block">Write short product review</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="@username"
                        value={newReviewUser}
                        onChange={(e) => setNewReviewUser(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-[9.5px] text-white outline-none w-full"
                      />
                      <select 
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-[9.5px] text-yellow-500 outline-none cursor-pointer w-full font-bold"
                      >
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★☆ (4)</option>
                        <option value="3">★★★☆☆ (3)</option>
                        <option value="2">★★☆☆☆ (2)</option>
                        <option value="1">★☆☆☆☆ (1)</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Excellent bounce and thread..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-1.5 text-[9.5px] text-white outline-none w-full"
                      />
                      <button 
                        type="submit"
                        className="px-3 bg-white text-black hover:bg-zinc-200 transition-colors font-bold text-[9px] uppercase rounded-lg cursor-pointer flex-shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Confirm Bottom Actions */}
              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => handleToggleWishlist(selectedProduct.id)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    wishlist.includes(selectedProduct.id)
                      ? 'bg-red-950/40 text-red-400 border-red-900/50'
                      : 'bg-transparent text-zinc-300 border-neutral-800 hover:bg-white/5'
                  }`}
                >
                  <Heart size={12} className={wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''} />
                  <span>{wishlist.includes(selectedProduct.id) ? 'Wishlisted' : 'Wishlist'}</span>
                </button>

                <button 
                  onClick={() => { handleAddToCart(selectedProduct, selectedSize); setSelectedProduct(null); }}
                  className="flex-grow py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 hover:text-black text-white font-sans text-xs font-extrabold uppercase tracking-wide transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart size={13} /> Add to shopping bag
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* WISHLIST SIDE DRAWER PANEL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-end">
          <div className="w-full max-w-sm h-screen bg-neutral-950 border-l border-white/10 p-6 flex flex-col justify-between relative shadow-2xl">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-display text-white text-lg font-bold tracking-wider uppercase flex items-center gap-2">
                  <Heart size={14} className="text-red-500 fill-red-500" /> Your Wishlist
                </h3>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Wishlisted products stack */}
              <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1 pt-4 scrollbar-thin">
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 font-medium text-xs">
                    <p>Your wishlist is currently empty.</p>
                    <p className="text-[10px] text-zinc-650 mt-1">Tap the heart on high-grade basketball equipment!</p>
                  </div>
                ) : (
                  wishlist.map(wId => {
                    const prod = PRODUCTS_DATA.find(p => p.id === wId);
                    if (!prod) return null;
                    return (
                      <div key={prod.id} className="p-3 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 grayscale"
                          />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-orange-400/80 font-mono font-bold">₹{prod.price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => { handleAddToCart(prod, prod.sizes[0] || 'Standard'); setIsWishlistOpen(false); }}
                            className="p-1.5 px-2 bg-white text-black rounded-lg text-[9px] font-bold uppercase transition-transform cursor-pointer"
                          >
                            + Bag
                          </button>
                          <button 
                            onClick={() => handleToggleWishlist(prod.id)}
                            className="p-1 px-1.5 text-zinc-500 hover:text-red-400 text-xs cursor-pointer"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-center font-mono text-[9px] text-zinc-500">
              ✓ Saved items persist securely in India database
            </div>

          </div>
        </div>
      )}

      {/* SHOPPING BAG / CART OVERLAY WITH CODE + UPI DISCHARGE */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl p-6 relative shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-display text-white text-md font-bold tracking-wider uppercase flex items-center gap-2">
                <ShoppingCart size={13} className="text-orange-500" /> Secure Checkout Roster
              </h3>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ×
              </button>
            </div>

            {/* CART STEP 1: QUANTITIES & TOTALS */}
            {checkoutStep === 'cart' && (
              <div className="space-y-4 text-left">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 font-medium text-xs space-y-1">
                    <p>Your shopping bag is empty.</p>
                    <p className="text-[10px] text-zinc-650">Add premium India balls and gear accessories!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                      {cart.map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 flex-grow text-left">
                            <span className="w-1 px-1.5 py-0.2 bg-zinc-900 rounded-[5px] text-[8px] text-zinc-500">Qty {item.quantity}</span>
                            <div className="flex flex-col leading-tight ml-1">
                              <span className="font-bold text-white uppercase truncate max-w-[140px] block">{item.product.name}</span>
                              <span className="text-[9.5px] text-zinc-500 uppercase font-medium">Fit Sizing: {item.size}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <div className="flex bg-neutral-900 border border-white/5 p-0.5 rounded-lg select-none font-bold text-[9px]">
                              <button 
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-4 h-4 rounded text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-white">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-4 h-4 rounded text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-white tracking-widest min-w-[45px] text-right">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-zinc-600 hover:text-red-500 cursor-pointer p-1"
                              title="Delete Item"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Coupon Section */}
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                       <input
                        type="text"
                        placeholder="Enter Promo (DUSKSLAM, MUMBAIVIP)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-grow bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none placeholder-zinc-600 uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 text-white hover:bg-zinc-700 text-xs font-bold font-mono tracking-wider cursor-pointer transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                    {couponError && <p className="text-[10px] text-red-400 font-mono text-left">{couponError}</p>}
                    {activeCoupon && (
                      <p className="text-[10px] text-emerald-400 font-mono text-left flex items-center gap-1">
                        ✓ Promo Code <strong>{activeCoupon}</strong> applied successfully! (20% Off)
                      </p>
                    )}

                    <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/5 space-y-1.5 text-xs font-bold text-white text-left">
                      <div className="flex justify-between items-center text-zinc-400 font-normal">
                        <span>Subtotal:</span>
                        <span className="font-mono text-white">₹{calculateSubtotal().toLocaleString()}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-400 font-normal">
                          <span>Discount (20%):</span>
                          <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-white/5 pt-1.5 text-sm">
                        <span>Total Amount due:</span>
                        <span className="text-orange-400 font-mono font-extrabold">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep('details')}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-sans text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Continue Shipping details <ArrowRight size={12} />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* CART STEP 2: SHIPPING AND COD OR UPI DECISION */}
            {checkoutStep === 'details' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Courier Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white outline-none w-full font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Mobile Phone</label>
                      <input 
                        type="phone" 
                        required
                        placeholder="+81 90-1234-5678"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white outline-none w-full font-mono font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Payment Style</label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'upi')}
                        className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-bold"
                      >
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="upi">Simulated Unified UPI Scan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">India Delivery Address</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Bandra West, Mumbai, Maharashtra - 400050"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white outline-none w-full resize-none font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-zinc-300 font-bold text-xs"
                  >
                    Back to Bag
                  </button>
                  <button 
                    type="submit"
                    className="py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase"
                  >
                    {paymentMethod === 'upi' ? 'Generate Pay QR' : 'Finalize COD Order'}
                  </button>
                </div>
              </form>
            )}

            {/* CART STEP 3: UPI QR SIMULATED GATEWAY */}
            {checkoutStep === 'upi' && (
              <div className="text-center py-4 space-y-4">
                <span className="px-2.5 py-1 rounded bg-orange-600/10 border border-orange-500/20 text-[8.5px] text-orange-400 font-extrabold uppercase tracking-widest">
                  Secure UPI Decal QR
                </span>

                <div className="space-y-1">
                  <p className="text-xs text-white font-semibold">Scan code to settle ₹{calculateTotal().toLocaleString()}</p>
                  <p className="text-[9px] text-zinc-400 font-sans">Simulating merchant ID: <strong>duskslamhoop@upi</strong></p>
                </div>

                {/* QR Code Graphic Generator (SVG) */}
                <div className="w-[140px] h-[140px] bg-white p-2 rounded-2xl mx-auto shadow-xl border border-orange-500/10 flex items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    {/* Corners squares */}
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="9" y="9" width="17" height="17" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="74" y="9" width="17" height="17" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />

                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="9" y="74" width="17" height="17" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />

                    {/* Dynamic dots patterns mimicking real street coding */}
                    <path d="M 35 5 L 40 5 L 40 15 L 35 15 Z M 45 10 L 55 10 L 55 15 L 45 15 Z M 60 5 L 65 5 L 65 25 L 60 25 Z" fill="black" />
                    <path d="M 35 25 L 45 25 L 45 35 L 35 35 Z M 50 20 L 55 20 L 55 35 L 50 35 Z" fill="black" />
                    <path d="M 5 L 35 L 35 45 L 5 45 Z M 40 40 L 60 40 L 60 45 L 40 45 Z" fill="black" />
                    <path d="M 35 70 L 65 70 L 65 75 L 35 75 Z M 70 35 L 95 35 L 95 45 L 70 45 Z M 45 55 L 75 55 L 75 60 L 45 60 Z M 80 80 L 95 80 L 95 95 L 80 95 Z" fill="black" />
                    <path d="M 68 85 L 72 85 L 72 95 L 68 95 Z" fill="black" />
                    <path d="M 35 88 L 60 88 L 60 95 L 35 95 Z" fill="black" />
                    
                    {/* Basketball logo anchor in the center */}
                    <circle cx="50" cy="50" r="14" fill="white" />
                    <circle cx="50" cy="50" r="11" fill="#ea580c" />
                    <line x1="50" y1="39" x2="50" y2="61" stroke="white" strokeWidth="1" />
                    <line x1="39" y1="50" x2="61" y2="50" stroke="white" strokeWidth="1" />
                  </svg>

                  {/* Status Overlay animation */}
                  {upiStatus === 'verifying' && (
                    <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur rounded-2xl flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={24} className="text-orange-500 animate-spin" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">VERIFYING FUNDS...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10.5px] text-zinc-300 font-medium">To simulate scan, wait for checkout loop or swipe approval.</p>
                  <p className="text-[12px] font-bold text-orange-500 font-mono animate-pulse">
                    ⏰ Simulated transaction timer: {upiTimer}s
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setUpiStatus('verifying');
                      setTimeout(() => {
                        setUpiStatus('completed');
                        setCheckoutStep('success');
                        setCart([]);
                        saveCart([]);
                      }, 1200);
                    }}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs uppercase"
                  >
                    Simulate Quick Approve Pay
                  </button>
                </div>
              </div>
            )}

            {/* CART STEP 4: SUCCESS ACQUITMENT PAGE */}
            {checkoutStep === 'success' && (
              <div className="text-center py-8 space-y-4 text-left">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg mx-auto animate-bounce">
                  🏆
                </div>
                
                <div className="text-center space-y-1.5">
                  <h4 className="font-display text-white text-md font-bold tracking-wider uppercase">INDIA SLAM-GEAR DIRECTIVE</h4>
                  <h3 className="font-sans text-emerald-400 font-bold text-xs uppercase">Order Placed successfully!</h3>
                  <p className="text-[10.5px] text-zinc-400 max-w-xs mx-auto leading-relaxed mt-2">
                    Thank you, <strong>{shippingName || 'Athlete'}</strong>! We have registered your delivery to <em>{shippingAddress || 'Bandra Court Side'}</em>. Estimated dispatch is next-day priority.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-center">
                  <button
                    onClick={() => { playMetallicClick(); setIsCartOpen(false); }}
                    className="px-6 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase transition-all tracking-wide cursor-pointer mx-auto block"
                  >
                    Back to Store
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
