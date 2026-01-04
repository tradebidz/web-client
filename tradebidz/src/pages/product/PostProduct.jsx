import { useState, useEffect, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { FaCloudUploadAlt, FaGavel, FaImage, FaTimes } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { uploadImage } from '../../services/mediaService';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useSelector } from 'react-redux';

const PostProduct = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      toast.warning("Vui lòng chọn ít nhất 3 ảnh.");
      return;
    }

    // Limit to 10 images
    const limitedFiles = files.slice(0, 10);
    setImageFiles(limitedFiles);
    const imageUrls = limitedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  // Remove image
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newUrls = uploadedImageUrls.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setPreviewImages(newPreviews);
    setUploadedImageUrls(newUrls);
  };

  // Upload images to media service
  const uploadImages = async () => {
    if (imageFiles.length < 3) {
      throw new Error("Yêu cầu tối thiểu 3 ảnh");
    }

    setUploadingImages(true);
    const urls = [];

    try {
      for (const file of imageFiles) {
        const response = await uploadImage(file);
        const url = response.url || response.data?.url || response;
        urls.push(url);
      }
      setUploadedImageUrls(urls);
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đăng bán sản phẩm");
      return;
    }

    if (imageFiles.length < 3) {
      toast.error("Yêu cầu tối thiểu 3 ảnh");
      return;
    }

    setLoading(true);
    try {
      // Upload images first
      const imageUrls = await uploadImages();

      // Prepare product data - Schema: snake_case fields
      const productData = {
        name: data.name,
        category_id: parseInt(data.categoryId),
        start_price: parseFloat(data.startPrice),
        step_price: parseFloat(data.stepPrice),
        buy_now_price: data.buyNowPrice ? parseFloat(data.buyNowPrice) : null,
        description: data.description,
        images: imageUrls,
        is_auto_extend: data.is_auto_extend || false,
        end_time: new Date(data.endTime).toISOString(),
      };

      // Create product
      await createProduct(productData);

      toast.success("Đăng bán sản phẩm thành công!");
      navigate('/my-products');
    } catch (error) {
      console.error('Error posting product:', error);
      const message = error.response?.data?.message || 'Đăng bán sản phẩm thất bại';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto ">
      <LoadingModal isOpen={loading || uploadingImages} text={uploadingImages ? "Đang tải ảnh lên..." : "Đang đăng sản phẩm..."} />

      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <IoMdAdd className="text-3xl text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-main">Đăng bán sản phẩm mới</h1>
          <p className="text-text-light">Tạo bài đăng và bắt đầu bán hàng ngay hôm nay.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Thông tin cơ bản</h3>

            <div className="mb-4">
              <label className="label-text">Tên sản phẩm</label>
              <input
                {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
                className="input-field"
                placeholder="Ví dụ: iPhone 15 Pro Max..."
              />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Danh mục</label>
                <select {...register("categoryId", { required: "Vui lòng chọn danh mục" })} className="input-field">
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <Fragment key={cat.id}>
                      <option value={cat.id} className="font-bold bg-gray-50">{cat.name}</option>
                      {cat.other_categories?.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          &nbsp;&nbsp;&nbsp;— {sub.name}
                        </option>
                      ))}
                    </Fragment>
                  ))}
                </select>
                {errors.categoryId && <p className="error-text">{errors.categoryId.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Time */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Giá & Thời hạn</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label-text">Giá khởi điểm</label>
                <input type="number" {...register("startPrice", { required: true })} className="input-field" />
              </div>
              <div>
                <label className="label-text">Bước giá</label>
                <input type="number" {...register("stepPrice", {
                  required: true,
                })} className="input-field" />
                {errors.stepPrice && <p className="error-text">{errors.stepPrice.message}</p>}
              </div>
              <div>
                <label className="label-text">Giá mua ngay (Tùy chọn)</label>
                <input type="number" {...register("buyNowPrice", {
                  validate: (value) => {
                    if (!value) return true;
                    const startPrice = parseFloat(watch('startPrice'));
                    if (parseFloat(value) <= startPrice) {
                      return "Giá mua ngay phải lớn hơn giá khởi điểm";
                    }
                    return true;
                  }
                })} className="input-field" />
                {errors.buyNowPrice && <p className="error-text">{errors.buyNowPrice.message}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="label-text">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                {...register("endTime", {
                  required: "Vui lòng chọn thời gian kết thúc",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const now = new Date();
                    if (selectedDate <= now) {
                      return "Thời gian kết thúc phải lớn hơn thời gian hiện tại";
                    }
                    return true;
                  }
                })}
                className="input-field"
              />
              {errors.endTime && <p className="error-text">{errors.endTime.message}</p>}
            </div>

            {/* Schema: is_auto_extend field */}
            <div className="flex items-center gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
              <input type="checkbox" {...register("is_auto_extend")} id="is_auto_extend" className="w-5 h-5 text-primary rounded" />
              <label htmlFor="is_auto_extend" className="text-sm font-medium text-text-main cursor-pointer">
                Tự động gia hạn? <br />
                <span className="text-xs text-text-light font-normal">Nếu có lượt đấu giá trong 5 phút cuối, thời gian sẽ được cộng thêm 10 phút.</span>
              </label>
            </div>
          </div>

          {/* Description (WYSIWYG) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Mô tả sản phẩm</h3>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Vui lòng nhập mô tả" }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-60 mb-12" // mb-12 để chừa chỗ cho toolbar
                />
              )}
            />
            {errors.description && <p className="error-text mt-2">{errors.description.message}</p>}
          </div>
        </div>

        {/* Right Column: Images */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold mb-4">Hình ảnh sản phẩm</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition mb-4 relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Nhấn để tải lên (Tối thiểu 3 ảnh)</p>
            </div>

            {previewImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                    {uploadingImages && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs">Đang tải lên...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg text-gray-400">
                <FaImage className="text-3xl mb-2" />
                <span className="text-xs">Chưa chọn ảnh nào (Tối thiểu 3)</span>
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                Đăng bán ngay
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostProduct;