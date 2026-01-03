const HowToSellPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Hướng dẫn bán hàng</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 1: Nâng cấp tài khoản Người bán</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Đăng nhập vào tài khoản của bạn</li>
                        <li>Vào menu "Tài khoản" → "Nâng cấp Người bán"</li>
                        <li>Đọc kỹ điều khoản và yêu cầu</li>
                        <li>Click "Gửi yêu cầu nâng cấp"</li>
                        <li>Chờ admin phê duyệt (thường trong 24 giờ)</li>
                        <li>Nhận thông báo qua email khi được phê duyệt</li>
                    </ol>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                        <p className="font-semibold">⚠️ Yêu cầu:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Tài khoản đã xác thực email</li>
                            <li>Điểm tín nhiệm ≥ 80% (nếu đã có giao dịch)</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 2: Đăng sản phẩm</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Vào "Đăng sản phẩm" từ menu Người bán</li>
                        <li>Điền thông tin sản phẩm:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Tên sản phẩm (rõ ràng, hấp dẫn)</li>
                                <li>Danh mục phù hợp</li>
                                <li>Mô tả chi tiết (tình trạng, nguồn gốc, ưu điểm)</li>
                            </ul>
                        </li>
                        <li>Upload ảnh sản phẩm (tối thiểu 3 ảnh, tối đa 10 ảnh)</li>
                        <li>Thiết lập giá:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Giá khởi điểm</li>
                                <li>Bước giá</li>
                                <li>Giá mua ngay (tùy chọn)</li>
                            </ul>
                        </li>
                        <li>Chọn thời gian kết thúc đấu giá</li>
                        <li>Xác nhận và đăng sản phẩm</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 3: Quản lý đấu giá</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Theo dõi danh sách sản phẩm tại "Sản phẩm của tôi"</li>
                        <li>Xem lịch sử đấu giá chi tiết (bao gồm người đấu)</li>
                        <li>Trả lời câu hỏi từ người mua tiềm năng</li>
                        <li>Có thể từ chối người mua có uy tín thấp</li>
                        <li>Hủy giao dịch nếu người mua vi phạm</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 4: Giao hàng</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Sau khi đấu giá kết thúc, kiểm tra người thắng</li>
                        <li>Chờ người mua thanh toán (tối đa 3 ngày)</li>
                        <li>Nhận thông tin liên lạc của người mua</li>
                        <li>Liên hệ và thỏa thuận cách thức giao hàng</li>
                        <li>Đóng gói cẩn thận và giao hàng đúng hẹn</li>
                        <li>Cập nhật trạng thái giao hàng</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Bước 5: Nhận thanh toán và đánh giá</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Sau khi người mua xác nhận đã nhận hàng</li>
                        <li>Tiền sẽ được chuyển vào tài khoản của bạn</li>
                        <li>Đánh giá người mua</li>
                        <li>Nhận đánh giá từ người mua</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Mẹo bán hàng hiệu quả</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>📸 Chụp ảnh đẹp, nhiều góc, ánh sáng tốt</li>
                        <li>✍️ Viết mô tả chi tiết, trung thực</li>
                        <li>💰 Đặt giá khởi điểm hợp lý để thu hút người mua</li>
                        <li>⏰ Chọn thời gian kết thúc vào giờ cao điểm</li>
                        <li>💬 Trả lời câu hỏi nhanh chóng và nhiệt tình</li>
                        <li>🌟 Duy trì uy tín cao để tăng lượt đấu giá</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Quy định quan trọng</h2>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="font-semibold mb-2">❌ Không được phép:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Đăng sản phẩm giả, hàng nhái</li>
                            <li>Đăng hàng cấm, hàng vi phạm pháp luật</li>
                            <li>Sử dụng ảnh không phải của mình</li>
                            <li>Mô tả sai sự thật, lừa dối</li>
                            <li>Từ chối giao hàng sau khi bán được</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-blue-50 border-l-4 border-blue-500 p-6">
                    <h3 className="font-bold text-lg mb-2">Cần hỗ trợ?</h3>
                    <p>Đội ngũ hỗ trợ người bán luôn sẵn sàng giúp bạn:</p>
                    <p className="mt-2"><strong>Email:</strong> tradebidz8386@gmail.com</p>
                    <p><strong>Hotline:</strong> 1900 1234</p>
                </section>
            </div>
        </div>
    );
};

export default HowToSellPage;
