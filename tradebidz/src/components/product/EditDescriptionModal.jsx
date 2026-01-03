import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { appendDescription } from '../../services/productService';

const EditDescriptionModal = ({ isOpen, onClose, product, onSuccess }) => {
    const [newDescription, setNewDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newDescription.trim() || newDescription === '<p><br></p>') {
            toast.error('Vui lòng nhập nội dung mô tả');
            return;
        }

        setSubmitting(true);
        try {
            await appendDescription(product.id, newDescription);
            toast.success('Cập nhật mô tả thành công!');
            setNewDescription('');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Cập nhật mô tả thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    // ReactQuill configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link'
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-text-main">Bổ sung mô tả sản phẩm</h2>
                        <p className="text-sm text-gray-500 mt-1">Thêm thông tin chi tiết cho: {product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Existing Description */}
                        {product.description && (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Mô tả hiện tại:</p>
                                <div
                                    className="prose max-w-none text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* Additional descriptions if any */}
                        {product.product_descriptions && product.product_descriptions.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase">Các mô tả bổ sung trước đó:</p>
                                {product.product_descriptions.map((desc, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-xs text-gray-400 mb-1">
                                            Cập nhật: {new Date(desc.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                        <div
                                            className="prose max-w-none text-sm text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: desc.content }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Description Input with ReactQuill */}
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-2">
                                Nội dung bổ sung mới *
                            </label>
                            <div className="bg-white rounded-xl border border-gray-300">
                                <ReactQuill
                                    theme="snow"
                                    value={newDescription}
                                    onChange={setNewDescription}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Nhập mô tả bổ sung..."
                                    style={{ minHeight: '200px' }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">
                                💡 Sử dụng toolbar để định dạng văn bản (in đậm, in nghiêng, danh sách, màu sắc, v.v.)
                            </p>
                        </div>
                    </form>
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 bg-white rounded-xl transition border border-gray-200"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition disabled:opacity-50"
                    >
                        {submitting ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDescriptionModal;
