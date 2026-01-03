import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllUsers, getPendingUpgrades, approveUpgrade, deleteUser } from '../../services/adminService';
import ConfirmModal from '../../components/common/ConfirmModal';

const UserManagePage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests'
  const [users, setUsers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, userId: null, requestId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, upgradesData] = await Promise.all([
        getAllUsers(),
        getPendingUpgrades()
      ]);
      setUsers(usersData);
      setUpgradeRequests(upgradesData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Check if user has pending upgrade request
  const hasUpgradeRequest = (userId) => {
    return upgradeRequests.some(req => req.user_id === userId && req.status === 'PENDING');
  };

  // Filter users who have pending requests for the 'requests' tab view
  // OR use the upgradeRequests list directly which contains user info in relation
  const requests = upgradeRequests.filter(req => req.status === 'PENDING');


  // Handle Approve
  const handleApprove = (userId) => {
    // Find request id
    const req = upgradeRequests.find(r => r.user_id === userId && r.status === 'PENDING');
    if (req) {
      setConfirmModal({ isOpen: true, type: 'approve', userId, requestId: req.id });
    }
  };

  const handleReject = (userId) => {
    const req = upgradeRequests.find(r => r.user_id === userId && r.status === 'PENDING');
    if (req) {
      setConfirmModal({ isOpen: true, type: 'reject', userId, requestId: req.id });
    }
  };

  const confirmAction = async () => {
    const { type, requestId } = confirmModal;

    try {
      if (type === 'approve') {
        await approveUpgrade(requestId, true);
        toast.success("User upgraded to Seller successfully!");
      } else if (type === 'reject') {
        await approveUpgrade(requestId, false);
        toast.info("Request rejected.");
      }
      fetchData(); // Refresh
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Failed to process request");
    } finally {
      setConfirmModal({ isOpen: false, type: null, userId: null, requestId: null });
    }
  };

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

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
          <thead className="bg-gray-50 text-text-light text-xs uppercase tracking-wide">
            <tr>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {activeTab === 'all' ? (
              /* list all users */
              users.map((user) => (
                <tr key={user.id} className="align-middle">
                  <td className="p-4">
                    <p className="font-semibold text-text-main text-sm">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.address && (
                      <p className="text-xs text-gray-400 mt-1">{user.address}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[11px] rounded-full font-semibold
                            ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>

                    <div className="text-xs text-gray-500 mt-1">
                      ⭐ {(user.rating_score || 0).toFixed(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    {hasUpgradeRequest(user.id) ? (
                      <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                        <FaUserShield /> Requesting Seller
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs font-semibold">Active</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {hasUpgradeRequest(user.id) ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
                          title="Approve"
                        >
                          <FaCheck size={14} />
                        </button>

                        <button
                          onClick={() => handleReject(user.id)}
                          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          title="Reject"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ) : (
                      user.role !== 'ADMIN' && (
                        <div className="flex justify-end">
                          <button className="text-red-600 hover:text-red-700 text-xs font-semibold">
                            Block
                          </button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              /* list requests */
              requests.map((req) => (
                <tr key={req.id} className="align-middle">
                  <td className="p-4">
                    <p className="font-semibold text-text-main text-sm">{req.users.full_name}</p>
                    <p className="text-sm text-gray-500">{req.users.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 text-[11px] rounded-full font-semibold bg-gray-100 text-gray-600">
                      {req.users.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                      <FaUserShield /> Pending Approval
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleApprove(req.user_id)}
                      className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
                      title="Approve"
                    >
                      <FaCheck size={14} />
                    </button>

                    <button
                      onClick={() => handleReject(req.user_id)}
                      className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                      title="Reject"
                    >
                      <FaTimes size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {activeTab === 'requests' && requests.length === 0 && (
          <div className="p-8 text-center text-gray-500">No pending upgrade requests.</div>
        )}
      </div>


      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? 'Approve Upgrade Request' : 'Reject Upgrade Request'}
        message={
          confirmModal.type === 'approve'
            ? 'Approve this user to become a Seller?'
            : 'Reject this upgrade request?'
        }
        confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        variant={confirmModal.type === 'approve' ? 'info' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, userId: null, requestId: null })}
      />
    </div>
  );
};

export default UserManagePage;