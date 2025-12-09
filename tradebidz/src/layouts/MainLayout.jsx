import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />

      <main className="flex-grow container min-w-full py-4">
        {/* <div className="bg-white shadow-sm rounded-2xl"> */}
        <div className="">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
