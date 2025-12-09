import { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { mockProducts } from '../../utils/mockData';
import { FaFire, FaClock, FaDollarSign, FaArrowRight } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

const HomePage = () => {
  const [topEnding, setTopEnding] = useState([]);
  const [topBids, setTopBids] = useState([]);
  const [topPrice, setTopPrice] = useState([]);

  useEffect(() => {
    // Mock APIs for each section
    setTopEnding(mockProducts.slice(0, 5));
    setTopBids(mockProducts.slice(0, 5).reverse());
    setTopPrice(mockProducts.slice(0, 5).sort((a, b) => b.price - a.price));
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
            View all
            <FaArrowRight/>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto">

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-8 mb-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-1">Discover Rare Deals - Bid Smart</h1>
          <p className="text-lg opacity-90 mb-4">
            Join exciting auctions today and win valuable items at unbelievable prices.
          </p>
          <a
            href="/products"
            className="bg-white text-primary-dark px-6 py-3 rounded-full font-bold shadow-md inline-flex items-center gap-2 transition transform hover:-translate-y-1 hover:bg-gray-100"
            >
            Explore Now
            <FaArrowUpRightFromSquare />
          </a>
        </div>

        <div className="absolute -right-20 -bottom-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Section 1 */}
      <ProductSection 
        title="Ending Soon"
        icon={<FaClock className="text-red-500" />}
        products={topEnding}
      />

      {/* Section 2 */}
      <ProductSection 
        title="Most Popular (Top Bids)"
        icon={<FaFire className="text-orange-500" />}
        products={topBids}
        bgColor="bg-primary-light/15"
      />

      {/* Section 3 */}
      <ProductSection 
        title="Highest Price"
        icon={<FaDollarSign className="text-green-500" />}
        products={topPrice}
      />
    </div>
  );
};

export default HomePage;
