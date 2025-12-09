import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingModal from '../../components/common/LoadingModal';
import { FaUserEdit, FaLock, FaSave } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [loading, setLoading] = useState(false);

  // Form Profile
  const { register: registerInfo, handleSubmit: submitInfo, formState: { errors: infoErrors } } = useForm({
    defaultValues: {
      fullName: user?.name || "John Doe",
      email: user?.email || "john@example.com",
      address: "123 Main St, NY",
      dob: "1995-05-15"
    }
  });

  // Form Password
  const { register: registerPass, handleSubmit: submitPass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm();

  const onUpdateProfile = (data) => {
    setLoading(true);
    // Mock API
    setTimeout(() => {
      console.log("Update Profile:", data);
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  const onChangePassword = (data) => {
    setLoading(true);
    // Mock API
    setTimeout(() => {
      console.log("Change Password:", data);
      setLoading(false);
      resetPass();
      toast.success("Password changed successfully!");
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 ">
      <LoadingModal isOpen={loading} text="Updating..." />
      
      <h1 className="text-3xl font-bold text-text-main mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${
                activeTab === 'info' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : 'text-text-light hover:bg-gray-50'
              }`}
            >
              <FaUserEdit /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${
                activeTab === 'password' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : 'text-text-light hover:bg-gray-50'
              }`}
            >
              <FaLock /> Change Password
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'info' && (
            <form onSubmit={submitInfo(onUpdateProfile)} className="space-y-6 fade-in">
              <h2 className="text-xl font-bold text-text-main border-b pb-4 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text">Full Name</label>
                  <input 
                    {...registerInfo("fullName", { required: "Full name is required" })}
                    className="input-field" 
                  />
                  {infoErrors.fullName && <p className="error-text">{infoErrors.fullName.message}</p>}
                </div>

                <div>
                  <label className="label-text">Date of Birth</label>
                  <input type="date" {...registerInfo("dob")} className="input-field" />
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Email Address</label>
                  <input 
                    {...registerInfo("email", { required: "Email is required" })}
                    readOnly
                    className="input-field bg-gray-100 cursor-not-allowed text-gray-500" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Address</label>
                  <input {...registerInfo("address")} className="input-field" />
                </div>
              </div>

              <button type="submit" className="btn-primary flex items-center gap-2 mt-4">
                <FaSave /> Save Changes
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={submitPass(onChangePassword)} className="space-y-6 fade-in">
              <h2 className="text-xl font-bold text-text-main border-b pb-4 mb-4">Change Password</h2>

              <div>
                <label className="label-text">Current Password</label>
                <input 
                  type="password" 
                  {...registerPass("oldPassword", { required: "Current password is required" })}
                  className="input-field" 
                />
                {passErrors.oldPassword && <p className="error-text">{passErrors.oldPassword.message}</p>}
              </div>

              <div>
                <label className="label-text">New Password</label>
                <input 
                  type="password" 
                  {...registerPass("newPassword", { 
                    required: "New password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="input-field" 
                />
                {passErrors.newPassword && <p className="error-text">{passErrors.newPassword.message}</p>}
              </div>

              <div>
                <label className="label-text">Confirm New Password</label>
                <input 
                  type="password" 
                  {...registerPass("confirmPassword", { 
                    validate: (val) => val === watch('newPassword') || "Passwords do not match"
                  })}
                  className="input-field" 
                />
                {passErrors.confirmPassword && <p className="error-text">{passErrors.confirmPassword.message}</p>}
              </div>

              <button type="submit" className="btn-primary flex items-center gap-2 mt-4">
                <FaSave /> Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;