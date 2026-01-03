import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-dark to-primary text-white pb-4 pt-10 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-primary-light text-5xl font-bold mb-4">TradeBid</h3>
          <p className="text-sm">
            Nền tảng đấu giá trực tuyến hàng đầu. Kết nối đam mê và giá trị.
          </p>
        </div>

        <div>
          <h4 className="text-primary-light font-bold mb-3 text-2xl">Về chúng tôi</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-primary-light transition">Giới thiệu</Link></li>
            <li><Link to="/terms" className="hover:text-primary-light transition">Quy chế hoạt động</Link></li>
            <li><Link to="/privacy" className="hover:text-primary-light transition">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary-light font-bold mb-3 text-2xl">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-to-bid" className="hover:text-primary-light transition">Hướng dẫn đấu giá</Link></li>
            <li><Link to="/how-to-sell" className="hover:text-primary-light transition">Hướng dẫn bán hàng</Link></li>
            <li><Link to="/faq" className="hover:text-primary-light transition">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary-light font-bold mb-3 text-2xl">Liên hệ</h4>
          <p className="text-sm">Email: tradebidz8386@gmail.com</p>
          <p className="text-sm">Hotline: 1900 1234</p>
        </div>

      </div>

      <div className="border-t border-gray-400 mt-10 pt-4 text-center text-sm">
        © {new Date().getFullYear()} TradeBidz. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
};

export default Footer;