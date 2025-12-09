import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockUsers, mockUpgradeRequests } from '../../utils/mockData';
import ConfirmModal from '../../components/common/ConfirmModal';

const UserManagePage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests'
  const [users, setUsers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, userId: null });

  useEffect(() => {
    // Initialize from mockData
    setUsers([...mockUsers]);
    setUpgradeRequests([...mockUpgradeRequests]);
  }, []);
  
  // Check if user has pending upgrade request
  const hasUpgradeRequest = (userId) => {
    return upgradeRequests.some(req => req.userId === userId && req.status === 'PENDING');
  };

  const requests = users.filter(u => hasUpgradeRequest(u.id));

  // Handle Approve [cite: 161]
  const handleApprove = (userId) => {
    setConfirmModal({ isOpen: true, type: 'approve', userId });
  };

  const handleReject = (userId) => {
    setConfirmModal({ isOpen: true, type: 'reject', userId });
  };

  const confirmAction = () => {
    const { type, userId } = confirmModal;
    
    if (type === 'approve') {
      // Update user role
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, role: 'SELLER', updatedAt: new Date().toISOString() } 
          : u
      ));
      // Update upgrade request status
      setUpgradeRequests(upgradeRequests.map(req => 
        req.userId === userId && req.status === 'PENDING'
          ? { ...req, status: 'APPROVED' }
          : req
      ));
      toast.success("User upgraded to Seller successfully!");
    } else if (type === 'reject') {
      // Update upgrade request status
      setUpgradeRequests(upgradeRequests.map(req => 
        req.userId === userId && req.status === 'PENDING'
          ? { ...req, status: 'REJECTED' }
          : req
      ));
      toast.info("Request rejected.");
    }
    
    setConfirmModal({ isOpen: false, type: null, userId: null });
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
            <thead className="bg-gray-50 text-text-light text-xs uppercase tracking-wide">
            <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
            {(activeTab === 'all' ? users : requests).map((user) => (
                <tr key={user.id} className="align-middle">
                
                {/* USER */}
                <td className="p-4">
                    <p className="font-semibold text-text-main text-sm">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.address && (
                    <p className="text-xs text-gray-400 mt-1">{user.address}</p>
                    )}
                </td>

                {/* ROLE */}
                <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[11px] rounded-full font-semibold
                    ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                        user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                    </span>

                    <div className="text-xs text-gray-500 mt-1">
                    ⭐ {user.ratingScore.toFixed(1)} ({user.ratingCount} reviews)
                    </div>

                    {user.isVerified && (
                    <span className="text-xs text-green-600 font-semibold">✓ Verified</span>
                    )}
                </td>

                {/* STATUS */}
                <td className="p-4">
                    {hasUpgradeRequest(user.id) ? (
                    <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                        <FaUserShield /> Requesting Seller
                    </span>
                    ) : (
                    <span className="text-green-600 text-xs font-semibold">Active</span>
                    )}
                </td>

                {/* ACTIONS */}
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
            ))}
            </tbody>
        </table>

        {(activeTab === 'requests' && requests.length === 0) && (
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
        onCancel={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
      />
    </div>
  );
};

export default UserManagePage;