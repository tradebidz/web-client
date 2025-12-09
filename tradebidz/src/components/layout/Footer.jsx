const Footer = () => {
    return (
      <footer className="bg-gradient-to-r from-primary-dark to-primary text-white pb-4 pt-10 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary-light text-5xl font-bold mb-4">TradeBid</h3>
            <p className="text-sm">
              The leading online auction platform. Connecting passion and value.
            </p>
          </div>

          <div>
            <h4 className="text-primary-light font-bold mb-3 text-2xl">About us</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-primary">Introduction</a></li>
              <li><a href="#" className="hover:text-primary">Activity rules</a></li>
              <li><a href="#" className="hover:text-primary">Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-light font-bold mb-3 text-2xl">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary">Bidding guide</a></li>
              <li><a href="#" className="hover:text-primary">Seller guide</a></li>
              <li><a href="#" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-light font-bold mb-3 text-2xl">Contact</h4>
            <p className="text-sm">Email: support@tradebidz.com</p>
            <p className="text-sm">Hotline: 1900 1234</p>
          </div>

        </div>

        <div className="border-t border-gray-400 mt-10 pt-4 text-center text-sm">
          © {new Date().getFullYear()} TradeBidz. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;