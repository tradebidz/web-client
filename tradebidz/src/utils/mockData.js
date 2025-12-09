// Mock data aligned with TypeScript interfaces from @/types/index.ts

// --- MOCK USERS ---
export const mockUsers = [
  {
    id: 1,
    email: "john.doe@example.com",
    fullName: "John Doe",
    address: "123 Main St, City, State 12345",
    role: "SELLER",
    ratingScore: 4.8,
    ratingCount: 125,
    isVerified: true,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    address: "456 Oak Ave, City, State 12345",
    role: "BIDDER",
    ratingScore: 9.5,
    ratingCount: 89,
    isVerified: true,
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: 3,
    email: "bob.wilson@example.com",
    fullName: "Bob Wilson",
    address: "789 Pine Rd, City, State 12345",
    role: "SELLER",
    ratingScore: 4.6,
    ratingCount: 67,
    isVerified: true,
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: 4,
    email: "alice.johnson@example.com",
    fullName: "Alice Johnson",
    address: "321 Elm St, City, State 12345",
    role: "BIDDER",
    ratingScore: 8.2,
    ratingCount: 45,
    isVerified: false,
    createdAt: "2024-04-05T09:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: 5,
    email: "admin@tradebidz.com",
    fullName: "Admin User",
    address: "Admin Office, TradeBidz HQ",
    role: "ADMIN",
    ratingScore: 10.0,
    ratingCount: 200,
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  }
];

// --- MOCK CATEGORIES ---
export const mockCategories = [
  {
    id: 1,
    parentId: null,
    name: "Electronics",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    children: []
  },
  {
    id: 2,
    parentId: null,
    name: "Watches",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    children: []
  },
  {
    id: 3,
    parentId: null,
    name: "Shoes",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    children: []
  },
  {
    id: 4,
    parentId: 1,
    name: "Smartphones",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    children: []
  },
  {
    id: 5,
    parentId: 1,
    name: "Laptops",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    children: []
  }
];

// --- MOCK PRODUCT IMAGES ---
const createProductImages = (productId, urls, primaryIndex = 0) => {
  return urls.map((url, index) => ({
    id: productId * 100 + index,
    productId,
    url,
    isPrimary: index === primaryIndex
  }));
};

// --- MOCK BIDS ---
export const mockBids = [
  {
    id: 1,
    productId: 1,
    bidderId: 2,
    amount: 1199,
    maxAmount: 1300,
    isAutoBid: false,
    time: "2025-12-10T10:43:00Z",
    status: "VALID",
    bidder: mockUsers[1]
  },
  {
    id: 2,
    productId: 1,
    bidderId: 4,
    amount: 1189,
    maxAmount: null,
    isAutoBid: false,
    time: "2025-12-10T09:43:00Z",
    status: "INVALID",
    bidder: mockUsers[3]
  },
  {
    id: 3,
    productId: 1,
    bidderId: 2,
    amount: 1179,
    maxAmount: null,
    isAutoBid: false,
    time: "2025-12-10T08:43:00Z",
    status: "INVALID",
    bidder: mockUsers[1]
  },
  {
    id: 4,
    productId: 2,
    bidderId: 4,
    amount: 2199,
    maxAmount: null,
    isAutoBid: false,
    time: "2025-12-09T12:00:00Z",
    status: "VALID",
    bidder: mockUsers[3]
  },
  {
    id: 5,
    productId: 3,
    bidderId: 2,
    amount: 249,
    maxAmount: null,
    isAutoBid: false,
    time: "2025-12-08T09:00:00Z",
    status: "VALID",
    bidder: mockUsers[1]
  },
  {
    id: 6,
    productId: 5,
    bidderId: 4,
    amount: 1399,
    maxAmount: null,
    isAutoBid: false,
    time: "2025-12-07T20:00:00Z",
    status: "VALID",
    bidder: mockUsers[3]
  }
];

// --- MOCK PRODUCTS (Full schema) ---
const baseProducts = [
  {
    id: 1,
    sellerId: 1,
    categoryId: 4,
    name: "iPhone 15 Pro Max Titanium",
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500",
    description: `
      <p><strong>Product Features:</strong></p>
      <ul>
        <li>Premium Titanium Design</li>
        <li>Apple A17 Pro Chip</li>
        <li>Advanced Triple Camera System</li>
        <li>6.7" Super Retina XDR Display</li>
        <li>USB-C Port</li>
      </ul>
      <p>Condition: Brand new, sealed box.</p>
    `,
    startPrice: 999,
    currentPrice: 1199,
    stepPrice: 10,
    buyNowPrice: 1399,
    startTime: "2025-12-01T08:00:00Z",
    endTime: "2025-12-30T10:00:00Z",
    isAutoExtend: true,
    status: "ACTIVE",
    winnerId: null,
    viewCount: 1250,
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2025-12-10T10:43:00Z",
    imageUrls: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1.jpg",
      "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
      "https://happyphone.vn/wp-content/uploads/2024/01/iPhone-15-Pro-Max2222-1024x576.png"
    ]
  },
  {
    id: 2,
    sellerId: 3,
    categoryId: 5,
    name: "MacBook Pro M3 14-inch",
    thumbnail: "https://www.didongmy.com/vnt_upload/news/11_2023/MacBook-Pro-14-inch-M3-didongmy_5.jpg",
    description: `
      <p><strong>MacBook Pro M3 Features:</strong></p>
      <ul>
        <li>Apple M3 Chip with 8-core CPU and 10-core GPU</li>
        <li>14.2-inch Liquid Retina XDR Display</li>
        <li>18GB Unified Memory</li>
        <li>512GB SSD Storage</li>
        <li>Up to 22 hours battery life</li>
      </ul>
      <p>Condition: Brand new, factory sealed.</p>
    `,
    startPrice: 1899,
    currentPrice: 2199,
    stepPrice: 25,
    buyNowPrice: 2499,
    startTime: "2025-12-05T08:00:00Z",
    endTime: "2025-12-25T12:00:00Z",
    isAutoExtend: true,
    status: "ACTIVE",
    winnerId: null,
    viewCount: 856,
    createdAt: "2025-12-05T08:00:00Z",
    updatedAt: "2025-12-09T12:00:00Z",
    imageUrls: [
      "https://www.didongmy.com/vnt_upload/news/11_2023/MacBook-Pro-14-inch-M3-didongmy_5.jpg"
    ]
  },
  {
    id: 3,
    sellerId: 1,
    categoryId: 2,
    name: "Seiko 5 Automatic Watch",
    thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500",
    description: `
      <p><strong>Seiko 5 Automatic Watch:</strong></p>
      <ul>
        <li>Automatic Mechanical Movement</li>
        <li>42mm Case Size</li>
        <li>Water Resistant up to 100m</li>
        <li>Hardlex Crystal</li>
        <li>Luminous Hands and Markers</li>
      </ul>
      <p>Condition: Like new, worn only a few times.</p>
    `,
    startPrice: 150,
    currentPrice: 249,
    stepPrice: 5,
    buyNowPrice: 299,
    startTime: "2025-12-01T09:00:00Z",
    endTime: "2025-12-20T09:00:00Z",
    isAutoExtend: false,
    status: "ACTIVE",
    winnerId: null,
    viewCount: 432,
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2025-12-08T09:00:00Z",
    imageUrls: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500"
    ]
  },
  {
    id: 4,
    sellerId: 3,
    categoryId: 3,
    name: "Nike Air Jordan 1",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500",
    description: `
      <p><strong>Nike Air Jordan 1:</strong></p>
      <ul>
        <li>Classic High-Top Design</li>
        <li>Leather Upper</li>
        <li>Air-Sole Cushioning</li>
        <li>Size: US 10.5</li>
        <li>Color: Black/White/Red</li>
      </ul>
      <p>Condition: New without box, tried on once.</p>
    `,
    startPrice: 120,
    currentPrice: 180,
    stepPrice: 5,
    buyNowPrice: 220,
    startTime: "2025-12-08T08:00:00Z",
    endTime: "2025-12-28T15:00:00Z",
    isAutoExtend: true,
    status: "ACTIVE",
    winnerId: null,
    viewCount: 234,
    createdAt: "2025-12-08T08:00:00Z",
    updatedAt: "2025-12-08T08:00:00Z",
    imageUrls: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500"
    ]
  },
  {
    id: 5,
    sellerId: 1,
    categoryId: 1,
    name: "Sony A7 III Camera",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500",
    description: `
      <p><strong>Sony A7 III Camera:</strong></p>
      <ul>
        <li>24.2MP Full-Frame Sensor</li>
        <li>4K Video Recording</li>
        <li>5-Axis Image Stabilization</li>
        <li>693 AF Points</li>
        <li>Up to 710 Shots per Charge</li>
      </ul>
      <p>Condition: Excellent, used professionally. Includes original box and accessories.</p>
    `,
    startPrice: 1200,
    currentPrice: 1399,
    stepPrice: 20,
    buyNowPrice: 1599,
    startTime: "2025-12-02T08:00:00Z",
    endTime: "2025-12-22T20:00:00Z",
    isAutoExtend: true,
    status: "ACTIVE",
    winnerId: null,
    viewCount: 678,
    createdAt: "2025-12-02T08:00:00Z",
    updatedAt: "2025-12-07T20:00:00Z",
    imageUrls: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500"
    ]
  }
];

// Enrich products with relations and computed fields for backward compatibility
const enrichProduct = (product) => {
  const seller = mockUsers.find(u => u.id === product.sellerId);
  const category = mockCategories.find(c => c.id === product.categoryId);
  const productBids = mockBids.filter(b => b.productId === product.id && b.status === "VALID");
  const highestBid = productBids.length > 0 
    ? productBids.reduce((max, bid) => bid.amount > max.amount ? bid : max, productBids[0])
    : null;
  const images = createProductImages(product.id, product.imageUrls || [product.thumbnail]);
  const imageUrls = product.imageUrls || [product.thumbnail];
  
  // Count bids (only valid ones)
  const bidCount = productBids.length;
  
  // Get highest bidder name (masked for privacy)
  let bidderName = "None";
  let currentBidder = null;
  if (highestBid && highestBid.bidder) {
    const name = highestBid.bidder.fullName;
    bidderName = name.length > 4 ? `****${name.slice(-4)}` : `****${name}`;
    currentBidder = {
      name: bidderName,
      rating: highestBid.bidder.ratingScore
    };
  }

  // Seller with backward compatibility
  const sellerWithCompat = seller ? {
    ...seller,
    name: seller.fullName, // Backward compat for ProductDetail
    rating: seller.ratingScore // Backward compat for ProductDetail
  } : null;

  return {
    ...product,
    // Full schema fields
    category: category || null,
    // Backward compatibility: images as array of strings (for ProductDetail component)
    images: imageUrls, // Array of string URLs
    // Also keep image objects for full schema compliance
    imageObjects: images,
    // Computed/backward compatibility fields
    image: product.thumbnail || (imageUrls.length > 0 ? imageUrls[0] : ""),
    price: product.currentPrice,
    bids: bidCount,
    bidderName: bidderName,
    timeLeft: product.endTime,
    isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if created within last 7 days
    // Seller with compatibility fields (for ProductDetail component)
    seller: sellerWithCompat,
    // Current bidder (for ProductDetail component)
    currentBidder: currentBidder || { name: "None", rating: 0 },
    // For bid history
    bidHistory: productBids
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .map(bid => ({
        id: bid.id,
        time: bid.time,
        bidder: bid.bidder ? (bid.bidder.fullName.length > 4 ? `****${bid.bidder.fullName.slice(-4)}` : `****${bid.bidder.fullName}`) : "Unknown",
        price: bid.amount
      }))
  };
};

// --- EXPORTED MOCK DATA (for backward compatibility) ---

// Products list (with backward compatibility fields)
export const mockProducts = baseProducts.map(enrichProduct);

// Detailed product mock for ProductDetail page
export const productDetailMock = enrichProduct(baseProducts[0]);

// Watchlist (products user is watching)
export const mockWatchList = [
  enrichProduct(baseProducts[0]), // iPhone
  enrichProduct(baseProducts[2]), // Watch
];

// My Bids (for bidder's view)
export const mockMyBids = [
  {
    id: 1,
    productId: 1,
    productName: "iPhone 15 Pro Max Titanium 256GB",
    image: enrichProduct(baseProducts[0]).image,
    myBid: 1199,
    currentPrice: 1199,
    isWinning: true,
    endTime: "2025-12-30T10:00:00Z",
    seller: mockUsers[0].fullName
  },
  {
    id: 2,
    productId: 3,
    productName: "Seiko 5 Automatic Watch",
    image: enrichProduct(baseProducts[2]).image,
    myBid: 169,
    currentPrice: 179,
    isWinning: false,
    endTime: "2025-12-22T20:00:00Z",
    seller: mockUsers[0].fullName
  }
];

// Won Products (products user has won)
export const mockWonProducts = [
  {
    id: 10,
    name: "iPhone 15 Pro Max Titanium",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200",
    finalPrice: 1199,
    seller: mockUsers[0].fullName,
    endedAt: "2025-12-01T10:00:00Z",
    status: "ready_to_checkout" // ready_to_checkout, paid, completed
  },
  {
    id: 11,
    name: "Seiko 5 Automatic Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200",
    finalPrice: 179,
    seller: mockUsers[0].fullName,
    endedAt: "2025-11-20T09:00:00Z",
    status: "completed"
  }
];

// Seller Products (products listed by seller)
export const mockSellerProducts = [
  {
    id: 2,
    name: "MacBook Pro M3 14-inch",
    image: enrichProduct(baseProducts[1]).image,
    currentPrice: 1899,
    bids: 8,
    timeLeft: "2025-12-25T12:00:00Z",
    status: "active",
    highestBidder: mockUsers[3].fullName.length > 4 
      ? `****${mockUsers[3].fullName.slice(-4)}` 
      : `****${mockUsers[3].fullName}`
  },
  {
    id: 6,
    name: "Keychron K2 Mechanical Keyboard",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200",
    currentPrice: 89,
    bids: 12,
    timeLeft: "2025-12-01T10:00:00Z",
    status: "ended",
    winner: "User123",
    isPaid: false
  }
];

// --- MOCK UPGRADE REQUESTS ---
export const mockUpgradeRequests = [
  {
    id: 1,
    userId: 2,
    reason: "Want to sell products on the platform",
    status: "PENDING",
    createdAt: "2024-12-01T08:00:00Z",
    user: mockUsers[1] // Jane Smith
  },
  {
    id: 2,
    userId: 4,
    reason: "I have many items to list",
    status: "PENDING",
    createdAt: "2024-12-02T10:00:00Z",
    user: mockUsers[3] // Alice Johnson
  },
  {
    id: 3,
    userId: 2,
    reason: "Previous request was rejected, trying again",
    status: "REJECTED",
    createdAt: "2024-11-25T09:00:00Z",
    user: mockUsers[1]
  }
];
