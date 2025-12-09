export const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max Titanium",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500",
    price: 1199, // USD
    bidderName: "****Khoa",
    bids: 15,
    timeLeft: "2025-12-30T10:00:00",
    isNew: true,
    category: "Electronics"
  },
  {
    id: 2,
    name: "MacBook Pro M3 14-inch",
    image: "https://www.didongmy.com/vnt_upload/news/11_2023/MacBook-Pro-14-inch-M3-didongmy_5.jpg",
    price: 2199, // USD
    bidderName: "****Tuan",
    bids: 8,
    timeLeft: "2025-12-25T12:00:00",
    isNew: false,
    category: "Electronics"
  },
  {
    id: 3,
    name: "Seiko 5 Automatic Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500",
    price: 249, // USD
    bidderName: "****Minh",
    bids: 24,
    timeLeft: "2025-12-20T09:00:00",
    isNew: true,
    category: "Watches"
  },
  {
    id: 4,
    name: "Nike Air Jordan 1",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500",
    price: 180, // USD
    bidderName: "None",
    bids: 0,
    timeLeft: "2025-12-28T15:00:00",
    isNew: false,
    category: "Shoes"
  },
  {
    id: 5,
    name: "Sony A7 III Camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500",
    price: 1399, // USD
    bidderName: "****Linh",
    bids: 42,
    timeLeft: "2025-12-22T20:00:00",
    isNew: false,
    category: "Electronics"
  }
];


// Detailed product mock for testing
export const productDetailMock = {
  id: 1,
  name: "iPhone 15 Pro Max Titanium 256GB",
  images: [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1.jpg",
    "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg", 
    "https://happyphone.vn/wp-content/uploads/2024/01/iPhone-15-Pro-Max2222-1024x576.png"
  ],

  // Prices converted to clean USD values
  price: 1199,             // Current bid price
  buyNowPrice: 1399,       // Buy now option
  stepPrice: 10,           // Minimum next bid step

  currentBidder: {
    name: "****Khoa",
    rating: 9.5,
  },

  seller: {
    name: "AppleStore_Official",
    rating: 4.8,
  },

  createdAt: "2025-12-01T08:00:00",
  endTime: "2025-12-30T10:00:00",

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

  bidHistory: [
    { id: 1, time: "2025-12-10T10:43:00", bidder: "****Khoa", price: 1199 },
    { id: 2, time: "2025-12-10T09:43:00", bidder: "****Kha",  price: 1189 },
    { id: 3, time: "2025-12-10T08:43:00", bidder: "****Tuan", price: 1179 },
  ],

  category: "Electronics"
};

// ... existing exports

export const mockWatchList = [
  mockProducts[0], // iPhone
  mockProducts[2], // Watch
];

export const mockMyBids = [
  {
    id: 1,
    productId: 1,
    productName: "iPhone 15 Pro Max Titanium 256GB",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200",
    
    myBid: 1199,          // Your current bid (USD)
    currentPrice: 1199,   // Equal → winning
    isWinning: true,

    endTime: "2025-12-30T10:00:00",
    seller: "AppleStore_Official"
  },
  {
    id: 2,
    productId: 3,
    productName: "Seiko 5 Automatic Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200",

    myBid: 169,          // Your bid
    currentPrice: 179,   // Higher → losing
    isWinning: false,

    endTime: "2025-12-22T20:00:00",
    seller: "WatchMaster"
  }
];

export const mockWonProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max Titanium",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200",
    finalPrice: 1199, // USD
    seller: "AppleStore_Official",
    endedAt: "2025-12-01T10:00:00",
    status: "ready_to_checkout" // ready_to_checkout, paid, completed
  },
  {
    id: 3,
    name: "Seiko 5 Automatic Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200",
    finalPrice: 179, // USD
    seller: "WatchLover",
    endedAt: "2025-11-20T09:00:00",
    status: "completed"
  }
];

export const mockSellerProducts = [
  {
    id: 1,
    name: "MacBook Pro M3 14-inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=200",
    currentPrice: 1899, // USD (approx real price)
    bids: 8,
    timeLeft: "2025-12-25T12:00:00",
    status: "active",
    highestBidder: "****Tuan"
  },
  {
    id: 2,
    name: "Keychron K2 Mechanical Keyboard",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200",
    currentPrice: 89, // USD (avg real pricing)
    bids: 12,
    timeLeft: "2025-12-01T10:00:00",
    status: "ended",
    winner: "User123",
    isPaid: false
  }
];
