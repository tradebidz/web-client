import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaGavel, FaClock, FaUser, FaStore, FaHeart, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import ProductCard from '../../components/product/ProductCard';
import { toast } from 'react-toastify';
import LoadingModal from '../../components/common/LoadingModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import BidModal from '../../components/product/BidModal';
import { getProductById, getBidHistory, getTopEnding, getSellerBids, banBidder, createQuestion, answerQuestion } from '../../services/productService';
import { buyNow } from '../../services/biddingService';
import { createOrder } from '../../services/orderService';
import { createPaymentUrl } from '../../services/paymentService';
import { toggleWatchlist, getMyWatchlist } from '../../services/userService';
import { addToWatchlist, removeFromWatchlist } from '../../redux/slices/watchlistSlice';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProduct, updateProduct } from '../../redux/slices/productSlice';
import { setProductBids } from '../../redux/slices/bidSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [questionContent, setQuestionContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState(null); // Which question is being answered
  const [bidderToBan, setBidderToBan] = useState(null); // { bidderId, name, productId }
  const [banReason, setBanReason] = useState('');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const watchlist = useSelector(state => state.watchlist.watchlist) || [];

  // Subscribe to WebSocket updates for this product
  const { isConnected } = useWebSocket(parseInt(id));

  // Fetch product data
  const fetchProductData = useCallback(async () => {
    try {
      // Don't set loading to true here to avoid flashing UI on refresh
      // setLoading(true); 
      const productData = await getProductById(id);
      setProduct(productData);

      // Update Redux
      dispatch(setCurrentProduct(productData));

      // Fetch bid history (check if seller for full history)
      let history = productData.bids;
      if (isAuthenticated && user?.id === productData.seller_id) {
        try {
          history = await getSellerBids(id);
          console.log(history);
        } catch (e) {
          console.error("Failed to fetch seller bids", e);
          history = await getBidHistory(id);
        }

        setBidHistory(history || []);
        dispatch(setProductBids(history || []));

        // Check watchlist status if authenticated
        if (isAuthenticated) {
          try {
            setIsInWatchlist(watchlist.some(item => item.id === parseInt(id)));
          } catch (error) {
            console.error('Error checking watchlist:', error);
          }
        }

        // Fetch related products (top ending)
        try {
          const related = await getTopEnding();
          setRelatedProducts(related?.slice(0, 5) || []);
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Lỗi khi tải thông tin sản phẩm');
          navigate('/products');
        } finally {
          setLoading(false);
        }
      } 

      setBidHistory(history || []);
      dispatch(setProductBids(history || []));

      // Check watchlist status if authenticated
      if (isAuthenticated) {
        try {
          const watchlist = await getMyWatchlist();
          const inWatchlist = watchlist.some(item =>
            item.productId === parseInt(id) || item.product?.id === parseInt(id)
          );
          setIsInWatchlist(inWatchlist);
        } catch (error) {
          console.error('Error checking watchlist:', error);
        }
      }

      // Fetch related products (top ending)
      try {
        const related = await getTopEnding();
        setRelatedProducts(related?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Lỗi khi tải thông tin sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user, dispatch, navigate]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductData();
    }
  }, [id, fetchProductData]);

  // Initialize active image when product changes
  useEffect(() => {
    if (product) {
      const images = product.product_images || [];
      if (images.length > 0) {
        const primaryImg = images.find(img => img.is_primary) || images[0];
        const primaryIndex = images.findIndex(img => img.id === primaryImg.id);
        setActiveImage(primaryImg.url);
        setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        setImageOpacity(1);
      } else if (product.thumbnail) {
        setActiveImage(product.thumbnail);
        setCurrentImageIndex(0);
        setImageOpacity(1);
      }
    }
  }, [product?.id]); // Only reinitialize when product ID changes

  // Helper function to change image with fade effect
  const changeImageWithFade = useCallback((newIndex) => {
    if (!product?.product_images || !product.product_images[newIndex]) return;
    setImageOpacity(0); // Fade out
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setActiveImage(product.product_images[newIndex].url);
      setImageOpacity(1); // Fade in
    }, 300); // Wait for fade-out to complete
  }, [product]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!product || !product.product_images || product.product_images.length <= 1) return;
    if (isSlideshowPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % product.product_images.length;
        // Use fade effect for smooth transition
        setImageOpacity(0);
        setTimeout(() => {
          setCurrentImageIndex(nextIndex);
          setActiveImage(product.product_images[nextIndex].url);
          setImageOpacity(1);
        }, 300);
        return nextIndex;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [product, isSlideshowPaused, changeImageWithFade]);

  // Listen to Redux updates from WebSocket
  const currentProduct = useSelector((state) => state.products.currentProduct);
  const prevCurrentPriceRef = useRef(null);

  useEffect(() => {
    if (currentProduct && currentProduct.id === parseInt(id)) {
      // Check for new bids to show toast
      if (prevCurrentPriceRef.current !== null && currentProduct.currentPrice > 0 && currentProduct.currentPrice > prevCurrentPriceRef.current) {
        toast.info(`Có giá mới! Giá hiện tại: ${formatCurrency(currentProduct.currentPrice > 0 ? currentProduct.currentPrice : currentProduct.startPrice)}`);
      }
      prevCurrentPriceRef.current = currentProduct.currentPrice > 0 ? currentProduct.currentPrice : currentProduct.startPrice;

      setProduct(currentProduct);
      // Update active image if product images changed (Schema: product_images relation)
      if (currentProduct.product_images && currentProduct.product_images.length > 0) {
        const primaryImg = currentProduct.product_images.find(img => img.is_primary) || currentProduct.product_images[0];
        const primaryIndex = currentProduct.product_images.findIndex(img => img.id === primaryImg.id);
        if (primaryImg?.url) {
          setActiveImage(primaryImg.url);
          setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        }
      } else if (currentProduct.thumbnail && currentProduct.thumbnail !== activeImage) {
        setActiveImage(currentProduct.thumbnail);
        setCurrentImageIndex(0);
      }
    }
    // eslint-disable-next-line
  }, [currentProduct, id]);

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để đấu giá');
      // navigate('/login');
      return;
    }

    console.log(user);

    if (user && (user.rating_score || user.ratingScore || 0) < 80) {
      toast.error('Bạn cần điểm tín nhiệm từ 80% trở lên để được phép đấu giá');
      return;
    }

    setShowBidModal(true);
  };

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để theo dõi');
      // navigate('/login');
      return;
    }

    try {
      await toggleWatchlist(parseInt(id));
      setIsInWatchlist(!isInWatchlist);
      if (isInWatchlist) {
        dispatch(removeFromWatchlist(parseInt(id)));
        toast.success('Đã bỏ theo dõi');
      } else {
        dispatch(addToWatchlist(product));
        toast.success('Đã thêm vào danh sách theo dõi');
      }
    } catch (error) {
      toast.error('Lỗi cập nhật danh sách theo dõi');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để mua ngay');
      return;
    }

    try {
      setBuyingNow(true);
      await buyNow(id);
      toast.success('Mua ngay thành công! Vui lòng kiểm tra đơn hàng.');
      setIsBuyNowModalOpen(false);

      // Refresh product data
      const productData = await getProductById(id);
      setProduct(productData);
      dispatch(setCurrentProduct(productData));

    } catch (error) {
      toast.error(error.response?.data || 'Lỗi khi mua ngay');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true); // Re-use loading state or create a new one if needed
      const order = await createOrder(parseInt(id));
      const { url } = await createPaymentUrl(order.id);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to generate payment URL");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  // --- Q&A Handlers ---
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!questionContent.trim()) return;
    try {
      await createQuestion(id, questionContent);
      toast.success('Gửi câu hỏi thành công!');
      setQuestionContent('');
      // Reload product to see new question
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
    } catch (error) {
      toast.error('Gửi câu hỏi thất bại');
    }
  };

  const handleAnswerQuestion = async (e, qId) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    try {
      await answerQuestion(qId, answerContent);
      toast.success('Gửi câu trả lời thành công!');
      setAnswerContent('');
      setActiveQuestionId(null);
      // Reload product
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
    } catch (error) {
      toast.error('Gửi câu trả lời thất bại');
    }
  };

  // --- Ban Handler ---
  const openBanModal = (bid) => {
    setBidderToBan(bid);
    setIsBanModalOpen(true);
  };

  const handleBanBidder = async () => {
    if (!bidderToBan || !banReason.trim()) return;
    try {
      await banBidder(id, {
        bidderId: bidderToBan.bidder_id, // ensure bidder_id is present from getSellerBids
        reason: banReason
      });
      toast.success(`Đã từ chối người mua ${bidderToBan.bidder_name}`);
      setIsBanModalOpen(false);
      setBidderToBan(null);
      setBanReason('');

      // Refresh bids
      const history = await getSellerBids(id);
      setBidHistory(history || []);

    } catch (error) {
      toast.error('Lỗi khi từ chối người mua');
    }
  };

  const isSeller = isAuthenticated && user?.id === product?.seller_id;

  if (loading) return <LoadingModal isOpen={true} text="Đang tải..." />;
  if (!product) return <div className="p-8 text-center text-red-500">Không tìm thấy sản phẩm</div>;

  const currentPrice = parseFloat(product.current_price > 0 ? product.current_price : product.start_price);
  const buyNowPrice = product.buy_now_price ? parseFloat(product.buy_now_price) : null;
  const stepPrice = parseFloat(product.step_price);

  // Xử lý Seller Info (Schema: relation users)
  // Backend thường map users_products_seller_idTousers -> seller
  const sellerName = product.users_products_seller_idTousers?.full_name || 'Không rõ';
  const sellerRating = product.users_products_seller_idTousers?.rating_score || 0;

  // Xử lý Winner/Bidder
  const currentBidderName = product.winner?.full_name ||
    product.bids?.[0]?.users?.full_name ||
    'Chưa có';

  // Check if auction is ended by time, even if status is not yet updated
  const isAuctionEnded = product.end_time && new Date(product.end_time) < new Date();
  const canBid = product?.status === 'ACTIVE' && !isAuctionEnded;

  // Determine effective winner ID: explicit winner field -> relation -> top bidder
  const effectiveWinnerId = product.winner_id || product.winner?.id || product.bids?.[0]?.bidder_id;
  const isWinner = user?.id && effectiveWinnerId === user.id;

  return (
    <div className="container mx-auto pb-12 fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-light mb-6 flex gap-2">
        <Link to="/" className="hover:text-primary">Trang chủ</Link> /
        <Link to="/products" className="hover:text-primary">Sản phẩm</Link> /
        <span className="text-text-main font-semibold">{product.name}</span>
      </nav>

      {/* --- TOP SECTION: IMAGES & INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        {/* Left: Gallery */}
        <div>
          <div 
            className="h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4 bg-white relative group"
            onMouseEnter={() => setIsSlideshowPaused(true)}
            onMouseLeave={() => setIsSlideshowPaused(false)}
          >
            {/* Main Image with fade transition */}
            <div className="relative w-full h-full">
              {product.product_images && product.product_images.length > 0 ? (
                <>
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300 ease-in-out"
                    style={{ opacity: imageOpacity }}
                  />
                  {/* Navigation Buttons */}
                  {product.product_images.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          const prevIndex = (currentImageIndex - 1 + product.product_images.length) % product.product_images.length;
                          changeImageWithFade(prevIndex);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => {
                          const nextIndex = (currentImageIndex + 1) % product.product_images.length;
                          changeImageWithFade(nextIndex);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {product.product_images.map((img, index) => (
                          <button
                            key={img.id}
                            onClick={() => {
                              changeImageWithFade(index);
                            }}
                            className={`h-2 rounded-full transition-all duration-200 ${
                              index === currentImageIndex 
                                ? 'bg-white w-8' 
                                : 'bg-white/50 w-2 hover:bg-white/75'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img
                  src={activeImage || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
          {/* Thumbnails - Schema: product_images relation */}
          {product.product_images && product.product_images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.product_images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => {
                    changeImageWithFade(index);
                  }}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img.url
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                  {img.is_primary && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-[8px] px-1 rounded-bl">CHÍNH</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-text-main">{product.name}</h1>
            {/* Schema: product_status enum */}
            {product.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                product.status === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                  product.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {{ 'ACTIVE': 'ĐANG DIỄN RA', 'SOLD': 'ĐÃ BÁN', 'EXPIRED': 'KẾT THÚC' }[product.status] || product.status}
              </span>
            )}
          </div>
          <p className="text-sm text-text-light">
            Đăng lúc: {product.created_at ? new Date(product.created_at).toLocaleDateString('vi-VN') : 'N/A'}
          </p>

          {/* Price Box - Schema: current_price, start_price, buy_now_price */}
          <div className="bg-neutral-light/30 py-2 rounded-xl mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-text-light font-medium">Giá hiện tại</span>
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(currentPrice)}
              </span>
            </div>
            {buyNowPrice && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-light">Giá mua ngay</span>
                <span className="font-semibold text-secondary">{formatCurrency(buyNowPrice)}</span>
              </div>
            )}
          </div>

          {/* Time & Seller Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Time Left - Schema: end_time */}
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs text-red-500 font-bold uppercase mb-1 flex items-center gap-1">
                <FaClock /> Thời gian còn lại
              </p>
              <p className="text-lg font-bold text-text-main">
                {product.end_time ? formatTimeLeft(product.end_time) : 'N/A'}
              </p>
            </div>

            {/* Seller - Schema: users_products_seller_idTousers relation */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-500 font-bold uppercase mb-1 flex items-center gap-1">
                <FaStore /> Người bán
              </p>
              <p className="font-medium">
                {sellerName}
                <span className="text-xs text-text-light ml-2">
                  (Đánh giá: {typeof sellerRating === 'number' ? sellerRating.toFixed(1) : parseFloat(sellerRating).toFixed(1)}%)
                </span>
              </p>
            </div>

            {/* Highest Bidder - Schema: winner relation or bids[0] */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 col-span-2">
              <p className="text-xs text-yellow-600 font-bold uppercase mb-1 flex items-center gap-1">
                <FaUser /> Người giữ giá cao nhất
              </p>
              <p className="font-medium">
                {currentBidderName}
                {product.winner?.rating_score && (
                  <span className="text-xs font-normal text-text-light ml-2">
                    (Điểm: {product.winner.rating_score.toFixed(1)})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* WebSocket Status */}
          {isConnected && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Đang cập nhật trực tiếp
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handlePlaceBid}
              disabled={!canBid || isSeller}
              className={`flex-1 font-bold py-3 px-6 rounded-xl shadow-lg transition transform active:scale-95 flex justify-center items-center gap-2 
                ${isSeller
                  ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                  : 'bg-primary-light text-white shadow-primary/30'} 
                disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
            >
              <FaGavel /> {isSeller ? 'BẠN LÀ NGƯỜI BÁN' : (isAuctionEnded ? 'ĐÃ KẾT THÚC' : 'ĐẤU GIÁ')}
            </button>
            {/* Winner Payment Button */}
            {isAuctionEnded && isWinner && (
              <button
                onClick={handleCheckout}
                className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-600/30 transition transform active:scale-95 flex justify-center items-center gap-2"
              >
                <FaGavel /> THANH TOÁN NGAY
              </button>
            )}
            {buyNowPrice && canBid && !isSeller && (
              <button
                onClick={() => setIsBuyNowModalOpen(true)}
                className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 transition transform active:scale-95 flex justify-center items-center gap-2"
              >
                MUA NGAY
              </button>
            )}
            <button
              onClick={handleToggleWatchlist}
              className={`p-3 border rounded-xl transition ${isInWatchlist
                ? 'border-red-300 bg-red-50 text-red-500'
                : 'border-gray-300 hover:bg-gray-50 text-gray-500'
                }`}
            >
              <FaHeart className={`text-xl ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-center text-text-light mt-3">
            * Bước giá tối thiểu: {stepPrice ? formatCurrency(stepPrice) : 'N/A'}
          </p>
        </div>
      </div>

      {/* --- MIDDLE SECTION: DESCRIPTION & HISTORY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        {/* Description (Left - 2/3) - Schema: description field + product_descriptions relation */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                Mô tả
              </h3>
              {/* Schema: view_count */}
              {product.view_count !== undefined && (
                <span className="text-sm text-text-light">
                  👁️ {product.view_count} lượt xem
                </span>
              )}
            </div>
            {/* Main description - Schema: products.description */}
            {product.description && (
              <div
                className="prose max-w-none text-text-light mb-4"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {/* Additional descriptions - Schema: product_descriptions relation */}
            {product.product_descriptions && product.product_descriptions.length > 0 && (
              <div className="space-y-4 mt-4 pt-4 border-t">
                <h4 className="font-semibold text-text-main">Thông tin bổ sung</h4>
                {product.product_descriptions.map((desc, index) => (
                  <div key={desc.id || index} className="text-text-light">
                    <p className="text-xs text-gray-400 mb-1">
                      Cập nhật {desc.created_at ? new Date(desc.created_at).toLocaleDateString('vi-VN') : ''}
                    </p>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: desc.content }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bid History (Right - 1/3) [cite: 87-89] */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <FaHistory className="text-primary" /> Lịch sử đấu giá
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-light uppercase bg-gray-50">
                  <tr>
                    <th className="px-3 py-2">Thời gian</th>
                    <th className="px-3 py-2">Người mua</th>
                    <th className="px-3 py-2 text-right">Giá</th>
                    {isSeller && <th className="px-3 py-2 text-center">Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {bidHistory.map((bid) => (
                    <tr key={bid.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-500">
                        {new Date(bid.time || bid.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        <br />
                        <span className="text-[10px]">{new Date(bid.time || bid.created_at).toLocaleDateString('vi-VN')}</span>
                      </td>
                      <td className="px-3 py-3 font-medium text-text-main">
                        {bid.bidder_name || bid.users?.full_name || 'Ẩn danh'}
                        {bid.is_auto_bid && <span className="ml-2 text-xs text-blue-600 font-semibold">(Tự động)</span>}
                        {bid.status === 'REJECTED' && <span className="ml-2 text-xs text-red-500 font-bold">(BỊ CẤM)</span>}
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-primary">
                        {formatCurrency(bid.amount)}
                        {bid.max_amount && bid.is_auto_bid && (
                          <span className="block text-xs text-gray-500">Max: {formatCurrency(bid.max_amount)}</span>
                        )}
                      </td>
                      {isSeller && (
                        <td className="px-3 py-3 text-center">
                          {bid.bidder_id && bid.status !== 'REJECTED' && (
                            <button
                              onClick={() => openBanModal(bid)}
                              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                            >
                              Cấm
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {bidHistory.length === 0 && (
                <p className="text-center text-gray-400 py-4">Chưa có lượt đấu giá nào.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- Q&A Section (Moved to Bottom Full Width) --- */}
      <div className="mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Hỏi & Đáp</h3>

          <div className="space-y-6">
            {product.product_questions && product.product_questions.length > 0 ? (
              product.product_questions.map((q) => (
                <div key={q.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="bg-gray-50 p-3 rounded-lg w-full">
                      <p className="font-semibold text-sm text-gray-700 mb-1">
                      <span className="font-bold text-text-main">{q.users?.full_name || 'Người mua'}: </span> 
                      {q.question}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(q.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {q.answer ? (
                    <div className="bg-blue-50 p-3 rounded-lg ml-8 mt-2 border-l-4 border-blue-400">
                      <p className="font-semibold text-sm text-gray-700 mb-1">
                          {q.answer}
                      </p>
                      <p className="text-xs text-gray-400">
                        Trả lời vào {new Date(q.answered_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ) : (
                    isSeller && (
                      <div className="ml-8 mt-2">
                        {activeQuestionId === q.id ? (
                          <form onSubmit={(e) => handleAnswerQuestion(e, q.id)}>
                            <textarea
                              className="w-full border rounded p-2 text-sm"
                              placeholder="Nhập câu trả lời..."
                              value={answerContent}
                              onChange={(e) => setAnswerContent(e.target.value)}
                              rows="2"
                            ></textarea>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => { setActiveQuestionId(null); setAnswerContent(''); }}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >Hủy</button>
                              <button
                                type="submit"
                                className="text-xs bg-primary text-white px-3 py-1 rounded"
                              >Trả lời</button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setActiveQuestionId(q.id)}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            Trả lời câu hỏi này
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">Chưa có câu hỏi nào.</p>
            )}
          </div>

          {/* Ask Question Form */}
          {!isSeller && isAuthenticated && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold text-sm mb-2">Đặt câu hỏi</h4>
              <form onSubmit={handleCreateQuestion}>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm focus:ring-primary focus:border-primary"
                  placeholder="Hỏi người bán về sản phẩm này..."
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  rows="3"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-primary-light text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-primary transition"
                >
                  Gửi câu hỏi
                </button>
              </form>
            </div>
          )}
        </div>
      </div >

      {/* Ban Modal */}
      {
        isBanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-lg font-bold text-red-600 mb-4">Từ chối người mua?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc chắn muốn từ chối <strong>{bidderToBan?.bidder_name}</strong>?
                Họ sẽ không thể đấu giá sản phẩm này nữa, và các lượt đấu giá của họ sẽ bị hủy.
              </p>
              <label className="block text-sm font-medium mb-1">Lý do (bắt buộc)</label>
              <input
                type="text"
                className="w-full border rounded p-2 mb-4"
                placeholder="Ví dụ: Không thanh toán..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setIsBanModalOpen(false); setBidderToBan(null); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBanBidder}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* --- BOTTOM SECTION: RELATED PRODUCTS [cite: 62] --- */}
      {
        relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-text-main">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )
      }

      {/* Bid Modal */}
      <BidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        product={product}
        onBidSuccess={fetchProductData}
      />

      {/* Buy Now Confirmation Modal */}
      <ConfirmModal
        isOpen={isBuyNowModalOpen}
        onCancel={() => setIsBuyNowModalOpen(false)}
        onConfirm={handleBuyNow}
        title="Xác nhận mua ngay"
        message={`Bạn có chắc chắn muốn mua sản phẩm "${product?.name}" với giá ${formatCurrency(buyNowPrice)} không?`}
        confirmText={buyingNow ? 'Đang xử lý...' : 'Xác nhận mua'}
        cancelText="Hủy"
        type="warning"
      />
    </div >
  );
};

export default ProductDetail;