const PrivacyPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Chính sách bảo mật</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Thu thập thông tin</h2>
                    <p className="mb-3">Chúng tôi thu thập các thông tin sau:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, địa chỉ</li>
                        <li><strong>Thông tin tài khoản:</strong> Tên đăng nhập, mật khẩu (được mã hóa)</li>
                        <li><strong>Thông tin giao dịch:</strong> Lịch sử đấu giá, thanh toán</li>
                        <li><strong>Thông tin kỹ thuật:</strong> IP address, browser, thiết bị</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Mục đích sử dụng</h2>
                    <p className="mb-3">Thông tin được sử dụng để:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Xác thực và quản lý tài khoản người dùng</li>
                        <li>Xử lý giao dịch đấu giá và thanh toán</li>
                        <li>Gửi thông báo về đấu giá và hoạt động tài khoản</li>
                        <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                        <li>Ngăn chặn gian lận và bảo vệ an ninh</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Bảo mật thông tin</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Mã hóa dữ liệu nhạy cảm bằng SSL/TLS</li>
                        <li>Mật khẩu được hash bằng thuật toán bcrypt</li>
                        <li>Lưu trữ dữ liệu trên server bảo mật với firewall</li>
                        <li>Kiểm tra bảo mật định kỳ</li>
                        <li>Chỉ nhân viên được ủy quyền mới truy cập dữ liệu</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Chia sẻ thông tin</h2>
                    <p className="mb-3">Chúng tôi <strong>KHÔNG</strong> bán hoặc cho thuê thông tin cá nhân.</p>
                    <p className="mb-3">Thông tin chỉ được chia sẻ trong các trường hợp:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Người mua/bán cần thông tin liên lạc để giao dịch</li>
                        <li>Cơ quan pháp luật yêu cầu theo quy định</li>
                        <li>Đối tác cung cấp dịch vụ thanh toán (với mức độ tối thiểu)</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Quyền của người dùng</h2>
                    <p className="mb-3">Bạn có quyền:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Truy cập và xem thông tin cá nhân của mình</li>
                        <li>Chỉnh sửa hoặc cập nhật thông tin</li>
                        <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                        <li>Từ chối nhận email marketing (nhưng vẫn nhận email giao dịch)</li>
                        <li>Khiếu nại về việc xử lý thông tin cá nhân</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Cookies</h2>
                    <p>
                        Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng, lưu phiên đăng nhập
                        và phân tích lưu lượng truy cập. Bạn có thể tắt cookies trong trình duyệt nhưng
                        một số tính năng có thể không hoạt động.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">7. Thay đổi chính sách</h2>
                    <p>
                        Chúng tôi có thể cập nhật chính sách bảo mật. Mọi thay đổi quan trọng sẽ được
                        thông báo qua email hoặc trên website.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">8. Liên hệ</h2>
                    <p className="mb-2">
                        Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                    </p>
                    <p className="mb-1"><strong>Email:</strong> tradebidz8386@gmail.com</p>
                    <p><strong>Hotline:</strong> 1900 1234</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">
                    <em>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</em>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
