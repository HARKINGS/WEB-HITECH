import React from 'react';
import './PolicyDetails.css'; // Tạo file CSS tương ứng

const PolicyDetails = () => {
    // Dữ liệu chi tiết cho từng chính sách
    // Bạn hãy chỉnh sửa nội dung này cho phù hợp với Electech
    const policyContent = [
        {
            id: 'mua-hang-tu-xa',
            title: 'Chi tiết Chính sách Mua hàng từ xa',
            content: (
                <>
                    <p>Electech hỗ trợ khách hàng trên toàn quốc mua sắm thuận tiện thông qua các kênh trực tuyến và điện thoại.</p>
                    <h4>1. Quy trình đặt hàng:</h4>
                    <ul>
                        <li><strong>Qua Website:</strong> Thêm sản phẩm vào giỏ hàng, điền đầy đủ thông tin giao hàng, chọn phương thức thanh toán và hoàn tất đơn hàng.</li>
                        <li><strong>Qua Điện thoại/Zalo/Fanpage:</strong> Cung cấp thông tin sản phẩm cần mua, thông tin nhận hàng và phương thức thanh toán cho nhân viên tư vấn.</li>
                    </ul>
                    <h4>2. Phương thức thanh toán:</h4>
                    <ul>
                        <li><strong>COD (Thanh toán khi nhận hàng):</strong> Áp dụng cho các đơn hàng có giá trị dưới [Số tiền nhất định, ví dụ: 20.000.000 VNĐ]. Khách hàng kiểm tra hàng và thanh toán trực tiếp cho nhân viên giao hàng.</li>
                        <li><strong>Chuyển khoản ngân hàng:</strong> Khách hàng chuyển khoản trước toàn bộ giá trị đơn hàng vào tài khoản được Electech chỉ định. Nội dung chuyển khoản ghi rõ Mã đơn hàng hoặc Số điện thoại.</li>
                        <li><strong>Thanh toán Online qua cổng VNPAY/Momo/...:</strong> (Nếu có) Thực hiện theo hướng dẫn trên website.</li>
                    </ul>
                    <h4>3. Xác nhận đơn hàng:</h4>
                    <p>Sau khi đặt hàng, bộ phận CSKH của Electech sẽ liên hệ lại với Quý khách qua điện thoại hoặc email để xác nhận đơn hàng và thông tin giao nhận trước khi tiến hành gửi hàng.</p>
                    <h4>4. Lưu ý:</h4>
                    <p>Quý khách vui lòng cung cấp thông tin chính xác để đảm bảo quá trình giao hàng diễn ra thuận lợi. Electech có quyền từ chối giao dịch nếu phát hiện thông tin không chính xác hoặc có dấu hiệu gian lận.</p>
                </>
            )
        },
        {
            id: 'doi-tra-san-pham',
            title: 'Chi tiết Chính sách Đổi trả sản phẩm',
            content: (
                <>
                    <p>Nhằm đảm bảo quyền lợi khách hàng, Electech áp dụng chính sách đổi trả sản phẩm linh hoạt.</p>
                    <h4>1. Điều kiện đổi/trả:</h4>
                    <ul>
                        <li>Sản phẩm lỗi do nhà sản xuất (cần có xác nhận của TTBH hãng hoặc Electech).</li>
                        <li>Sản phẩm giao sai mã, sai cấu hình, sai màu sắc so với đơn đặt hàng.</li>
                        <li>Sản phẩm còn nguyên vẹn tem niêm phong (nếu có), vỏ hộp, phụ kiện đi kèm, hóa đơn mua hàng.</li>
                        <li>Thời gian yêu cầu đổi trả: Trong vòng [Số ngày, ví dụ: 7 ngày] kể từ ngày nhận hàng.</li>
                    </ul>
                    <h4>2. Trường hợp không áp dụng đổi/trả:</h4>
                    <ul>
                        <li>Sản phẩm bị lỗi do người sử dụng (rơi vỡ, vào nước, sử dụng sai cách...).</li>
                        <li>Sản phẩm đã hết thời hạn đổi trả.</li>
                        <li>Sản phẩm không còn đầy đủ phụ kiện, vỏ hộp hoặc bị trầy xước, móp méo.</li>
                        <li>Các sản phẩm thuộc danh mục không áp dụng đổi trả (sẽ được ghi chú cụ thể).</li>
                    </ul>
                     <h4>3. Quy trình đổi/trả:</h4>
                     <ol>
                        <li>Liên hệ bộ phận CSKH của Electech qua hotline hoặc email để thông báo yêu cầu.</li>
                        <li>Cung cấp thông tin đơn hàng, tình trạng sản phẩm và lý do đổi/trả.</li>
                        <li>Mang sản phẩm cần đổi/trả (hoặc gửi qua đường bưu điện) đến cửa hàng/trung tâm bảo hành của Electech kèm đầy đủ giấy tờ.</li>
                        <li>Electech kiểm tra tình trạng sản phẩm và tiến hành đổi/trả hoặc hoàn tiền theo quy định.</li>
                     </ol>
                </>
            )
        },
        {
            id: 'huong-dan-mua-hang-truc-tuyen',
            title: 'Chi tiết Hướng dẫn Mua hàng trực tuyến',
             content: (
                <>
                    <p>Mua sắm dễ dàng tại Electech chỉ với vài bước đơn giản:</p>
                    <ol>
                        <li><strong>Bước 1: Tìm kiếm sản phẩm:</strong> Sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sản phẩm trên website.</li>
                        <li><strong>Bước 2: Xem thông tin sản phẩm:</strong> Nhấp vào sản phẩm để xem hình ảnh, mô tả chi tiết, thông số kỹ thuật và giá bán.</li>
                        <li><strong>Bước 3: Thêm vào giỏ hàng:</strong> Chọn số lượng (nếu cần) và nhấn nút "Thêm vào giỏ hàng".</li>
                        <li><strong>Bước 4: Kiểm tra giỏ hàng:</strong> Nhấp vào biểu tượng giỏ hàng để xem lại các sản phẩm đã chọn. Tại đây bạn có thể điều chỉnh số lượng hoặc xóa sản phẩm.</li>
                        <li><strong>Bước 5: Tiến hành đặt hàng:</strong> Nhấn nút "Tiến hành thanh toán" hoặc "Đặt hàng".</li>
                        <li><strong>Bước 6: Điền thông tin giao hàng:</strong> Cung cấp đầy đủ và chính xác họ tên, số điện thoại, địa chỉ nhận hàng và email.</li>
                        <li><strong>Bước 7: Chọn phương thức vận chuyển và thanh toán:</strong> Lựa chọn hình thức giao hàng và phương thức thanh toán phù hợp (COD, Chuyển khoản, Online...).</li>
                        <li><strong>Bước 8: Xác nhận và Hoàn tất:</strong> Kiểm tra lại toàn bộ thông tin đơn hàng và nhấn "Hoàn tất đơn hàng" hoặc "Đặt hàng". Hệ thống sẽ gửi email xác nhận đơn hàng cho bạn.</li>
                    </ol>
                    <p>Nếu gặp khó khăn, vui lòng liên hệ Hotline [Số Hotline] để được hỗ trợ trực tiếp.</p>
                </>
            )
        },
        // Thêm nội dung chi tiết cho các chính sách khác ở đây...
        // Ví dụ: Giao hàng, Bảo hành chung, Bảo hành đặc thù, Khiếu nại, Bảo mật, Hậu mãi, Khuyến mãi...
        {
            id: 'chinh-sach-giao-hang',
            title: 'Chi tiết Chính sách Giao hàng',
            content: <p>Nội dung chi tiết về chính sách giao hàng (phạm vi, thời gian, chi phí, đơn vị vận chuyển...) sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
         {
            id: 'chinh-sach-bao-hanh-chung',
            title: 'Chi tiết Chính sách Bảo hành chung',
            content: <p>Nội dung chi tiết về chính sách bảo hành chung (điều kiện, thời hạn, quy trình...) sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
         {
            id: 'bao-hanh-san-pham-dac-thu',
            title: 'Chi tiết Bảo hành Sản phẩm Đặc thù',
            content: <p>Nội dung chi tiết về chính sách bảo hành cho Laptop, PC, Linh kiện... sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
          {
            id: 'tiep-nhan-khieu-nai',
            title: 'Chi tiết Tiếp nhận & Giải quyết Khiếu nại',
            content: <p>Nội dung chi tiết về quy trình tiếp nhận và xử lý khiếu nại, phản ánh sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
         {
            id: 'chinh-sach-bao-mat',
            title: 'Chi tiết Chính sách Bảo mật Thông tin',
            content: <p>Nội dung chi tiết về cam kết bảo mật thông tin khách hàng sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
         {
            id: 'chinh-sach-hau-mai',
            title: 'Chi tiết Chính sách Hậu mãi & CSKH',
            content: <p>Nội dung chi tiết về các chương trình chăm sóc khách hàng sau bán hàng sẽ được cập nhật tại đây.</p> // Thay thế bằng nội dung thật
        },
         {
            id: 'tin-khuyen-mai',
            title: 'Chi tiết Điều khoản Chương trình Khuyến mãi',
            content: <p>Nội dung chi tiết về các điều khoản và điều kiện chung áp dụng cho các chương trình khuyến mãi sẽ được cập nhật tại đây. Các chương trình cụ thể vui lòng xem tại mục "Khuyến mãi".</p> // Thay thế bằng nội dung thật
        },

    ];

    return (
        <div className="policy-detail-container">
            <h1 className="policy-detail-title">Chi tiết Chính sách và Quy định tại Electech</h1>
            {policyContent.map((policy) => (
                // Mỗi section có một id tương ứng
                <section key={policy.id} id={policy.id} className="policy-section">
                    <h2>{policy.title}</h2>
                    <div className="policy-content-wrapper">
                        {policy.content}
                    </div>
                </section>
            ))}
        </div>
    );
}

export default PolicyDetails;