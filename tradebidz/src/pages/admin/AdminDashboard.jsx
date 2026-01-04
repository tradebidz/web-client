import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGavel, FaUserPlus, FaMoneyBillWave, FaStore } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { getDashboardStats, getPendingUpgrades } from '../../services/adminService';
import LoadingModal from '../../components/common/LoadingModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Tổng doanh thu", value: "---", icon: <FaMoneyBillWave />, color: "bg-green-500" },
    { title: "Phiên đấu giá", value: "---", icon: <FaGavel />, color: "bg-blue-500" },
    { title: "Tổng người dùng", value: "---", icon: <FaUserPlus />, color: "bg-purple-500" },
    { title: "Yêu cầu nâng cấp", value: "---", icon: <FaStore />, color: "bg-orange-500" },
  ]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [recentUpgrades, setRecentUpgrades] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats([
          { title: "Tổng doanh thu", value: formatCurrency(data.revenue.total_gmv || 0), icon: <FaMoneyBillWave />, color: "bg-green-500" },
          { title: "Phiên đấu giá", value: data.auctions.total.toString(), icon: <FaGavel />, color: "bg-blue-500" },
          { title: "Tổng người dùng", value: data.users.total.toString(), icon: <FaUserPlus />, color: "bg-purple-500" },
          { title: "Yêu cầu nâng cấp", value: data.pending_upgrades.toString(), icon: <FaStore />, color: "bg-orange-500" },
        ]);

        if (data.chart_data) {
          setChartData(data.chart_data);
        }

        const upgrades = await getPendingUpgrades();
        setRecentUpgrades(upgrades.slice(0, 5)); // Tăng lên 5 yêu cầu cho đẹp layout mới

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <LoadingModal isOpen={loading} text="Đang tải dữ liệu..."/>
      <h2 className="text-3xl font-bold text-text-main mb-8">Tổng quan Dashboard</h2>

      {/* Stats Cards - Giữ nguyên */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 flex flex-col justify-between rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl text-white shadow-lg ${stat.color} shadow-inherit/20`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
            </div>
            <h3 className="text-2xl font-black text-text-main leading-none">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Main Content Layout - Đã thay đổi từ 2 cột sang 1 cột lớn */}
      <div className="flex flex-col gap-8">
        
        {/* 1. Revenue Chart - Chiếm hết chiều ngang */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-xl text-text-main">Doanh thu theo danh mục</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-3 h-3 bg-primary rounded-full"></span> Doanh thu thực tế (GMV)
            </div>
            <div className="flex justify-end items-center gap-4 text-sm">
            <span className="text-gray-500">Tổng doanh thu hệ thống:</span>
            <span className="font-black text-primary text-xl">
              {stats.find(s => s.title === "Tổng doanh thu")?.value || '---'}
            </span>
          </div>
          </div>

          {/* Container cho phép scroll ngang nếu chart quá rộng */}
          <div className="overflow-x-auto pb-4 pt-20 custom-scrollbar">
            <div className="flex items-end justify-between h-72 gap-6 px-2 min-w-[800px]"> 
              {chartData.length > 0 ? chartData.map((item, i) => {
                const maxValue = Math.max(...chartData.map(c => Number(c.value))) || 1;
                const heightPercent = (Number(item.value) / maxValue) * 100;

                return (
                  <div key={i} className="flex-1 group flex flex-col justify-end items-center h-full">
                    {/* Bar */}
                    <div className="w-full relative flex flex-col justify-end items-center h-full">
                      <div
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        className="w-12 bg-primary rounded-t-lg group-hover:bg-primary-dark transition-all duration-300 relative"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg z-20 whitespace-nowrap shadow-xl transition-opacity pointer-events-none">
                          <span className="font-bold">{item.name}</span>: {formatCurrency(item.value)}
                        </div>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="mt-4 text-center">
                      <span className="text-xs text-gray-500 font-bold block truncate w-20">
                        {item.name}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                  Chưa có dữ liệu doanh thu
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Recent Activity - Chuyển xuống dưới và dàn rộng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-text-main">Yêu cầu nâng cấp gần đây</h3>
            <Link to="/admin/users" className="text-primary text-sm font-bold hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentUpgrades.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                    {request.users?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-text-main leading-tight">{request.users?.full_name || `User #${request.user_id}`}</p>
                    <p className="text-xs text-gray-400 mt-1">Yêu cầu trở thành Người bán</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
                  Chờ duyệt
                </span>
              </div>
            ))}
            {recentUpgrades.length === 0 && (
              <p className="text-center text-gray-400 py-10 col-span-full italic">
                Hiện không có yêu cầu nâng cấp nào đang chờ
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;