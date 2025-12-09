import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGavel, FaClock, FaUser, FaStore, FaHeart, FaHistory } from 'react-icons/fa';
import { productDetailMock, mockProducts } from '../../utils/mockData';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import ProductCard from '../../components/product/ProductCard';
import { toast } from 'react-toastify';
import LoadingModal from '../../components/common/LoadingModal';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulation: Fetch data
  useEffect(() => {
    // In real app: await apiClient.get(`/products/${id}`)
    setTimeout(() => {
      setProduct(productDetailMock);
      setActiveImage(productDetailMock.images[0]);
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePlaceBid = () => {
    // Logic: Check authentication & rating > 80% [cite: 83]
    toast.info("This feature requires login and a rating score > 80%.");
  };

  if (loading) return <LoadingModal isOpen={true} text="Loading..."/>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

  return (
    <div className="container mx-auto pb-12 fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-light mb-6 flex gap-2">
        <Link to="/" className="hover:text-primary">Home</Link> / 
        <Link to="/products" className="hover:text-primary">Products</Link> / 
        <span className="text-text-main font-semibold">{product.name}</span>
      </nav>

      {/* --- TOP SECTION: IMAGES & INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Left: Gallery */}
        <div>
          <div className="h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4 bg-white relative">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-3xl font-bold text-text-main mb-2">{product.name}</h1>
          <p className="text-sm text-text-light">Posted at: {new Date(product.createdAt).toLocaleDateString('en-US')}</p>

          {/* Price Box */}
          <div className="bg-neutral-light/30 py-2 rounded-xl mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-text-light font-medium">Current Price</span>
              <span className="text-3xl font-bold text-primary">{formatCurrency(product.currentPrice || product.price)}</span>
            </div>
            {product.buyNowPrice && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-light">Buy Now Price</span>
                <span className="font-semibold text-secondary">{formatCurrency(product.buyNowPrice)}</span>
              </div>
            )}
          </div>

          {/* Time & Seller Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             {/* Time Left [cite: 58-59] */}
             <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-red-500 font-bold uppercase mb-1 flex items-center gap-1">
                  <FaClock /> Time Left
                </p>
                <p className="text-lg font-bold text-text-main">
                  {formatTimeLeft(product.endTime)}
                </p>
             </div>
             
             {/* Seller [cite: 54] */}
             <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-500 font-bold uppercase mb-1 flex items-center gap-1">
                  <FaStore /> Seller
                </p>
                <p className="font-medium">{product.seller?.name || product.seller?.fullName || 'Unknown'} (Rate: {product.seller?.rating || product.seller?.ratingScore || 0}/10)</p>
             </div>

             {/* Highest Bidder [cite: 55] */}
             <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 col-span-2">
                <p className="text-xs text-yellow-600 font-bold uppercase mb-1 flex items-center gap-1">
                  <FaUser /> Highest Bidder
                </p>
                <p className="font-medium">
                  {product.currentBidder?.name || 'None'} 
                  <span className="text-xs font-normal text-text-light ml-2">
                    (Score: {product.currentBidder?.rating || 0} points)
                  </span>
                </p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handlePlaceBid}
              className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 transition transform active:scale-95 flex justify-center items-center gap-2"
            >
              <FaGavel /> PLACE BID
            </button>
            <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-500 transition">
              <FaHeart className="text-xl" />
            </button>
          </div>
          <p className="text-xs text-center text-text-light mt-3">
            * Min Step Price: {formatCurrency(product.stepPrice)}
          </p>
        </div>
      </div>

      {/* --- MIDDLE SECTION: DESCRIPTION & HISTORY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Description (Left - 2/3) [cite: 60] */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
              Description
            </h3>
            {/* Using dangerouslySetInnerHTML for HTML content from WYSIWYG */}
            <div 
              className="prose max-w-none text-text-light"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          </div>
        </div>

        {/* Bid History (Right - 1/3) [cite: 87-89] */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <FaHistory className="text-primary" /> Bid History
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-light uppercase bg-gray-50">
                  <tr>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Bidder</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {product.bidHistory.map((bid) => (
                    <tr key={bid.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-500">
                        {new Date(bid.time).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                        <br/>
                        <span className="text-[10px]">{new Date(bid.time).toLocaleDateString('en-US')}</span>
                      </td>
                      <td className="px-3 py-3 font-medium text-text-main">{bid.bidder}</td>
                      <td className="px-3 py-3 text-right font-bold text-primary">
                        {formatCurrency(bid.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {product.bidHistory.length === 0 && (
                <p className="text-center text-gray-400 py-4">No bids yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: RELATED PRODUCTS [cite: 62] --- */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-text-main">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mockProducts.slice(0, 5).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;