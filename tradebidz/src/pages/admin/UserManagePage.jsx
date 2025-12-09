import { useState } from 'react';
import { FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserManagePage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests'

  // Mock Users: Có user có role='BIDDER' nhưng isUpgradeRequested=true
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@gmail.com', role: 'BIDDER', isUpgradeRequested: false },
    { id: 2, name: 'Alice Smith', email: 'alice@gmail.com', role: 'BIDDER', isUpgradeRequested: true }, // Requesting
    { id: 3, name: 'Bob Store', email: 'bob@store.com', role: 'SELLER', isUpgradeRequested: false },
    { id: 4, name: 'Admin User', email: 'admin@tradebidz.com', role: 'ADMIN', isUpgradeRequested: false },
  ]);

  const requests = users.filter(u => u.isUpgradeRequested);

  // Handle Approve [cite: 161]
  const handleApprove = (id) => {
    if (window.confirm("Approve this user to become a Seller?")) {
      setUsers(users.map(u => u.id === id ? { ...u, role: 'SELLER', isUpgradeRequested: false } : u));
      toast.success("User upgraded to Seller successfully!");
    }
  };

  const handleReject = (id) => {
      setUsers(users.map(u => u.id === id ? { ...u, isUpgradeRequested: false } : u));
      toast.info("Request rejected.");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark mb-6">User Management</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-medium border-b-2 transition ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
        >
          All Users
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-medium border-b-2 transition flex items-center gap-2 ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
        >
          Upgrade Requests 
          {requests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.length}</span>}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-xs uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(activeTab === 'all' ? users : requests).map((user) => (
              <tr key={user.id}>
                <td className="p-4">
                  <p className="font-bold text-text-main">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`badge text-xs px-2 py-1 rounded font-bold 
                    ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                      user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                   {user.isUpgradeRequested ? (
                       <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                           <FaUserShield /> Requesting Seller
                       </span>
                   ) : <span className="text-green-500 text-xs font-bold">Active</span>}
                </td>
                <td className="p-4 text-right">
                  {/* Approve/Reject Buttons only for requests */}
                  {user.isUpgradeRequested && (
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(user.id)} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve">
                            <FaCheck />
                        </button>
                        <button onClick={() => handleReject(user.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject">
                            <FaTimes />
                        </button>
                    </div>
                  )}
                  {/* Standard Actions */}
                  {!user.isUpgradeRequested && user.role !== 'ADMIN' && (
                      <button className="text-red-500 hover:underline text-xs">Block</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(activeTab === 'requests' && requests.length === 0) && (
            <div className="p-8 text-center text-gray-500">No pending upgrade requests.</div>
        )}
      </div>
    </div>
  );
};

export default UserManagePage;