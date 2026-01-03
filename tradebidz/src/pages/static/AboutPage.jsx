const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Giới thiệu về TradeBidz</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về chúng tôi</h2>
                    <p className="mb-4">
                        TradeBidz là nền tảng đấu giá trực tuyến hàng đầu, kết nối người mua và người bán
                        trong một môi trường an toàn, minh bạch và công bằng.
                    </p>
                    <p className="mb-4">
                        Chúng tôi cam kết mang đến trải nghiệm đấu giá tốt nhất với công nghệ hiện đại,
                        hệ thống thanh toán an toàn và dịch vụ khách hàng chuyên nghiệp.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Sứ mệnh</h2>
                    <p>
                        Tạo ra một thị trường đấu giá công bằng, minh bạch và dễ tiếp cận cho mọi người,
                        nơi mọi sản phẩm đều có cơ hội được định giá đúng giá trị thực.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Giá trị cốt lõi</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Minh bạch:</strong> Mọi giao dịch đều công khai và có thể kiểm chứng</li>
                        <li><strong>An toàn:</strong> Bảo vệ thông tin và quyền lợi của người dùng</li>
                        <li><strong>Công bằng:</strong> Mọi người đều có cơ hội bình đẳng</li>
                        <li><strong>Chất lượng:</strong> Cam kết chất lượng sản phẩm và dịch vụ</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Liên hệ</h2>
                    <p className="mb-2"><strong>Email:</strong> tradebidz8386@gmail.com</p>
                    <p className="mb-2"><strong>Hotline:</strong> 1900 1234</p>
                    <p><strong>Giờ làm việc:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
