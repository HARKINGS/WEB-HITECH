import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { placeOrderAPI } from '../../services/orderService';
import { createZaloPayOrderAPI } from '../../services/zalopayService'; // THÊM IMPORT NÀY
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
    const [orderId, setOrderId] = useState(''); // Used for display, especially for bank transfer instructions and success message
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false); // Indicates if order process (for COD/Bank) is complete

    // --- State cho dữ liệu địa chỉ từ API ---
    const [provincesApi, setProvincesApi] = useState([]);
    const [districtsApi, setDistrictsApi] = useState([]);
    const [wardsApi, setWardsApi] = useState([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const [errorProvinces, setErrorProvinces] = useState(null);

    const formatCurrencyVND = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            // Assuming cartTotal is in a base unit, adjust if it's already formatted or needs conversion
            return '$0.00'; // Fallback or keep original $ format if VND is not primary
        }
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };


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

    // Generate a temporary ID for bank transfer instructions
    useEffect(() => {
        if (paymentMethod === 'bank_transfer' && !orderPlaced) {
            setOrderId(uuidv4().substring(0, 8).toUpperCase());
        } else if (paymentMethod !== 'bank_transfer') {
            // Clear if not bank transfer, or if order is already placed and ID is now from backend
            // This might be too aggressive if orderId is set by BE for other methods and we want to keep it.
            // Let's refine: only clear if it's not bank_transfer and no order has been placed.
            // If an order WAS placed (COD), orderId would be from BE.
            // The handleSubmit will set the definitive orderId.
             if (!orderPlaced) setOrderId('');
        }
    }, [paymentMethod, orderPlaced]);

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
            provinceName: provinceCode ? provinceName : '',
            districtCode: '',
            districtName: '',
            wardCode: '',
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
            wardCode: '',
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

const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    if (!formData.provinceCode || !formData.districtCode || !formData.wardCode || !formData.streetAddress) {
        alert("Vui lòng điền đầy đủ thông tin địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể).");
        return;
    }
    if (!formData.fullName || !formData.phone) {
        alert("Vui lòng điền đầy đủ Họ Tên và Số điện thoại.");
        return;
    }


    setIsSubmitting(true);

    // Bước 1: Tạo đơn hàng trong hệ thống của bạn (chung cho COD, Bank Transfer, ZaloPay)
    const shippingInfoPayload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        provinceName: formData.provinceName,
        districtName: formData.districtName,
        wardName: formData.wardName,
        street: formData.streetAddress, // Assuming backend expects 'street'
        // notes: formData.notes || null, // Add if backend supports it
    };

    const orderItemsPayload = cartItems.map(item => ({
        goodsId: item.id,
        quantity: item.quantity,
    }));

    const initialOrderPayload = {
        orderItems: orderItemsPayload,
        shippingInfo: shippingInfoPayload,
        paymentMethod: paymentMethod, // Sẽ là "cod", "bank_transfer", hoặc "zalopay"
        totalPrice: cartTotal,
        voucherId: null, // Placeholder
        totalDiscount: 0.0, // Placeholder
        // notes: formData.notes || null, // Add if backend supports it at root level
    };

    try {
        console.log('Initial Order Payload to BE:', JSON.stringify(initialOrderPayload, null, 2));
        const createdOrderInSystem = await placeOrderAPI(initialOrderPayload); // API tạo đơn hàng gốc
        console.log('Order created in system:', createdOrderInSystem);

        if (!createdOrderInSystem || !createdOrderInSystem.id) {
            throw new Error("Failed to create order in system or missing order ID.");
        }

        const systemOrderId = createdOrderInSystem.id.toString(); // ID đơn hàng của bạn

        // Bước 2: Xử lý theo phương thức thanh toán
        if (paymentMethod === 'cod' || paymentMethod === 'bank_transfer') {
            let finalDisplayOrderId = systemOrderId;
            if (paymentMethod === 'bank_transfer') {
                // Use transactionId from backend if available, otherwise systemOrderId.
                // The UUID in 'orderId' state was for pre-submit display.
                finalDisplayOrderId = createdOrderInSystem.transactionId || systemOrderId;
            } else { // COD
                 finalDisplayOrderId = createdOrderInSystem.transactionId || systemOrderId; // Use transactionId if BE provides one for COD too
            }
            setOrderId(finalDisplayOrderId); // Update state with the definitive ID from backend
            setOrderPlaced(true);
            clearCart();

        } else if (paymentMethod === 'zalopay') {
            // Gọi API khởi tạo thanh toán ZaloPay
            const zaloPayInitData = {
                // Backend should use systemOrderId to find/create the ZaloPay transaction
                // The `orderId` here is the one that `placeOrderAPI` just created.
                // It's the ID of the order in *our* system.
                appOrderSn: systemOrderId, // Or whatever field your ZaloPay API expects for your internal order ID
                amount: Math.round(cartTotal), // ZaloPay yêu cầu amount là Long (integer)
                description: `Thanh toán cho đơn hàng ${systemOrderId}`
            };
            console.log("Requesting ZaloPay payment with data:", zaloPayInitData);
            const zaloPayResponse = await createZaloPayOrderAPI(zaloPayInitData);
            console.log("ZaloPay init response:", zaloPayResponse);

            if (zaloPayResponse && zaloPayResponse.order_url) {
                // Backend should have linked createdOrderInSystem.id with zaloPayResponse.app_trans_id (or similar ZaloPay transaction ID)
                // Optionally, set orderId state to something from ZaloPay if needed for immediate display (though usually not)
                // setOrderId(zaloPayResponse.app_trans_id || systemOrderId);

                // Điều hướng người dùng đến ZaloPay
                window.location.href = zaloPayResponse.order_url;
                // Không clearCart() hay setOrderPlaced(true) ở đây.
                // Việc này sẽ được xử lý sau khi có callback thành công từ ZaloPay.
            } else {
                throw new Error(zaloPayResponse.return_message || "Không thể khởi tạo thanh toán ZaloPay. Vui lòng thử lại hoặc chọn phương thức khác.");
            }
        }

    } catch (error) {
        console.error('Order processing failed:', error);
        let errorMessage = "Xử lý đơn hàng thất bại. Vui lòng thử lại.";
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                 errorMessage = `Lỗi: ${error.response.data}`;
            } else if (error.response.data.message) { // Common for Spring Boot RestControllerAdvice
                 errorMessage = `Lỗi: ${error.response.data.message}`;
            } else if (error.response.data.error) { // Another common pattern
                 errorMessage = `Lỗi: ${error.response.data.error}`;
            }  else if (error.response.statusText) {
                errorMessage = `Lỗi: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.message) {
            errorMessage = `Lỗi: ${error.message}`;
        }
        alert(errorMessage);
        // Không setOrderPlaced(true) nếu có lỗi, setIsSubmitting will be handled in finally
    } finally {
        setIsSubmitting(false);
    }
};


    // This success message is for COD and Bank Transfer (immediate confirmation)
    // ZaloPay success will be handled on a return URL page.
    if (orderPlaced && (paymentMethod === 'cod' || paymentMethod === 'bank_transfer')) {
        const fullAddress = `${formData.streetAddress}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`;
        return (
            <div className="checkout-page container">
                <div className="order-success-message">
                    <h2>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng. {paymentMethod === 'bank_transfer' ? `Mã đơn hàng của bạn là:` : `Đơn hàng của bạn đã được ghi nhận. Mã đơn hàng:`} <strong>{orderId || 'N/A'}</strong></p>
                    <p>Địa chỉ giao hàng: <strong>{fullAddress}</strong></p>
                    {paymentMethod === 'bank_transfer' && orderId && (
                         <div className="bank-details-summary">
                            <h4>Vui lòng chuyển khoản với nội dung:</h4>
                            <p className="order-id-highlight">{orderId}</p> {/* This orderId is now from BE */}
                            <p>Ngân hàng: [Tên Ngân Hàng Của Bạn]</p>
                            <p>Số tài khoản: [Số Tài Khoản Của Bạn]</p>
                            <p>Chủ tài khoản: [Tên Chủ Tài Khoản]</p>
                         </div>
                    )}
                    <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
                     <button onClick={() => { /* clearCart() is already done in handleSubmit */; window.location.href = '/'; }} className="btn btn-secondary">Tiếp tục mua sắm</button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !orderPlaced) { // If cart becomes empty NOT due to successful order (e.g. user navigates away and back)
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
                                        {/* This orderId is the temporary UUID for instruction */}
                                        <p className="order-id-highlight">{orderId || 'Đang tạo ID...'}</p>
                                        <hr/>
                                        <p><strong>Ngân hàng:</strong> [Tên Ngân Hàng Của Bạn]</p>
                                        <p><strong>Số tài khoản:</strong> [Số Tài Khoản Của Bạn]</p>
                                        <p><strong>Chủ tài khoản:</strong> [Tên Chủ Tài Khoản]</p>
                                        <p className="note">Đơn hàng của bạn sẽ được xử lý sau khi chúng tôi xác nhận đã nhận được thanh toán.</p>
                                    </div>
                                )}
                            </div>
                            <div className="payment-option"> {/* ZALOPAY OPTION */}
                                <input type="radio" id="zalopay" name="paymentMethod" value="zalopay"
                                       checked={paymentMethod === 'zalopay'} onChange={handlePaymentChange} />
                                <label htmlFor="zalopay">
                                    Thanh toán qua ZaloPay
                                    <p className="payment-description">Sử dụng ví ZaloPay hoặc ứng dụng ngân hàng hỗ trợ ZaloPay QR.</p>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary place-order-btn" disabled={isSubmitting || cartItems.length === 0}>
                            {isSubmitting ? 'Đang xử lý...' : (paymentMethod === 'zalopay' ? 'Tiếp tục với ZaloPay' : 'Đặt hàng')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;