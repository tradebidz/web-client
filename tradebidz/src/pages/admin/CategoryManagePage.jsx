import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCategories } from '../../services/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import ConfirmModal from '../../components/common/ConfirmModal';

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      // The backend default `getCategories` usually returns clean category objects.
      // If we need product counts, we might need a separate API call or it might be included.
      // For now, if not included, we can default to 0 or remove that column if it's too expensive to calc client-side.
      // Based on typical Prisma setup, `include: { _count: { select: { products: true } } }` would be needed in backend.
      // Assuming simple list for now.
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null = add mode
  const [formData, setFormData] = useState({ name: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, categoryId: null, productCount: 0 });

  // Handle Delete
  const handleDelete = (id, count) => {
    // If we had count, we could check it here. Without it, we rely on backend error.
    setConfirmModal({ isOpen: true, categoryId: id, productCount: count || 0 });
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(confirmModal.categoryId);
      toast.success("Category deleted.");
      fetchCategories(); // Refresh
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete category";
      toast.error(msg);
    } finally {
      setConfirmModal({ isOpen: false, categoryId: null, productCount: 0 });
    }
  };

  // Handle Submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        // Edit
        await updateCategory(editingCat.id, { name: formData.name });
        toast.success("Category updated.");
      } else {
        // Add
        await createCategory({ name: formData.name });
        toast.success("Category added.");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save category";
      toast.error(msg);
    }
  };

  const openModal = (cat = null) => {
    setEditingCat(cat);
    setFormData({ name: cat ? cat.name : '' });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-dark">Category Management</h2>
        <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark">
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-xs uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Product Count</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="p-4 font-mono text-gray-500">#{cat.id}</td>
                <td className="p-4 font-bold">
                  {cat.name}
                  {cat.parent_id && (
                    <span className="text-xs text-gray-400 ml-2">(Subcategory)</span>
                  )}
                </td>
                <td className="p-4">
                  {/* If backend doesn't send count, show N/A or nothing */}
                  {cat.products_count !== undefined ? (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${cat.products_count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.products_count} products
                    </span>
                  ) : <span className="text-gray-400 text-xs text-center block">-</span>}
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.products_count)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-bg/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl fade-in">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{editingCat ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={closeModal}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-4 focus:ring-primary focus:border-primary outline-none"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, categoryId: null, productCount: 0 })}
      />
    </div>
  );
};

export default CategoryManagePage;