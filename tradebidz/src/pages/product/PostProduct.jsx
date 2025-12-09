import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { FaCloudUploadAlt, FaGavel, FaImage } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';

const PostProduct = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();

  // Mock Upload Image
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      toast.warning("Please select at least 3 images.");
    }
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  const onSubmit = (data) => {
    if (previewImages.length < 3) {
      toast.error("Minimum 3 images required [cite: 111]");
      return;
    }

    setLoading(true);
    console.log("Post Product Data:", data);

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      toast.success("Product posted successfully!");
      navigate('/seller/my-products'); // Redirect to My Products list
    }, 2000);
  };

  return (
    <div className="container mx-auto ">
      <LoadingModal isOpen={loading} text="Posting your product..." />
      
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <div className="bg-primary/10 p-3 rounded-full">
            <IoMdAdd className="text-3xl text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-text-main">Post New Auction</h1>
            <p className="text-text-light">Create a listing and start selling</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Basic Information</h3>
            
            <div className="mb-4">
              <label className="label-text">Product Name</label>
              <input 
                {...register("name", { required: "Product name is required" })}
                className="input-field" 
                placeholder="e.g., iPhone 15 Pro Max..."
              />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="label-text">Category</label>
                 <select {...register("categoryId")} className="input-field">
                   <option value="1">Electronics</option>
                   <option value="2">Fashion</option>
                   <option value="3">Watches</option>
                   <option value="4">Shoes</option>
                 </select>
               </div>
               <div>
                  <label className="label-text">Condition</label>
                  <select {...register("condition")} className="input-field">
                    <option value="new">Brand New</option>
                    <option value="used">Used - Like New</option>
                    <option value="old">Used - Good</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Pricing & Time */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Pricing & Duration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div>
                  <label className="label-text">Starting Price (VNĐ)</label>
                  <input type="number" {...register("startPrice", { required: true })} className="input-field" />
               </div>
               <div>
                  <label className="label-text">Step Price (VNĐ)</label>
                  <input type="number" {...register("stepPrice", { required: true })} className="input-field" />
               </div>
               <div>
                  <label className="label-text">Buy Now Price (Optional)</label>
                  <input type="number" {...register("buyNowPrice")} className="input-field" />
               </div>
            </div>

            <div className="flex items-center gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                <input type="checkbox" {...register("autoExtend")} id="autoExtend" className="w-5 h-5 text-primary rounded" />
                <label htmlFor="autoExtend" className="text-sm font-medium text-text-main cursor-pointer">
                    Enable Auto-Extension? <br/>
                    <span className="text-xs text-text-light font-normal">If a bid is placed in the last 5 minutes, extend by 10 minutes.</span>
                </label>
            </div>
          </div>

          {/* Description (WYSIWYG) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Description</h3>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
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
              <h3 className="text-lg font-bold mb-4">Product Images</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition mb-4 relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Click to upload (Min 3)</p>
              </div>

              {previewImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                    {previewImages.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg text-gray-400">
                    <FaImage className="text-3xl mb-2" />
                    <span className="text-xs">No images selected</span>
                </div>
              )}

              <div className="mt-8 border-t pt-6">
                <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                    Post Product
                </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};

export default PostProduct;