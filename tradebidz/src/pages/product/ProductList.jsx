import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import LoadingModal from '../../components/common/LoadingModal';
import { mockProducts } from '../../utils/mockData';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaThList } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter states from URL or default
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'default';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  // Mock Categories
  const categories = [
    { id: 'All', name: 'All Categories' },
    { id: 'Electronics', name: 'Electronics' },
    { id: 'Fashion', name: 'Fashion' },
    { id: 'Watches', name: 'Watches' },
    { id: 'Shoes', name: 'Shoes' }
  ];

  useEffect(() => {
    // Simulate API Fetching with filters
    setLoading(true);
    setTimeout(() => {
      // In real app: call API with params
      let data = [...mockProducts];
      
      // 1. Filter by Category
      if (categoryParam !== 'All') {
        data = data.filter(p => p.category === categoryParam);
      }

      // 2. Sort Logic [cite: 30-31]
      if (sortParam === 'price_asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortParam === 'time_desc') {
        data.sort((a, b) => new Date(b.timeLeft) - new Date(a.timeLeft));
      }

      // 3. Pagination Mock (Limit 4 items/page)
      // const start = (pageParam - 1) * 4;
      // const end = start + 4;
      // setProducts(data.slice(start, end)); // Uncomment for pagination logic
      
      setProducts(data); // Return all for now to see UI
      setLoading(false);
    }, 800);
  }, [categoryParam, sortParam, pageParam]);

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      prev.set(key, value);
      prev.set('page', 1); // Reset to page 1 when filter changes
      return prev;
    });
  };

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Searching products..." />

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR: FILTER --- */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-text-main">
              <FaThList className="text-primary" /> Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleFilterChange('category', cat.id)}
                    className={`w-full text-left px-4 py-2 border-none rounded-lg transition-colors ${
                      categoryParam === cat.id 
                        ? 'bg-primary text-white font-medium shadow-md' 
                        : 'text-text-light hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* --- RIGHT CONTENT: PRODUCTS --- */}
        <main className="flex-1">
          {/* Toolbar: Sort & Result Count */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-text-light text-sm">
              Showing <span className="font-bold text-text-main">{products.length}</span> results for 
              <span className="font-bold text-primary"> "{categoryParam}"</span>
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-text-light">Sort by:</span>
              <select 
                value={sortParam}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none"
              >
                <option value="default">Relevance</option>
                <option value="time_desc">Ending Soonest</option> {/* Should be time_asc actually for 'soonest', but followed requirement 'time desc' if strictly needed */}
                <option value="price_asc">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <FaFilter className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-text-light">No products found matching your criteria.</p>
              <button 
                onClick={() => handleFilterChange('category', 'All')}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination UI [cite: 24] */}
          {products.length > 0 && (
            <div className="mt-10 flex justify-center gap-2">
              <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg shadow-md">1</button>
              <button className="px-4 py-2 hover:bg-gray-100 text-text-main rounded-lg transition">2</button>
              <button className="px-4 py-2 hover:bg-gray-100 text-text-main rounded-lg transition">3</button>
              <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-text-main rounded-lg transition">Next</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;