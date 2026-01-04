import { useState, useEffect, Fragment } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCategories } from '../../services/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingModal from '../../components/common/LoadingModal';

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', parent_id: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, categoryId: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Expand/Collapse state
  const [expandedCats, setExpandedCats] = useState({});

  const toggleExpand = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(confirmModal.categoryId);
      toast.success("Đã xóa danh mục");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa danh mục");
    } finally {
      setConfirmModal({ isOpen: false, categoryId: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
      };

      if (editingCat) {
        await updateCategory(editingCat.id, payload);
        toast.success("Đã cập nhật danh mục");
      } else {
        await createCategory(payload);
        toast.success("Đã thêm danh mục");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu danh mục");
    }
  };

  const openModal = (cat = null) => {
    setEditingCat(cat);
    setFormData({
      name: cat ? cat.name : '',
      parent_id: cat ? (cat.parent_id || '') : ''
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <LoadingModal isOpen={loading} text="Đang tải danh mục..." />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-dark">Quản lý danh mục</h2>
        <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark">
          <FaPlus /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-xs uppercase">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4">Tên danh mục</th>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Loại</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((parent) => {
              const isExpanded = expandedCats[parent.id];
              const hasChildren = parent.other_categories?.length > 0;

              return (
                <Fragment key={parent.id}>
                  <tr className="bg-gray-50/30 hover:bg-gray-100/50 transition-colors">
                    <td className="p-4 font-mono text-gray-500">#{parent.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {hasChildren && (
                          <button
                            onClick={() => toggleExpand(parent.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400"
                          >
                            {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                          </button>
                        )}
                        <span className="font-bold text-primary">{parent.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
                        {parent._count?.products || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Chính</span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => openModal(parent)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                      <button onClick={() => setConfirmModal({ isOpen: true, categoryId: parent.id })} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                    </td>
                  </tr>
                  {isExpanded && parent.other_categories.map(child => (
                    <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono text-gray-500 pl-8 text-xs">#{child.id}</td>
                      <td className="p-4 pl-12 text-sm">
                        <span className="text-gray-400 mr-2">└─</span>
                        {child.name}
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                          {child._count?.products || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Con</span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => openModal(child)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                        <button onClick={() => setConfirmModal({ isOpen: true, categoryId: child.id })} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">Không tìm thấy danh mục</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{editingCat ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
              <button onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Danh mục cha (không bắt buộc)</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Không có (Danh mục chính)</option>
                  {categories
                    .filter(c => c.id !== editingCat?.id) // Prevent self-referencing
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Chỉ hỗ trợ tối đa 2 cấp danh mục</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        confirmText="Xác nhận xóa"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, categoryId: null })}
      />
    </div>
  );
};

export default CategoryManagePage;