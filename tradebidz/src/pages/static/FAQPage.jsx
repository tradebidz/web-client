const FAQPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Câu hỏi thường gặp (FAQ)</h1>

            <div className="prose max-w-none space-y-4">
                {/* Câu hỏi chung */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Câu hỏi chung</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ TradeBidz là gì?</h3>
                            <p className="text-gray-700 mt-2">
                                TradeBidz là nền tảng đấu giá trực tuyến, nơi người mua và người bán có thể
                                giao dịch sản phẩm thông qua hình thức đấu giá công khai, minh bạch.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Sử dụng TradeBidz có mất phí không?</h3>
                            <p className="text-gray-700 mt-2">
                                Đăng ký tài khoản và tham gia đấu giá hoàn toàn <strong>miễn phí</strong>.
                                Người bán có thể bị thu phí dịch vụ nhỏ khi bán thành công sản phẩm.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Làm sao để liên hệ hỗ trợ?</h3>
                            <p className="text-gray-700 mt-2">
                                Email: tradebidz8386@gmail.com<br />
                                Hotline: 1900 1234 (8:00 - 22:00 hàng ngày)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Câu hỏi về tài khoản */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về tài khoản</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Làm sao để đăng ký tài khoản?</h3>
                            <p className="text-gray-700 mt-2">
                                Click "Đăng ký" ở góc phải trên cùng, điền thông tin và xác thực email bằng mã OTP.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Quên mật khẩu thì làm sao?</h3>
                            <p className="text-gray-700 mt-2">
                                Click "Quên mật khẩu" ở trang đăng nhập, nhập email và làm theo hướng dẫn
                                để nhận mã OTP đặt lại mật khẩu.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Điểm tín nhiệm là gì?</h3>
                            <p className="text-gray-700 mt-2">
                                Điểm tín nhiệm phản ánh uy tín của người dùng dựa trên đánh giá từ các giao dịch.
                                Cần ≥ 80% để tham gia đấu giá (người mới không yêu cầu).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Câu hỏi về đấu giá */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về đấu giá</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Bước giá là gì?</h3>
                            <p className="text-gray-700 mt-2">
                                Bước giá là mức tăng tối thiểu mỗi lần đặt giá. Giá mới phải cao hơn
                                giá hiện tại ít nhất một bước giá.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Tôi có thể hủy giá đã đặt không?</h3>
                            <p className="text-gray-700 mt-2">
                                <strong>KHÔNG</strong>. Giá đấu có hiệu lực ngay và không thể hủy.
                                Hãy cân nhắc kỹ trước khi đặt giá.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Điều gì xảy ra khi tôi thắng đấu giá?</h3>
                            <p className="text-gray-700 mt-2">
                                Bạn sẽ nhận email thông báo. Bạn <strong>bắt buộc</strong> phải thanh toán
                                trong 3 ngày, nếu không sẽ bị giảm điểm tín nhiệm.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Tự động gia hạn là gì?</h3>
                            <p className="text-gray-700 mt-2">
                                Nếu có người đặt giá trong 5 phút cuối, thời gian đấu giá sẽ tự động
                                kéo dài thêm 5 phút (nếu người bán bật tính năng này).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Câu hỏi về bán hàng */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về bán hàng</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Ai có thể bán hàng?</h3>
                            <p className="text-gray-700 mt-2">
                                Chỉ tài khoản đã được nâng cấp thành "Người bán" mới có thể đăng sản phẩm.
                                Bạn có thể yêu cầu nâng cấp trong phần "Nâng cấp Người bán".
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Mất bao lâu để được duyệt làm Người bán?</h3>
                            <p className="text-gray-700 mt-2">
                                Thường trong vòng 24 giờ. Bạn sẽ nhận email thông báo khi được phê duyệt.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Tôi có thể hủy đấu giá sau khi đăng không?</h3>
                            <p className="text-gray-700 mt-2">
                                Không nên hủy sau khi đã có người đặt giá. Chỉ hủy trong trường hợp
                                đặc biệt và phải chấp nhận bị giảm uy tín.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Khi nào tôi nhận được tiền?</h3>
                            <p className="text-gray-700 mt-2">
                                Sau khi người mua xác nhận đã nhận hàng, tiền sẽ được chuyển vào tài khoản của bạn.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Câu hỏi về thanh toán */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về thanh toán & giao hàng</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Hỗ trợ những hình thức thanh toán nào?</h3>
                            <p className="text-gray-700 mt-2">
                                Chuyển khoản ngân hàng, ví điện tử, thanh toán trực tuyến qua cổng payment.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Ai chịu phí ship?</h3>
                            <p className="text-gray-700 mt-2">
                                Người mua và người bán tự thỏa thuận. Thông thường người mua chịu phí ship.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Nếu hàng bị hỏng khi nhận thì sao?</h3>
                            <p className="text-gray-700 mt-2">
                                Liên hệ ngay với người bán và TradeBidz để được hỗ trợ giải quyết tranh chấp.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Câu hỏi về bảo mật */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-4">Về bảo mật</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ Thông tin của tôi có an toàn không?</h3>
                            <p className="text-gray-700 mt-2">
                                Có. Chúng tôi sử dụng mã hóa SSL, hash mật khẩu và tuân thủ các tiêu chuẩn
                                bảo mật quốc tế.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-800">❓ TradeBidz có bán thông tin cá nhân không?</h3>
                            <p className="text-gray-700 mt-2">
                                <strong>KHÔNG</strong>. Chúng tôi không bao giờ bán hoặc cho thuê thông tin cá nhân.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-blue-50 border-l-4 border-blue-500 p-6">
                    <h3 className="font-bold text-lg mb-2">Không tìm thấy câu trả lời?</h3>
                    <p>Liên hệ với chúng tôi:</p>
                    <p className="mt-2"><strong>Email:</strong> tradebidz8386@gmail.com</p>
                    <p><strong>Hotline:</strong> 1900 1234</p>
                </section>
            </div>
        </div>
    );
};

export default FAQPage;
