import { FaGavel, FaUserPlus, FaMoneyBillWave, FaStore } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

const AdminDashboard = () => {
  // Mock Stats Data
  const stats = [
    { title: "Total Revenue", value: formatCurrency("19054"), icon: <FaMoneyBillWave />, color: "bg-green-500" },
    { title: "New Auctions", value: "124", icon: <FaGavel />, color: "bg-blue-500" },
    { title: "New Users", value: "45", icon: <FaUserPlus />, color: "bg-purple-500" },
    { title: "Upgrade Requests", value: "3", icon: <FaStore />, color: "bg-orange-500" },
  ];

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-primary-dark mb-8">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 flex flex-col justify-between rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-text-main text-lg font-bold">{stat.title}</p>
            </div>

            {/* Value */}
            <h3 className="text-2xl font-bold text-primary mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts Section (Mock UI with CSS Grid - No external lib needed for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Revenue Analytics (Last 7 Days)</h3>
          <div className="flex items-end justify-between h-64 gap-2">
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                <div 
                    style={{ height: `${h}%` }} 
                    className="absolute bottom-0 w-full bg-primary rounded-t-lg group-hover:bg-primary-dark transition-all"
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                    {h}M
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-4">Recent Upgrade Requests</h3>
           <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">U{item}</div>
                          <div>
                              <p className="font-bold text-sm">User #{item}</p>
                              <p className="text-xs text-gray-500">Wants to become Seller</p>
                          </div>
                      </div>
                      <button className="text-xs bg-primary text-white px-3 py-1 rounded">Review</button>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;