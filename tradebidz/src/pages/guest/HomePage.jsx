import { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import ProductSkeleton from '../../components/product/ProductSkeleton';
import { FaFire, FaClock, FaDollarSign, FaArrowRight } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { getTopEnding, getTopBidding, getTopPrice } from '../../services/productService';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [topEnding, setTopEnding] = useState([]);
  const [topBids, setTopBids] = useState([]);
  const [topPrice, setTopPrice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const [ending, bidding, price] = await Promise.all([
          getTopEnding(),
          getTopBidding(),
          getTopPrice(),
        ]);

        setTopEnding(Array.isArray(ending) ? ending.slice(0, 5) : []);
        setTopBids(Array.isArray(bidding) ? bidding.slice(0, 5) : []);
        setTopPrice(Array.isArray(price) ? price.slice(0, 5) : []);
      } catch (error) {
        console.error('Error fetching top products:', error);
        toast.error('Không thể tải danh sách sản phẩm nổi bật');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const ProductSection = ({ title, icon, products, bgColor = "bg-white" }) => (
    <section className={`py-8 ${bgColor} rounded-2xl mb-8 px-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          {icon} {title}
        </h2>
        <a
          href="/products"
          className="text-sm font-semibold px-2 py-1 flex items-center gap-1 rounded-full border border-primary text-primary bg-white hover:bg-primary hover:text-white transition"
        >
          Xem tất cả
          <FaArrowRight />
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Không có sản phẩm nào</div>
      )}
    </section>
  );

  return (
    <div className="container mx-auto">

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-8 mb-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-1">Săn Deal Hiếm - Đấu Giá Thông Minh</h1>
          <p className="text-lg opacity-90 mb-4">
            Tham gia ngay những phiên đấu giá gay cấn và sở hữu món đồ giá trị với mức giá không tưởng.
          </p>
          <a
            href="/products"
            className="bg-white text-primary-dark px-6 py-3 rounded-full font-bold shadow-md inline-flex items-center gap-2 transition transform hover:-translate-y-1 hover:bg-gray-100"
          >
            Khám phá ngay
            <FaArrowUpRightFromSquare />
          </a>
        </div>

        <div className="absolute -right-20 -bottom-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Section 1 */}
      <ProductSection
        title="Sắp kết thúc"
        icon={<FaClock className="text-red-500" />}
        products={topEnding}
      />

      {/* Section 2 */}
      <ProductSection
        title="Nổi bật nhất (Nhiều lượt đấu giá)"
        icon={<FaFire className="text-orange-500" />}
        products={topBids}
        bgColor="bg-primary-light/15"
      />

      {/* Section 3 */}
      <ProductSection
        title="Giá cao nhất"
        icon={<FaDollarSign className="text-green-500" />}
        products={topPrice}
      />
    </div>
  );
};

export default HomePage;
