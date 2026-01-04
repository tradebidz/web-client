import { useState, useEffect, Fragment } from 'react';
import { FaCheck, FaTimes, FaUserShield, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllUsers, getPendingUpgrades, approveUpgrade, deleteUser } from '../../services/adminService';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingModal from '../../components/common/LoadingModal';

const UserManagePage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests'
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, userId: null, requestId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, upgradesData] = await Promise.all([
        getAllUsers(pagination.page, pagination.limit),
        getPendingUpgrades()
      ]);

      console.log(usersResponse);
      setUsers(usersResponse.data || []);
      setPagination(prev => ({
        ...prev,
        total: usersResponse.pagination.total,
        totalPages: usersResponse.pagination.totalPages
      }));
      setUpgradeRequests(upgradesData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // ... (previous helper functions remains)
  const hasUpgradeRequest = (userId) => {
    return upgradeRequests.some(req => req.user_id === userId && req.status === 'PENDING');
  };

  const requests = upgradeRequests.filter(req => req.status === 'PENDING');

  const handleApprove = (userId) => {
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
        toast.success("Đã nâng cấp người dùng thành SELLER");
      } else if (type === 'reject') {
        await approveUpgrade(requestId, false);
        toast.info("Đã từ chối yêu cầu");
      }
      fetchData();
    } catch (error) {
      toast.error("Xử lý thất bại");
    } finally {
      setConfirmModal({ isOpen: false, type: null, userId: null, requestId: null });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const generatePageNumbers = () => {
    const { page: currentPage, totalPages } = pagination;
    const pages = [];
    const delta = 2;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <LoadingModal isOpen={loading} text="Đang tải..." />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-dark">Quản lý người dùng</h2>
        {activeTab === 'all' && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold">
            Tổng cộng: {pagination.total} người dùng
          </div>
        )}
      </div>

      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-medium border-b-2 transition ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
        >
          Tất cả người dùng
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-medium border-b-2 transition flex items-center gap-2 ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
        >
          Yêu cầu nâng cấp
          {requests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{requests.length}</span>}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Người dùng</th>
              <th className="p-4 font-bold text-center">Vai trò</th>
              <th className="p-4 font-bold text-center">Trạng thái</th>
              <th className="p-4 text-right font-bold">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {activeTab === 'all' ? (
              users.map((user) => (
                <tr key={user.id} className="align-middle hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-text-main text-sm">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] rounded font-bold uppercase
                            ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {hasUpgradeRequest(user.id) ? (
                      <span className="text-orange-500 text-[11px] font-bold flex items-center justify-center gap-1">
                        <FaUserShield /> Chờ nâng cấp
                      </span>
                    ) : (
                      <span className="text-green-600 text-[11px] font-bold">Đang hoạt động</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {hasUpgradeRequest(user.id) ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(user.id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Duyệt"><FaCheck size={14} /></button>
                        <button onClick={() => handleReject(user.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Từ chối"><FaTimes size={14} /></button>
                      </div>
                    ) : (
                      user.role !== 'ADMIN' && (
                        <div className="flex justify-end">
                          <button className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition">Khóa</button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="align-middle hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-text-main text-sm">{req.users.full_name}</p>
                    <p className="text-xs text-gray-500">{req.users.email}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-0.5 text-[10px] rounded font-bold uppercase bg-gray-100 text-gray-600">
                      {req.users.role}
                    </span>
                  </td>
                  <td className="p-4 text-center text-orange-500 text-[11px] font-bold">
                    Đang chờ duyệt
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => handleApprove(req.user_id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><FaCheck size={14} /></button>
                    <button onClick={() => handleReject(req.user_id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><FaTimes size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {activeTab === 'all' && pagination.totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-text-light transition-colors"
            >
              <FaChevronLeft size={14} />
            </button>

            <div className="flex items-center gap-2">
              {generatePageNumbers().map((pageNum, index) => (
                <Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="px-3 py-1 text-gray-400 text-sm italic">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[36px] h-9 rounded-lg font-bold text-sm transition-all ${pagination.page === pageNum
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-white border border-gray-200 text-text-light hover:border-primary hover:text-primary'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </Fragment>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-text-light transition-colors"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}

        {activeTab === 'requests' && requests.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-medium italic">Không có yêu cầu nâng cấp nào đang chờ.</div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? 'Duyệt nâng cấp' : 'Từ chối nâng cấp'}
        message={confirmModal.type === 'approve' ? 'Xác nhận nâng cấp người dùng này lên quyền người bán?' : 'Từ chối yêu cầu nâng cấp của người dùng này?'}
        confirmText="Xác nhận"
        variant={confirmModal.type === 'approve' ? 'info' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, userId: null, requestId: null })}
      />
    </div>
  );
};

export default UserManagePage;