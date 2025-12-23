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
    .email("Email is not valid")
    .required("Email is required"),
});

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Confirm password does not match")
    .required("Please confirm password"),
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
      toast.success("Password reset OTP has been sent to your email.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send reset password OTP. Please try again.";
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
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyResetOtp(email, otp);
      setStep("reset");
      toast.success("OTP verified successfully. You can now reset your password.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid OTP. Please try again.";
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
      toast.success("Password has been reset successfully. Please login with your new password.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting a new OTP`);
      return;
    }

    setIsResending(true);
    try {
      await requestResetPassword(email);
      toast.success("OTP has been resent. Please check your email.");
      
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
        error.response?.data?.message || "Failed to resend OTP. Please try again.";
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
          Forgot Password
        </h2>
        <p className="text-text-light text-center mb-6">
          Enter your email to receive a password reset OTP code.
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
            {isRequesting ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-light">
          Remember your password?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
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
          Verify Reset OTP
        </h2>
        <p className="text-text-light text-center mb-6">
          We've sent a 6-digit OTP code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Enter OTP Code
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
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary 
                       focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
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
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-light">
          Wrong email?{" "}
          <button
            onClick={() => {
              setStep("request");
              setEmail("");
              setOtp("");
            }}
            className="font-semibold text-primary hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  // Step 3: Reset Password
  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">
        Reset Password
      </h2>
      <p className="text-text-light text-center mb-6">
        Enter your new password below.
      </p>

      <form onSubmit={handlePasswordSubmit(onSubmitReset)} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-text-main">New Password</label>
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
            Confirm New Password
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
          {isResetting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-light">
        Remember your password?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
