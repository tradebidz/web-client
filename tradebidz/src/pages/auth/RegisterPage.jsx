import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schema Validation
const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  address: yup.string().required('Address is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Confirm password does not match')
    .required('Please confirm password'),
}).required();

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // According to the documentation: Need to send email OTP for verification
    console.log("Register Data:", data);
    alert("The system will send OTP to email for verification (UI Mockup)");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-main text-center mb-2">Register account</h2>
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

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-text-main">Address</label>
          <input {...register("address")} className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-text-main">Password</label>
            <input type="password" {...register("password")} className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
            </div>

            <div>
            <label className="block text-sm font-medium text-text-main">Confirm password</label>
            <input type="password" {...register("confirmPassword")} className="input-field mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
            </div>
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none">
          Register account
        </button>

        {/* Mockup reCaptcha */}
        <div className="flex items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded text-sm text-text-light">
          [Mockup] Google reCaptcha Checkbox
        </div>
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