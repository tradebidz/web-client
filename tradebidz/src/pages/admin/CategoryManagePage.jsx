import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockCategories, mockProducts } from '../../utils/mockData';
import ConfirmModal from '../../components/common/ConfirmModal';

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Initialize categories from mockData and calculate product counts
    const categoriesWithCounts = mockCategories.map(cat => {
      const productCount = mockProducts.filter(p => 
        p.categoryId === cat.id || p.category?.id === cat.id
      ).length;
      return {
        ...cat,
        productCount
      };
    });
    setCategories(categoriesWithCounts);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null = add mode
  const [formData, setFormData] = useState({ name: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, categoryId: null, productCount: 0 });

  // Handle Delete [cite: 155]
  const handleDelete = (id, count) => {
    if (count > 0) {
      toast.error("Cannot delete category containing products!");
      return;
    }
    setConfirmModal({ isOpen: true, categoryId: id, productCount: count });
  };

  const confirmDelete = () => {
    if (confirmModal.productCount > 0) {
      toast.error("Cannot delete category containing products!");
      setConfirmModal({ isOpen: false, categoryId: null, productCount: 0 });
      return;
    }
    setCategories(categories.filter(c => c.id !== confirmModal.categoryId));
    toast.success("Category deleted.");
    setConfirmModal({ isOpen: false, categoryId: null, productCount: 0 });
  };

  // Handle Submit (Add/Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCat) {
      // Edit - update category with schema fields
      setCategories(categories.map(c => 
        c.id === editingCat.id 
          ? { 
              ...c, 
              name: formData.name,
              updatedAt: new Date().toISOString()
            } 
          : c
      ));
      toast.success("Category updated.");
    } else {
      // Add - create new category with schema fields
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      const now = new Date().toISOString();
      setCategories([...categories, { 
        id: newId, 
        name: formData.name, 
        parentId: null,
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        children: []
      }]);
      toast.success("Category added.");
    }
    closeModal();
  };

  const openModal = (cat = null) => {
    setEditingCat(cat);
    setFormData({ name: cat ? cat.name : '' });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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
                  {cat.parentId && (
                    <span className="text-xs text-gray-400 ml-2">(Subcategory)</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${cat.productCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.productCount} products
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                  <button 
                    onClick={() => handleDelete(cat.id, cat.productCount)} 
                    className={`p-2 rounded ${cat.productCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                    title={cat.productCount > 0 ? "Cannot delete category with products" : "Delete"}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
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