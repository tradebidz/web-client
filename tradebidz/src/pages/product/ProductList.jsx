import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import LoadingModal from '../../components/common/LoadingModal';
import { FaFilter, FaThList, FaTimesCircle, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setPagination } from '../../redux/slices/productSlice';
import { setCategories } from '../../redux/slices/categorySlice';
import { toast } from 'react-toastify';

const ProductList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const pagination = useSelector((state) => state.products.pagination);

  // Parse Params
  const categoryParam = searchParams.get('category_id') || 'All';
  const sortParam = searchParams.get('sort') || 'default';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  // Category Expand State
  const [expandedCats, setExpandedCats] = useState({});

  // Auto-expand parent category when subcategory selected
  useEffect(() => {
    if (categoryParam !== 'All' && categories.length > 0) {
      const selectedId = parseInt(categoryParam);
      const newExpanded = { ...expandedCats };
      let changed = false;

      categories.forEach(cat => {
        // Check if this cat has the selected subcat
        if (cat.other_categories?.some(sub => sub.id === selectedId)) {
          if (!newExpanded[cat.id]) {
            newExpanded[cat.id] = true;
            changed = true;
          }
        }
        // Expand if it is the selected cat (to show its children if any)
        if (cat.id === selectedId && cat.other_categories?.length > 0) {
          if (!newExpanded[cat.id]) {
            newExpanded[cat.id] = true;
            changed = true;
          }
        }
      });

      if (changed) setExpandedCats(newExpanded);
    }
  }, [categoryParam, categories]);

  const toggleCat = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Init Categories
  useEffect(() => {
    const fetchCategories = async () => {
      // Chỉ fetch nếu chưa có trong Redux store (optional optimization)
      if (categories.length === 0) {
        try {
          const cats = await getCategories();
          dispatch(setCategories(cats));
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
    };
    fetchCategories();
  }, [dispatch, categories.length]);

  // Auto-scroll to top when page or filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryParam, sortParam, searchParam, pageParam]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters = {
          page: pageParam,
          limit: 12, // Số lượng đẹp cho grid 3 hoặc 4 cột
        };

        if (categoryParam !== 'All') {
          filters.category_id = parseInt(categoryParam);
        }
        if (searchParam) {
          filters.search = searchParam;
        }

        // Mapping sort param
        if (sortParam !== 'default') {
          filters.sort = sortParam;
        }

        const response = await getProducts(filters);

        // Handle response structure
        const productsData = Array.isArray(response) ? response : (response.data || response.products || []);
        const paginationData = response.pagination || {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.last_page
        };

        dispatch(setProducts(productsData));
        dispatch(setPagination(paginationData));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        dispatch(setProducts([]));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, sortParam, searchParam, pageParam, dispatch]);

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      if (value === 'All' || value === '') {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      // Only reset to page 1 when changing filters OTHER than page itself
      if (key !== 'page') {
        prev.set('page', 1);
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Helper function to generate page numbers with ellipsis
  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Logic hiển thị dòng Text "Showing results..."
  const resultText = useMemo(() => {
    let catName = 'Tất cả danh mục';

    if (categoryParam !== 'All') {
      for (const cat of categories) {
        if (cat.id.toString() === categoryParam.toString()) {
          catName = cat.name;
          break;
        }
        // Tìm trong mảng con
        const subCat = cat.other_categories?.find(c => c.id.toString() === categoryParam.toString());
        if (subCat) {
          catName = subCat.name;
          break;
        }
      }
    }

    const totalResults = pagination.total || 0;
    return (
      <span className="text-text-light text-sm">
        Tìm thấy <span className="font-bold text-text-main">{totalResults}</span> sản phẩm
        {searchParam && <> cho từ khóa <span className="font-bold text-primary">"{searchParam}"</span></>}
        {categoryParam !== 'All' && <> trong <span className="font-bold text-primary">"{catName}"</span></>}
      </span>
    );
  }, [pagination.total, searchParam, categoryParam, categories]);


  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} text="Đang tìm sản phẩm..." />

      <div className="flex flex-col md:flex-row gap-8">

        {/* --- LEFT SIDEBAR: FILTER --- */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-text-main">
                <FaThList className="text-primary" /> Danh mục
              </h3>
            </div>

            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleFilterChange('category_id', 'All')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${categoryParam === 'All'
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Tất cả danh mục
                </button>
              </li>
              {categories.map((cat) => {
                const isActive = categoryParam.toString() === cat.id.toString();
                const hasChildren = cat.other_categories?.length > 0;
                const isExpanded = expandedCats[cat.id];

                return (
                  <li key={cat.id} className="group">
                    <div className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${isActive ? 'bg-primary text-white shadow-md shadow-primary/30 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                      }`}>
                      <button
                        onClick={() => handleFilterChange('category_id', cat.id)}
                        className="flex-1 text-left truncate"
                      >
                        {cat.name}
                      </button>
                      {hasChildren && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCat(cat.id); }}
                          className={`p-1 rounded-full hover:bg-black/10 ${isActive ? 'text-white' : 'text-gray-400'}`}
                        >
                          {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </button>
                      )}
                    </div>

                    {/* Sub Categories */}
                    {hasChildren && isExpanded && (
                      <ul className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                        {cat.other_categories.map(sub => {
                          const isSubActive = categoryParam.toString() === sub.id.toString();
                          return (
                            <li key={sub.id}>
                              <button
                                onClick={() => handleFilterChange('category_id', sub.id)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-all text-sm truncate ${isSubActive
                                  ? 'text-primary font-bold bg-primary/5'
                                  : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                                  }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* --- RIGHT CONTENT: PRODUCTS --- */}
        <main className="flex-1">
          {/* Toolbar: Sort & Result Count */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* Result Text Logic Updated */}
            <div>{resultText}</div>

            <div className="flex items-center gap-4"> {/* Tăng gap để thoáng hơn */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 font-medium whitespace-nowrap">Sắp xếp theo:</label>
                <select
                  value={sortParam}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none cursor-pointer hover:bg-white transition"
                >
                  <option value="default">Liên quan nhất</option>
                  <option value="time_desc">Kết thúc sớm nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                </select>
              </div>
              {(categoryParam !== 'All' || searchParam || sortParam !== 'default') && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors  pr-4"
                >
                  <FaTimesCircle /> Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <FaFilter className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 mt-2 text-sm">Rất tiếc, không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
              <button
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-lg shadow-primary/30"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary text-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Trước
              </button>

              {/* Advanced Pagination with Ellipsis */}
              {generatePageNumbers(pagination.page, pagination.totalPages).map((pageNum, idx) => {
                // Render ellipsis as disabled button
                if (pageNum === '...') {
                  return (
                    <button
                      key={`ellipsis-${idx}`}
                      disabled
                      className="w-10 h-10 rounded-lg text-gray-400 cursor-default"
                    >
                      ...
                    </button>
                  );
                }

                // Render page number button
                return (
                  <button
                    key={pageNum}
                    onClick={() => handleFilterChange('page', pageNum)}
                    className={`w-10 h-10 rounded-lg transition text-sm font-medium ${pagination.page === pageNum
                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary text-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Sau
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;