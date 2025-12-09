import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";

// Validation Schema
const schema = yup.object({
  email: yup
    .string()
    .email("Email is not valid")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Send Reset Password To:", data.email);

    // Fake API mock
    toast.info(`A reset password link has been sent to ${data.email}`);

    // Or you can show UI mock
    // alert("We have sent a reset password link to your email.");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark text-center mb-2">
        Forgot Password
      </h2>
      <p className="text-text-light text-center mb-6">
        Enter your email to receive a password reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-main">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     shadow-sm text-sm font-medium text-white bg-primary 
                     focus:outline-none"
        >
          Reset Password
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
