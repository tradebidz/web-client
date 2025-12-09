import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login as loginRequest } from '../../services/authService';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginRequest({
        email: data.email,
        password: data.password,
      });

      const accessToken = response.access_token || response.accessToken;
      const refreshToken = response.refresh_token || response.refreshToken;
      const user = response.user;

      dispatch(loginSuccess({
        accessToken,
        refreshToken,
        user,
      }));

      toast.success("Login successfully!");
      navigate('/'); 
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">Welcome Back!</h2>
      <p className="text-text-light text-center mb-6">Login to continue auction</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-main">Email</label>
          <input 
            {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
            type="email" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main">Password</label>
          <input 
            {...register("password", { required: "Password is required" })}
            type="password" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary font-semibold hover:underline">Forgot password?</Link>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-light">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <FaGoogle className="text-red-500 text-lg" />
          </button>
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <FaFacebook className="text-blue-600 text-lg" />
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-text-light">
        Don't have any account yet?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Register now!
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;