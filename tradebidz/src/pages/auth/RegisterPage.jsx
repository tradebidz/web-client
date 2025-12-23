import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha"; 
import { register as registerRequest, verifyOtp, resendOtp } from "../../services/authService";
import { loginSuccess } from "../../redux/slices/authSlice";

// Schema Validation
const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Confirm password does not match')
    .required('Please confirm password'),
}).required();

const RegisterPage = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Access environment variable safely
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    try {
      const response = await registerRequest({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        recaptcha_token: captchaToken, // Send token to backend
      });

      setRegisteredEmail(data.email);
      setStep('verify');
      toast.success(response.message || "Registration successful! Please check your email for OTP.");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      // Reset captcha on error to force re-verification
      setCaptchaToken(null);
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
      const response = await verifyOtp(registeredEmail, otp);
      
      // Auto-login after successful verification
      const accessToken = response.access_token || response.accessToken;
      const refreshToken = response.refresh_token || response.refreshToken;
      
      // Get user info - we'll need to fetch it or decode from token
      // For now, we'll decode from token or fetch user
      dispatch(loginSuccess({
        accessToken,
        refreshToken,
        user: response.user || null,
      }));

      toast.success("Email verified successfully! You are now logged in.");
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting a new OTP`);
      return;
    }

    setIsResending(true);
    try {
      await resendOtp(registeredEmail);
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
      const message = error.response?.data?.message || "Failed to resend OTP. Please try again.";
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
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  if (step === 'verify') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">Verify Your Email</h2>
        <p className="text-text-light text-center mb-6">
          We've sent a 6-digit OTP code to <strong>{registeredEmail}</strong>
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Enter OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-center text-2xl tracking-widest font-mono"
            />
            <p className="text-text-light text-xs mt-2 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="text-sm text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending
                ? 'Sending...'
                : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : 'Resend OTP'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-light">
          Wrong email?{' '}
          <button
            onClick={() => {
              setStep('register');
              setOtp('');
              setRegisteredEmail('');
            }}
            className="font-semibold text-primary hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark  text-center mb-2">Register Account</h2>
      <p className="text-text-light text-center mb-6">Join the TradeBid community now!</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-text-main">Full name</label>
          <input {...register("fullName")} className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          <p className="text-red-500 text-xs mt-1">{errors.fullName?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-main">Email</label>
          <input type="email" {...register("email")} className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-text-main">Password</label>
          <input
            type="password"
            {...register("password")}
            className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-text-main">Confirm password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
        </div>

        {/* Google reCAPTCHA Library Component */}
        <div className="flex flex-col items-center gap-2 mt-4">
          {recaptchaSiteKey ? (
            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={onCaptchaChange}
            />
          ) : (
            <p className="text-sm text-red-500">
              Missing reCAPTCHA site key. Check your .env file.
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !captchaToken}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering...' : 'Register account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-light">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;