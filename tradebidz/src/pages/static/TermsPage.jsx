const TermsPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Quy chế hoạt động</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Điều khoản chung</h2>
                    <p className="mb-3">
                        Khi sử dụng dịch vụ TradeBidz, bạn đồng ý tuân thủ các quy định và điều khoản sau đây.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Người dùng phải đủ 18 tuổi trở lên</li>
                        <li>Thông tin đăng ký phải chính xác và trung thực</li>
                        <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                        <li>Tuân thủ các quy định về đấu giá và giao dịch</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Quy định về đấu giá</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Mỗi lần đặt giá phải cao hơn giá hiện tại ít nhất một bước giá</li>
                        <li>Người đấu giá phải có điểm tín nhiệm tối thiểu 80% (trừ người mới)</li>
                        <li>Không được đấu giá sản phẩm của chính mình</li>
                        <li>Giá đấu có hiệu lực ngay khi xác nhận</li>
                        <li>Người thắng cuộc có trách nhiệm thanh toán trong 3 ngày</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Quy định về bán hàng</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Chỉ người bán đã được xác thực mới có thể đăng sản phẩm</li>
                        <li>Sản phẩm phải có mô tả rõ ràng và hình ảnh thật</li>
                        <li>Không đăng sản phẩm giả, hàng nhái, hàng cấm</li>
                        <li>Người bán có thể từ chối người mua có uy tín thấp</li>
                        <li>Phải giao hàng trong thời hạn cam kết</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Chính sách thanh toán</h2>
                    <p className="mb-3">
                        Người thắng đấu giá phải thanh toán trong vòng 3 ngày kể từ khi kết thúc phiên đấu giá.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Hỗ trợ thanh toán trực tuyến an toàn</li>
                        <li>Không hoàn tiền sau khi đấu giá thành công (trừ trường hợp đặc biệt)</li>
                        <li>Người bán nhận tiền sau khi giao hàng thành công</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Xử lý vi phạm</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Cảnh cáo lần đầu vi phạm nhẹ</li>
                        <li>Khóa tạm thời tài khoản vi phạm nhiều lần</li>
                        <li>Khóa vĩnh viễn tài khoản vi phạm nghiêm trọng</li>
                        <li>Báo cáo cơ quan chức năng nếu phát hiện hành vi lừa đảo</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Miễn trừ trách nhiệm</h2>
                    <p>
                        TradeBidz chỉ là nền tảng kết nối, không chịu trách nhiệm về chất lượng sản phẩm,
                        tranh chấp giữa người mua và người bán. Mọi giao dịch là thỏa thuận giữa hai bên.
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-8">
                    <em>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</em>
                </p>
            </div>
        </div>
    );
};

export default TermsPage;
