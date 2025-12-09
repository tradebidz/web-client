import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoadingModal from "../../components/common/LoadingModal";
import { FaUserEdit, FaLock, FaSave, FaTimes } from "react-icons/fa";
import { getCurrentUser, updateCurrentUser } from "../../services/userService";
import { updateUser } from "../../redux/slices/authSlice";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  // Form Profile
  const {
    register: registerInfo,
    handleSubmit: submitInfo,
    formState: { errors: infoErrors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      address: user?.address || "",
    },
  });

  // Form Password
  const {
    register: registerPass,
    handleSubmit: submitPass,
    reset: resetPass,
    watch,
    formState: { errors: passErrors },
  } = useForm();

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();

        const mapped = {
          id: response.id,
          email: response.email,
          fullName: response.full_name,
          address: response.address || "",
          role: response.role,
          ratingScore: response.rating_score,
          ratingCount: response.rating_count,
          isVerified: response.is_verified,
          createdAt: response.created_at,
        };

        setProfile(mapped);

        reset({
          fullName: mapped.fullName,
          email: mapped.email,
          address: mapped.address,
        });

        dispatch(updateUser(mapped));
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load profile.";
        toast.error(message);
      }
    };

    fetchProfile();
  }, [dispatch, reset]);

  // UPDATE PROFILE
  const onUpdateProfile = async (data) => {
    setLoading(true);

    try {
      const payload = {
        full_name: data.fullName,
        address: data.address,
      };

      const response = await updateCurrentUser(payload);

      const updated = {
        id: response.id,
        email: response.email,
        fullName: response.full_name,
        address: response.address || "",
        role: response.role,
        ratingScore: response.rating_score,
        ratingCount: response.rating_count,
        isVerified: response.is_verified,
        createdAt: response.created_at,
      };

      setProfile(updated);
      dispatch(updateUser(updated));

      setIsEditing(false);

      toast.success("Profile updated successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Update profile failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetPass();
      toast.success("Password changed successfully!");
    }, 800);
  };

  // SHOW LOADING ONLY IF AUTH USER NULL
  if (!profile && !user) {
    return <LoadingModal isOpen={true} text="Loading profile..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <LoadingModal isOpen={loading} text="Processing..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaUserEdit className="text-primary" /> Account Settings
        </h1>
        <p className="text-text-light mt-2">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 transition ${
                activeTab === "info"
                  ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaUserEdit /> Personal Info
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 transition ${
                activeTab === "password"
                  ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaLock /> Change Password
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow border px-8 py-4">

          {/* Profile Summary */}
          {profile && activeTab === "info" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Account Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                {[
                  ["Email Address", profile.email],
                  ["Role", profile.role],
                  ["Verified", profile.isVerified ? "Yes" : "No"],
                  [
                    "Rating",
                    `${profile.ratingScore} (${profile.ratingCount} ratings)`,
                  ],
                  [
                    "Member since",
                    new Date(profile.createdAt).toLocaleDateString(),
                  ],
                ].map(([title, value], idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-gray-50">
                    <p className="font-semibold">{title}</p>
                    <p className="text-text-light">{value}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <hr className="mb-6" />
            </>
          )}

          {/* TAB: INFO */}
          {activeTab === "info" && (
            <form
              onSubmit={submitInfo(onUpdateProfile)}
              className="fade-in"
            >
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="md:col-span-2">
                  <label className="label-text">Full Name</label>
                  <input
                    {...registerInfo("fullName", {
                      required: "Full name is required",
                    })}
                    disabled={!isEditing}
                    className={`input-field ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                  {infoErrors.fullName && (
                    <p className="error-text">{infoErrors.fullName.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="label-text">Address</label>
                  <input
                    {...registerInfo("address")}
                    disabled={!isEditing}
                    className={`input-field ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2"
                  >
                    <FaUserEdit /> Edit
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        reset(profile);
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2"
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB: PASSWORD */}
          {activeTab === "password" && (
            <form
              onSubmit={submitPass(onChangePassword)}
              className="space-y-4 fade-in"
            >
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Change Password</h2>

              <div>
                <label className="label-text">Current Password</label>
                <input
                  type="password"
                  {...registerPass("oldPassword", {
                    required: "Current password is required",
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">New Password</label>
                <input
                  type="password"
                  {...registerPass("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Confirm Password</label>
                <input
                  type="password"
                  {...registerPass("confirmPassword", {
                    validate: (val) =>
                      val === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <FaSave /> Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
