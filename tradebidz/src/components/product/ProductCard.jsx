import { Link } from 'react-router-dom';
import { FaGavel, FaClock, FaEye, FaUser, FaHeart, FaRegHeart } from 'react-icons/fa';
import { formatCurrency, formatTimeLeft, maskName } from '../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchlist } from '../../services/userService';
import { addToWatchlist, removeFromWatchlist } from '../../redux/slices/watchlistSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const watchlist = useSelector(state => state.watchlist.watchlist) || [];
  // Check if product is in watchlist
  const isWatched = Array.isArray(watchlist) && watchlist.some(item =>
    item.id === product.id
  );

  const loremImage = `https://picsum.photos/id/${product.id}/200/300`;
  const displayImage = product.thumbnail || product.product_images?.[0]?.url || loremImage;

  const displayPrice = product.current_price > 0 ? product.current_price : product.start_price;
  const bidderName = product.current_bidder_name || product.winner?.full_name || product.bids?.[0]?.users?.full_name || 'Chưa có';
  const displayBidder = bidderName !== 'Chưa có' ? maskName(bidderName) : 'Chưa có';

  // Format Date
  const postDate = product.created_at ? new Date(product.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }) : '';

  // Check if product is newly posted (within N minutes, default 30 minutes)
  const NEW_PRODUCT_THRESHOLD_MINUTES = 30;
  const isNewProduct = product.created_at && (() => {
    const createdTime = new Date(product.created_at).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - createdTime) / (1000 * 60);
    return diffMinutes <= NEW_PRODUCT_THRESHOLD_MINUTES && product.status === 'ACTIVE';
  })();

  // Check if current user is the highest bidder
  const effectiveWinnerId = product.winner_id || product.winner?.id || product.bids?.[0]?.bidder_id;
  const isUserHighestBidder = isAuthenticated && user?.id && effectiveWinnerId === user.id;

  const handleToggleWatchlist = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để theo dõi');
      return;
    }

    try {
      await toggleWatchlist(product.id);
      if (isWatched) {
        dispatch(removeFromWatchlist(product.id));
        toast.success('Đã bỏ theo dõi');
      } else {
        dispatch(addToWatchlist(product));
        toast.success('Đã thêm vào danh sách theo dõi');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi cập nhật danh sách theo dõi');
    }
  };

  const statusText = { SOLD: 'ĐÃ BÁN', EXPIRED: 'KẾT THÚC' }[product.status] || product.status;

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden relative ${
      isUserHighestBidder 
        ? 'border-2 !bg-primary-light/40 border-blue-400 shadow-blue-200' 
        : isNewProduct
        ? 'border-2 border-green-400 !bg-green-500/20 shadow-green-200'
        : 'border border-gray-100'
    }`}>
      {/* --- Image Section --- */}
      <div className="relative h-40 sm:h-48 overflow-hidden shrink-0 bg-gray-50">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Badges - Top Left Stack */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.status && product.status !== 'ACTIVE' && (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm ${product.status === 'SOLD' ? 'bg-blue-600 text-white' :
              product.status === 'EXPIRED' ? 'bg-gray-600 text-white' :
                'bg-red-600 text-white'
              }`}>
              {statusText}
            </span>
          )}

          {isNewProduct && product.status === 'ACTIVE' && (
            <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500 text-white shadow-sm animate-pulse w-fit">
              MỚI
            </span>
          )}

          {isUserHighestBidder && product.status === 'ACTIVE' && (
            <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500 text-white shadow-sm w-fit">
              ĐANG GIỮ GIÁ
            </span>
          )}
        </div>

        {/* Watchlist Button - Top Right */}
        <button
          onClick={handleToggleWatchlist}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 rounded-full hover:bg-white hover:scale-110 text-red-500 shadow-md transition-all duration-200"
          title={isWatched ? "Bỏ theo dõi" : "Theo dõi"}
        >
          {isWatched ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Category Overlay */}
        <span className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 rounded-tl-lg backdrop-blur-sm">
          {product.categories?.name || product.category?.name || 'Khác'}
        </span>
      </div>

      {/* --- Content Section --- */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <Link to={`/product/${product.id}`} className="mb-2">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3 ">
          <div className="text-lg font-extrabold text-primary leading-none">
            {formatCurrency(displayPrice)}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            Mua ngay:
            {product.buy_now_price > 0 ? (
              <span className="font-medium text-gray-600 ml-1">{formatCurrency(product.buy_now_price)}</span>
            ) : (
              <span className="font-medium text-gray-600 ml-1">Chưa thiết lập</span>
            )
            }
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <FaGavel className="text-secondary" />
            <span>{product.bid_count || product.bids?.length || 0} lượt</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <FaEye className="text-blue-300" />
            <span>{product.view_count || 0} xem</span>
          </div>
          <div className={`flex items-center gap-1 col-span-2 ${isUserHighestBidder ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <FaUser className={isUserHighestBidder ? 'text-blue-500' : 'text-gray-300'} />
            <span className="truncate">Người giữ giá: <span className={isUserHighestBidder ? 'text-blue-700 font-bold' : 'text-gray-600'}>{displayBidder}</span></span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md max-w-full">
            <FaClock size={10} className="shrink-0" />
            <span className="truncate">{formatTimeLeft(product.end_time)}</span>
          </div>
          <div className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
            {postDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;