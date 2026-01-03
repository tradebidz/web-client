import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoadingModal from "../../components/common/LoadingModal";
import { FaUserEdit, FaLock, FaSave, FaTimes, FaStar, FaThumbsUp, FaThumbsDown, FaHeart, FaGavel, FaTrophy } from "react-icons/fa";
import { getCurrentUser, updateCurrentUser, updateProfile, getMyFeedbacks } from "../../services/userService";
import { updateUser } from "../../redux/slices/authSlice";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

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

  // Load Feedbacks when tab changes
  useEffect(() => {
    if (activeTab === 'feedbacks') {
      const fetchFeedbacks = async () => {
        try {
          const data = await getMyFeedbacks();
          setFeedbacks(data);
        } catch (error) {
          console.error("Failed to load feedbacks", error);
        }
      }
      fetchFeedbacks();
    }
  }, [activeTab]);

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

      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      const message = err.response?.data?.message || "Cập nhật hồ sơ thất bại.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        password: data.newPassword,
        old_password: data.oldPassword
      });

      resetPass();
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Change password failed:", error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // SHOW LOADING ONLY IF AUTH USER NULL
  if (!profile && !user) {
    return <LoadingModal isOpen={true} text="Đang tải hồ sơ..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <LoadingModal isOpen={loading} text="Đang xử lý..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaUserEdit className="text-primary" /> Cài đặt tài khoản
        </h1>
        <p className="text-text-light mt-2">
          Quản lý thông tin cá nhân và bảo mật.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow border overflow-hidden py-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${activeTab === "info"
                ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <FaUserEdit /> Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${activeTab === "password"
                ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <FaLock /> Đổi mật khẩu
            </button>

            <button
              onClick={() => setActiveTab("feedbacks")}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${activeTab === "feedbacks"
                ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <FaStar /> Đánh giá về tôi
            </button>

            <div className="border-t my-2"></div>
            <p className="px-6 py-2 text-xs font-bold text-gray-400 uppercase">Hoạt động</p>

            <Link to="/watchlist" className="block w-full text-left px-6 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition">
              <FaHeart /> Danh sách theo dõi
            </Link>
            <Link to="/bidding" className="block w-full text-left px-6 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition">
              <FaGavel /> Đang đấu giá
            </Link>
            <Link to="/won-products" className="block w-full text-left px-6 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition">
              <FaTrophy /> Sản phẩm đã thắng
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow border px-8 py-4">

          {/* Profile Summary */}
          {profile && (activeTab === "info" || activeTab === "feedbacks") && (
            <>
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Thông tin tài khoản</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                {[
                  ["Email", profile.email],
                  ["SĐT / Email", profile.email],
                  ["Vai trò", profile.role === 'BIDDER' ? 'Người mua' : profile.role === 'SELLER' ? 'Người bán' : profile.role],
                  ["Xác thực", profile.isVerified ? "Đã xác thực" : "Chưa xác thực"],
                  [
                    "Điểm tín nhiệm",
                    `${profile.ratingScore} điểm`,
                  ],
                  [
                    "Thành viên từ",
                    new Date(profile.createdAt).toLocaleDateString('vi-VN'),
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
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Thay đổi thông tin</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="md:col-span-2">
                  <label className="label-text">Họ và tên</label>
                  <input
                    {...registerInfo("fullName", {
                      required: "Vui lòng nhập họ và tên",
                    })}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                  />
                  {infoErrors.fullName && (
                    <p className="error-text">{infoErrors.fullName.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="label-text">Địa chỉ</label>
                  <input
                    {...registerInfo("address")}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
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
                    <FaUserEdit /> Chỉnh sửa
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
                      <FaTimes /> Hủy
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2"
                    >
                      <FaSave /> Lưu
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
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Đổi mật khẩu</h2>

              <div>
                <label className="label-text">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  {...registerPass("oldPassword", {
                    required: "Vui lòng nhập mật khẩu hiện tại",
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Mật khẩu mới</label>
                <input
                  type="password"
                  {...registerPass("newPassword", {
                    required: "Vui lòng nhập mật khẩu mới",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  {...registerPass("confirmPassword", {
                    validate: (val) =>
                      val === watch("newPassword") ||
                      "Mật khẩu không khớp",
                  })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <FaSave /> Cập nhật mật khẩu
                </button>
              </div>
            </form>
          )}

          {/* TAB: FEEDBACKS */}
          {activeTab === "feedbacks" && (
            <div className="fade-in">
              <h2 className="text-xl font-bold mb-4 text-primary-dark">Đánh giá từ người bán</h2>
              <div className="space-y-4">
                {feedbacks.length > 0 ? (
                  feedbacks.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-start">
                      <div>
                        <p className="font-bold flex items-center gap-2">
                          {item.score === 1 ? (
                            <span className="text-green-600 flex items-center gap-1"><FaThumbsUp /> Tích cực</span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1"><FaThumbsDown /> Tiêu cực</span>
                          )}
                          <span className="text-gray-400 font-normal">cho sản phẩm</span>
                          <span className="text-text-main">{item.products?.name || 'Sản phẩm'}</span>
                        </p>
                        <p className="text-gray-700 italic mt-2">"{item.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Bởi {item.users_feedbacks_from_user_idTousers?.full_name || 'Người bán'} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
