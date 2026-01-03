import { useState, useEffect } from 'react';
import { FaGavel, FaUserPlus, FaMoneyBillWave, FaStore } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { getDashboardStats, getPendingUpgrades } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "---", icon: <FaMoneyBillWave />, color: "bg-green-500" },
    { title: "Active Auctions", value: "---", icon: <FaGavel />, color: "bg-blue-500" },
    { title: "Total Users", value: "---", icon: <FaUserPlus />, color: "bg-purple-500" },
    { title: "Upgrade Requests", value: "---", icon: <FaStore />, color: "bg-orange-500" },
  ]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [recentUpgrades, setRecentUpgrades] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats([
          { title: "Total Revenue", value: formatCurrency(data.revenue.total_gmv || 0), icon: <FaMoneyBillWave />, color: "bg-green-500" },
          { title: "Active Auctions", value: data.auctions.total.toString(), icon: <FaGavel />, color: "bg-blue-500" },
          { title: "Total Users", value: data.users.total.toString(), icon: <FaUserPlus />, color: "bg-purple-500" },
          { title: "Upgrade Requests", value: data.pending_upgrades.toString(), icon: <FaStore />, color: "bg-orange-500" },
        ]);

        // Process chart data (Revenue by category)
        if (data.chart_data) {
          // Mocking historical data structure for now or mapping specific category revenue
          // The UI expects a bar chart array. Let's map category revenue to it if possible or keep mock for visual if data shape differs widely
          // The backend returns revenue by category. Let's use that.
          setChartData(data.chart_data);
        }

        // We might need to fetch recent upgrades separately if not in dashboard stats fully
        // The dashboard stats API returns count, but we also have getPendingUpgrades
        // Let's fetch pending for the list
        const upgrades = await getPendingUpgrades();
        setRecentUpgrades(upgrades.slice(0, 3));

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-primary-dark mb-8">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 flex flex-col justify-between rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-text-main text-lg font-bold">{stat.title}</p>
            </div>

            {/* Value */}
            <h3 className="text-2xl text-center font-bold text-primary mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue Chart - using Category Distribution for now as that's what we have */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Revenue by Category</h3>
          <div className="flex items-end justify-between h-64 gap-2">
            {chartData.length > 0 ? chartData.map((item, i) => (
              <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group flex flex-col justify-end items-center">
                <div
                  style={{ height: `${Math.min((item.value / (Math.max(...chartData.map(c => c.value)) || 1)) * 100, 100)}%` }}
                  className="w-full bg-primary rounded-t-lg group-hover:bg-primary-dark transition-all"
                ></div>
                <div className="hidden group-hover:block absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap">
                  {item.name}: {formatCurrency(item.value)}
                </div>
                <span className="text-[10px] mt-1 truncate w-full text-center">{item.name}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No revenue data</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Recent Upgrade Requests</h3>
          <div className="space-y-4">
            {recentUpgrades.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {request.users?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{request.users?.full_name || `User #${request.user_id}`}</p>
                    <p className="text-xs text-gray-500">Wants to upgrade</p>
                  </div>
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
              </div>
            ))}
            {recentUpgrades.length === 0 && (
              <p className="text-center text-gray-400 py-4">No pending upgrade requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;