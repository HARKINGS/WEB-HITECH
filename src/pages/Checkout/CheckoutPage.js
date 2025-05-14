import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { v4 as uuidv4 } from 'uuid';
import './CheckoutPage.css';

// --- API Base URL ---
const API_BASE_URL = 'https://provinces.open-api.vn/api';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        provinceCode: '', // Sẽ lưu mã tỉnh/thành phố
        provinceName: '', // Sẽ lưu tên tỉnh/thành phố
        districtCode: '', // Sẽ lưu mã quận/huyện
        districtName: '', // Sẽ lưu tên quận/huyện
        wardCode: '',     // Sẽ lưu mã phường/xã
        wardName: '',     // Sẽ lưu tên phường/xã
        streetAddress: '',
        notes: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderId, setOrderId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // --- State cho dữ liệu địa chỉ từ API ---
    const [provincesApi, setProvincesApi] = useState([]);
    const [districtsApi, setDistrictsApi] = useState([]);
    const [wardsApi, setWardsApi] = useState([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const [errorProvinces, setErrorProvinces] = useState(null);
    // (Bạn có thể thêm errorDistricts, errorWards nếu cần xử lý lỗi chi tiết hơn)

    // --- Fetch Provinces ---
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            setErrorProvinces(null);
            try {
                const response = await fetch(`${API_BASE_URL}/p/`);
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách tỉnh/thành phố');
                }
                const data = await response.json();
                setProvincesApi(data || []);
            } catch (error) {
                console.error("Lỗi fetch tỉnh/thành phố:", error);
                setErrorProvinces(error.message);
            }
            setLoadingProvinces(false);
        };
        fetchProvinces();
    }, []);

    // --- Fetch Districts khi provinceCode thay đổi ---
    useEffect(() => {
        if (formData.provinceCode) {
            const fetchDistricts = async () => {
                setLoadingDistricts(true);
                setDistrictsApi([]); // Reset
                setWardsApi([]); // Reset
                try {
                    const response = await fetch(`${API_BASE_URL}/p/${formData.provinceCode}?depth=2`);
                    if (!response.ok) {
                        throw new Error('Không thể tải danh sách quận/huyện');
                    }
                    const data = await response.json();
                    setDistrictsApi(data.districts || []);
                } catch (error) {
                    console.error("Lỗi fetch quận/huyện:", error);
                }
                setLoadingDistricts(false);
            };
            fetchDistricts();
        } else {
            setDistrictsApi([]);
            setWardsApi([]);
        }
    }, [formData.provinceCode]);

    // --- Fetch Wards khi districtCode thay đổi ---
    useEffect(() => {
        if (formData.districtCode) {
            const fetchWards = async () => {
                setLoadingWards(true);
                setWardsApi([]); // Reset
                try {
                    const response = await fetch(`${API_BASE_URL}/d/${formData.districtCode}?depth=2`);
                    if (!response.ok) {
                        throw new Error('Không thể tải danh sách phường/xã');
                    }
                    const data = await response.json();
                    setWardsApi(data.wards || []);
                } catch (error) {
                    console.error("Lỗi fetch phường/xã:", error);
                }
                setLoadingWards(false);
            };
            fetchWards();
        } else {
            setWardsApi([]);
        }
    }, [formData.districtCode]);


    useEffect(() => {
        if (paymentMethod === 'bank_transfer') {
            setOrderId(uuidv4().substring(0, 8).toUpperCase());
        } else {
            setOrderId('');
        }
    }, [paymentMethod]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({
            ...prevState,
            provinceCode: provinceCode,
            provinceName: provinceCode ? provinceName : '', // Chỉ lấy tên nếu có code
            districtCode: '', // Reset quận/huyện
            districtName: '',
            wardCode: '',     // Reset phường/xã
            wardName: '',
        }));
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const districtName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({
            ...prevState,
            districtCode: districtCode,
            districtName: districtCode ? districtName : '',
            wardCode: '', // Reset phường/xã
            wardName: '',
        }));
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({
            ...prevState,
            wardCode: wardCode,
            wardName: wardCode ? wardName : '',
        }));
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        // Kiểm tra các trường địa chỉ bắt buộc
        if (!formData.provinceCode || !formData.districtCode || !formData.wardCode || !formData.streetAddress) {
            alert("Vui lòng điền đầy đủ thông tin địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể).");
            return;
        }

        setIsSubmitting(true);
        console.log('Processing order...');

        const orderDetails = {
            customerInfo: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: {
                    provinceName: formData.provinceName,
                    districtName: formData.districtName,
                    wardName: formData.wardName,
                    street: formData.streetAddress,
                    // Bạn có thể gửi cả code nếu backend cần
                    // provinceCode: formData.provinceCode,
                    // districtCode: formData.districtCode,
                    // wardCode: formData.wardCode,
                },
                notes: formData.notes,
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: cartTotal,
            paymentMethod: paymentMethod,
            orderId: paymentMethod === 'bank_transfer' ? orderId : null,
            orderDate: new Date().toISOString(),
            status: 'Pending',
        };

        console.log('Order Details to be sent:', orderDetails);

        setTimeout(() => {
            console.log('Order placed successfully!');
            setIsSubmitting(false);
            setOrderPlaced(true);
             // clearCart(); // Xem xét việc xóa giỏ hàng ở đây hoặc sau khi người dùng xác nhận đã xem thông báo
        }, 1000);
    };

    if (orderPlaced) {
        const fullAddress = `${formData.streetAddress}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`;
        return (
            <div className="checkout-page container">
                <div className="order-success-message">
                    <h2>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <strong>{orderId || 'N/A (COD)'}</strong></p>
                    <p>Địa chỉ giao hàng: <strong>{fullAddress}</strong></p>
                    {paymentMethod === 'bank_transfer' && orderId && (
                         <div className="bank-details-summary">
                            <h4>Vui lòng chuyển khoản với nội dung:</h4>
                            <p className="order-id-highlight">{orderId}</p>
                            <p>Ngân hàng: [Tên Ngân Hàng Của Bạn]</p>
                            <p>Số tài khoản: [Số Tài Khoản Của Bạn]</p>
                            <p>Chủ tài khoản: [Tên Chủ Tài Khoản]</p>
                         </div>
                    )}
                    <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
                     <button onClick={() => { clearCart(); window.location.href = '/'; }} className="btn btn-secondary">Tiếp tục mua sắm</button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !orderPlaced) {
         return (
            <div className="checkout-page container">
                <h2>Thanh toán</h2>
                <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                 <button onClick={() => window.location.href = '/shop'} className="btn btn-primary">Quay lại cửa hàng</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h2>Thanh toán</h2>
                <form onSubmit={handleSubmit} className="checkout-form-layout">
                    <div className="billing-details">
                        <h3>Thông tin giao hàng</h3>
                        <div className="form-group">
                            <label htmlFor="fullName">Họ và Tên *</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Nhập tên người nhận" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại *</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email (Tùy chọn)</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Nhập địa chỉ email" />
                        </div>

                        {/* --- Tỉnh/Thành phố --- */}
                        <div className="form-group">
                            <label htmlFor="province">Tỉnh/Thành phố *</label>
                            <select id="province" name="provinceCode" value={formData.provinceCode} onChange={handleProvinceChange} required disabled={loadingProvinces}>
                                <option value="" disabled>{loadingProvinces ? "Đang tải..." : "-- Chọn Tỉnh/Thành phố --"}</option>
                                {errorProvinces && <option value="" disabled>Lỗi: {errorProvinces}</option>}
                                {provincesApi.map(province => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* --- Quận/Huyện --- */}
                        <div className="form-group">
                            <label htmlFor="district">Quận/Huyện *</label>
                            <select id="district" name="districtCode" value={formData.districtCode} onChange={handleDistrictChange} required disabled={!formData.provinceCode || loadingDistricts || districtsApi.length === 0}>
                                <option value="" disabled>{loadingDistricts ? "Đang tải..." : (formData.provinceCode ? "-- Chọn Quận/Huyện --" : "Vui lòng chọn Tỉnh/Thành")}</option>
                                {districtsApi.map(district => (
                                    <option key={district.code} value={district.code}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* --- Phường/Xã --- */}
                        <div className="form-group">
                            <label htmlFor="ward">Phường/Xã *</label>
                            <select id="ward" name="wardCode" value={formData.wardCode} onChange={handleWardChange} required disabled={!formData.districtCode || loadingWards || wardsApi.length === 0}>
                                <option value="" disabled>{loadingWards ? "Đang tải..." : (formData.districtCode ? "-- Chọn Phường/Xã --" : "Vui lòng chọn Quận/Huyện")}</option>
                                {wardsApi.map(ward => (
                                    <option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="streetAddress">Địa chỉ cụ thể (Số nhà, Tên đường) *</label>
                            <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required placeholder="Ví dụ: 123 Đường ABC" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Ghi chú đơn hàng (Tùy chọn)</label>
                            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Thêm ghi chú..."></textarea>
                        </div>
                    </div>

                    <div className="order-summary-payment">
                        <h3>Đơn hàng của bạn</h3>
                        <div className="order-summary-box">
                            {cartItems.length > 0 ? (
                                <ul className="order-items-list">
                                    {cartItems.map(item => (
                                        <li key={item.id} className="order-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-quantity">x {item.quantity}</span>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Giỏ hàng trống.</p>
                            )}
                            <div className="order-total">
                                <span>Tổng cộng:</span>
                                <span className="total-amount">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="payment-method">
                            <h4>Phương thức thanh toán</h4>
                            <div className="payment-option">
                                <input type="radio" id="cod" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentChange} />
                                <label htmlFor="cod">
                                     Thanh toán khi nhận hàng (COD)
                                     <p className="payment-description">Trả tiền mặt trực tiếp cho nhân viên giao hàng khi bạn nhận được sản phẩm.</p>
                                </label>
                            </div>
                            <div className="payment-option">
                                <input type="radio" id="bank_transfer" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={handlePaymentChange} />
                                <label htmlFor="bank_transfer">
                                    Chuyển khoản ngân hàng
                                    <p className="payment-description">Thực hiện thanh toán trực tiếp vào tài khoản ngân hàng của chúng tôi.</p>
                                </label>
                                {paymentMethod === 'bank_transfer' && (
                                    <div className="bank-transfer-details">
                                        <p>Vui lòng chuyển khoản với nội dung (ghi chú):</p>
                                        <p className="order-id-highlight">{orderId || 'Đang tạo ID...'}</p>
                                        <hr/>
                                        <p><strong>Ngân hàng:</strong> [Tên Ngân Hàng Của Bạn]</p>
                                        <p><strong>Số tài khoản:</strong> [Số Tài Khoản Của Bạn]</p>
                                        <p><strong>Chủ tài khoản:</strong> [Tên Chủ Tài Khoản]</p>
                                        <p className="note">Đơn hàng của bạn sẽ được xử lý sau khi chúng tôi xác nhận đã nhận được thanh toán.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary place-order-btn" disabled={isSubmitting || cartItems.length === 0}>
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;