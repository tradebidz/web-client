const HowToBidPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Hướng dẫn đấu giá</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 1: Đăng ký tài khoản</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Click vào nút "Đăng ký" ở góc trên bên phải</li>
                        <li>Điền đầy đủ thông tin: Họ tên, Email, Mật khẩu</li>
                        <li>Xác thực email bằng mã OTP được gửi đến hộp thư</li>
                        <li>Đăng nhập vào tài khoản</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 2: Tìm sản phẩm</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Duyệt qua trang chủ để xem các sản phẩm nổi bật</li>
                        <li>Sử dụng thanh tìm kiếm để tìm sản phẩm cụ thể</li>
                        <li>Lọc theo danh mục, giá, thời gian kết thúc</li>
                        <li>Click vào sản phẩm để xem chi tiết</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 3: Đặt giá thầu</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Đọc kỹ mô tả sản phẩm, xem hình ảnh</li>
                        <li>Kiểm tra giá hiện tại và bước giá</li>
                        <li>Click nút "Đấu giá"</li>
                        <li>Nhập giá đấu (phải cao hơn giá hiện tại + bước giá)</li>
                        <li>Xác nhận đặt giá</li>
                    </ol>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                        <p className="font-semibold">⚠️ Lưu ý:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Bạn cần có điểm tín nhiệm ≥ 80% để đấu giá (trừ người mới)</li>
                            <li>Giá đấu có hiệu lực ngay và không thể hủy</li>
                            <li>Nếu thắng, bạn bắt buộc phải mua sản phẩm</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 4: Theo dõi đấu giá</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Thêm sản phẩm vào danh sách theo dõi bằng nút ❤️</li>
                        <li>Xem lịch sử đấu giá của bạn tại "Đấu giá của tôi"</li>
                        <li>Nhận thông báo khi bị vượt giá</li>
                        <li>Đấu giá lại nếu muốn giành lại vị trí dẫn đầu</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 5: Thanh toán và nhận hàng</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Nếu bạn thắng đấu giá, sẽ nhận thông báo qua email</li>
                        <li>Vào "Sản phẩm đã thắng" để xem chi tiết</li>
                        <li>Click "Thanh toán" và làm theo hướng dẫn</li>
                        <li>Chờ người bán giao hàng</li>
                        <li>Nhận hàng và đánh giá người bán</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Mẹo đấu giá hiệu quả</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>🔍 Nghiên cứu kỹ sản phẩm trước khi đấu giá</li>
                        <li>💰 Đặt giá tối đa bạn sẵn sàng trả</li>
                        <li>⏰ Đấu giá vào phút cuối để tránh đẩy giá sớm</li>
                        <li>📊 Theo dõi lịch sử giá để biết giá trị thực</li>
                        <li>✅ Kiểm tra uy tín người bán</li>
                    </ul>
                </section>

                <section className="bg-blue-50 border-l-4 border-blue-500 p-6">
                    <h3 className="font-bold text-lg mb-2">Cần trợ giúp?</h3>
                    <p>Liên hệ với chúng tôi:</p>
                    <p className="mt-2"><strong>Email:</strong> tradebidz8386@gmail.com</p>
                    <p><strong>Hotline:</strong> 1900 1234</p>
                </section>
            </div>
        </div>
    );
};

export default HowToBidPage;
