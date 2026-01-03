import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  requestResetPassword,
  verifyResetOtp,
  resetPassword as resetPasswordRequest,
  resendOtp,
} from "../../services/authService";

// Validation Schemas
const emailSchema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập Email"),
});

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("request"); // 'request', 'verify', 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmitRequest = async (data) => {
    setIsRequesting(true);
    try {
      await requestResetPassword(data.email);
      setEmail(data.email);
      setStep("verify");
      toast.success("Mã OTP đã được gửi đến email của bạn.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Gửi mã OTP thất bại. Vui lòng thử lại.";
      toast.error(message);

      // Extract cooldown from error message if available
      const cooldownMatch = message.match(/wait (\d+) seconds/);
      if (cooldownMatch) {
        const cooldownSeconds = parseInt(cooldownMatch[1]);
        setResendCooldown(cooldownSeconds);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập mã OTP 6 số hợp lệ");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyResetOtp(email, otp);
      setStep("reset");
      toast.success("Xác thực thành công. Vui lòng đặt lại mật khẩu.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Mã OTP không hợp lệ. Vui lòng thử lại.";
      toast.error(message);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmitReset = async (data) => {
    setIsResetting(true);
    try {
      await resetPasswordRequest(email, otp, data.password);
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      toast.error(`Vui lòng đợi ${resendCooldown} giây trước khi yêu cầu mã OTP mới`);
      return;
    }

    setIsResending(true);
    try {
      await requestResetPassword(email);
      toast.success("Mã OTP đã được gửi lại. Vui lòng kiểm tra email.");

      // Set cooldown timer (60 seconds)
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Gửi lại OTP thất bại. Vui lòng thử lại.";
      toast.error(message);

      // Extract cooldown from error message if available
      const cooldownMatch = message.match(/wait (\d+) seconds/);
      if (cooldownMatch) {
        const cooldownSeconds = parseInt(cooldownMatch[1]);
        setResendCooldown(cooldownSeconds);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Step 1: Request Reset Password
  if (step === "request") {
    return (
      <div>
        <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">
          Quên mật khẩu
        </h2>
        <p className="text-text-light text-center mb-6">
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
        </p>

        <form onSubmit={handleEmailSubmit(onSubmitRequest)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-main">Email</label>
            <input
              type="email"
              {...registerEmail("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-primary focus:border-primary"
            />
            <p className="text-red-500 text-xs mt-1">{emailErrors.email?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isRequesting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary 
                       focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRequesting ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-light">
          Đã nhớ mật khẩu?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    );
  }

  // Step 2: Verify OTP
  if (step === "verify") {
    return (
      <div>
        <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">
          Xác thực OTP
        </h2>
        <p className="text-text-light text-center mb-6">
          Chúng tôi đã gửi mã OTP 6 số đến <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Nhập mã OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-primary focus:border-primary text-center 
                         text-2xl tracking-widest font-mono"
            />
            <p className="text-text-light text-xs mt-2 text-center">
              Nhập mã 6 số được gửi đến email của bạn
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary 
                       focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Đang xác thực..." : "Xác thực"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="text-sm text-primary font-semibold hover:underline 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending
                ? "Đang gửi..."
                : resendCooldown > 0
                  ? `Gửi lại sau ${resendCooldown}s`
                  : "Gửi lại OTP"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-light">
          Sai email?{" "}
          <button
            onClick={() => {
              setStep("request");
              setEmail("");
              setOtp("");
            }}
            className="font-semibold text-primary hover:underline"
          >
            Quay lại
          </button>
        </p>
      </div>
    );
  }

  // Step 3: Reset Password
  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">
        Đặt lại mật khẩu
      </h2>
      <p className="text-text-light text-center mb-6">
        Nhập mật khẩu mới của bạn bên dưới.
      </p>

      <form onSubmit={handlePasswordSubmit(onSubmitReset)} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-text-main">Mật khẩu mới</label>
          <input
            type="password"
            {...registerPassword("password")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-red-500 text-xs mt-1">{passwordErrors.password?.message}</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-text-main">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            {...registerPassword("confirmPassword")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-red-500 text-xs mt-1">
            {passwordErrors.confirmPassword?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     shadow-sm text-sm font-medium text-white bg-primary 
                     focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isResetting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-light">
        Đã nhớ mật khẩu?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
