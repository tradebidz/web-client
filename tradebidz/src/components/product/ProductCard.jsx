import { Link } from 'react-router-dom';
import { FaGavel, FaClock, FaUser } from 'react-icons/fa';
import { formatCurrency, formatTimeLeft } from '../../utils/format';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-bg rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:border-primary border border-gray-100 group">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Badge NEW */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            NEW
          </span>
        )}

        {/* Category Tag */}
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-text-main truncate mb-2 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price & Bids */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xl font-semibold text-primary">{formatCurrency(product.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-light flex items-center justify-end gap-1">
              <FaGavel className="text-secondary" /> {product.bids} bids
            </p>
          </div>
        </div>

        {/* Highest Bidder & Time Left */}
        <div className="border-t border-gray-100 pt-1 flex flex-col gap-1 items-center text-sm text-text-light">
          <div className="flex items-center gap-1" title="Highest Bidder">
            <FaUser className="text-text-light" />
            <span className="font-medium">{product.bidderName}</span>
          </div>
          
          <div className="flex items-center gap-1 text-orange-500 font-medium">
            <FaClock />
            <span>{formatTimeLeft(product.timeLeft)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
