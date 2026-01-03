import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-bg">

      {/* Left column: Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-bg to-primary-light 
                      lg:flex flex-col justify-center items-center text-white 
                      p-12 relative overflow-hidden">

        <div className="relative z-10 text-center">
            <Link to="/">
                <img 
                    src="/TradeBidz.png"
                    alt="TradeBidz Logo"
                    className="w-2/3 mx-auto drop-shadow-2xl hover:scale-110 transition duration-300"
                />
            </Link>

            <p className="text-3xl font-semibold italic mb-8 text-text-light">
            Nền tảng đấu giá hàng đầu - Nơi niềm đam mê định giá của bạn được hiện thực hóa
            </p>
        </div>
      </div>

      {/* Right column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <h2 className="text-3xl font-bold text-primary">TradeBidz</h2>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
