// --- ENUMS ---

export type UserRole = 'BIDDER' | 'SELLER' | 'ADMIN';

export type ProductStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'CANCELLED'; 

export type BidStatus = 'VALID' | 'INVALID' | 'REJECTED'; 

export type UpgradeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// --- MAIN ENTITIES ---

export interface User {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  role: UserRole;
  ratingScore: number;
  ratingCount: number;
  isVerified: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string;
}

export interface Category {
  id: number;
  parentId?: number | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface Product {
  id: number;
  sellerId: number;
  categoryId: number;
  name: string;
  thumbnail?: string;
  description: string; // HTML content
  startPrice: number;
  currentPrice: number;
  stepPrice: number;
  buyNowPrice?: number | null;
  startTime: string;
  endTime: string;
  isAutoExtend: boolean;
  status: ProductStatus;
  winnerId?: number | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  seller?: User;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  isPrimary: boolean;
}

export interface ProductDescription {
  id: number;
  productId: number;
  content: string;
  createdAt: string;
}

export interface Bid {
  id: number;
  productId: number;
  bidderId: number;
  amount: number;
  maxAmount?: number;
  isAutoBid: boolean;
  time: string;
  status: BidStatus;

  // Relations
  bidder?: User; 
}

export interface Watchlist {
  userId: number;
  productId: number;
  createdAt: string;
  product?: Product;
}

export interface Feedback {
  id: number;
  productId: number;
  fromUserId: number;
  toUserId: number;
  score: 1 | -1;
  comment?: string;
  createdAt: string;
  
  // Relations
  fromUser?: User;
}

export interface UpgradeRequest {
  id: number;
  userId: number;
  reason?: string;
  status: UpgradeStatus;
  createdAt: string;
  
  // Relations
  user?: User;
}

export interface BannedBidder {
  id: number;
  productId: number;
  userId: number;
  reason?: string;
  createdAt: string;
}

export interface ProductQuestion {
  id: number;
  productId: number;
  userId: number;
  question: string;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
  
  // Relations
  user?: User; 
}

export interface ChatMessage {
  id: number;
  productId: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// --- API RESPONSE WRAPPER ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}