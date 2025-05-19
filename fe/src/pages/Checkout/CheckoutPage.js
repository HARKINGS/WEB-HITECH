// src/pages/Checkout/CheckoutPage.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { placeOrderAPI } from '../../services/orderService';
import { createZaloPayOrderAPI } from '../../services/zalopayService';
import { getVoucherByIdAPI } from '../../services/voucherService';
import { v4 as uuidv4 } from 'uuid';
import './CheckoutPage.css';

// --- API Base URL ---
const API_BASE_URL = 'https://provinces.open-api.vn/api';

const CheckoutPage = () => {
    const { cartItems, cartTotal: originalCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        provinceCode: '',
        provinceName: '',
        districtCode: '',
        districtName: '',
        wardCode: '',
        wardName: '',
        streetAddress: '',
        notes: '',
    });

    // Cập nhật giá trị khởi tạo và các giá trị sẽ sử dụng cho paymentMethod
    // để khớp với enum backend: CASH, VNPAY, ZALOPAY
    const [paymentMethod, setPaymentMethod] = useState('CASH'); // Giá trị mặc định là CASH (COD)
    const [orderIdForDisplay, setOrderIdForDisplay] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [provincesApi, setProvincesApi] = useState([]);
    const [districtsApi, setDistrictsApi] = useState([]);
    const [wardsApi, setWardsApi] = useState([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [errorProvinces, setErrorProvinces] = useState(null);

    const [voucherCodeInput, setVoucherCodeInput] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherMessage, setVoucherMessage] = useState({ type: '', text: '' });
    const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

    const formatCurrencyVND = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0 ₫';
        }
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    // Tính toán tổng tiền cuối cùng dựa trên originalCartTotal và voucher
    // Ghi chú: Logic parse voucher description/name hiện tại khá phức tạp và phụ thuộc vào định dạng string.
    // Nếu có thể, việc sử dụng các trường cụ thể từ API (ví dụ: discountType, discountValue, minimumOrderAmount)
    // sẽ làm code rõ ràng và dễ bảo trì hơn.
    // Hiện tại, logic kiểm tra minimumOrderAmount trong finalTotalPrice và handleApplyVoucher có thể chưa hoàn toàn đồng bộ
    // (một bên parse string, một bên dùng trường số từ API).
    const finalTotalPrice = useMemo(() => {
        if (appliedVoucher && appliedVoucher.validated) {
            let discountAmount = 0;
            const description = appliedVoucher.voucherDescription?.toLowerCase() || "";
            const name = appliedVoucher.voucherName?.toUpperCase() || "";

            // VÍ DỤ 1: Voucher GIAM10PHANTRAM (Giảm 10% cho đơn từ 500k)
            if (name === 'GIAM10PHANTRAM' || description.includes("giảm 10% cho đơn hàng từ 500000 vnd")) {
                if (originalCartTotal >= 500000) { // Điều kiện này nên được xác nhận từ appliedVoucher.minimumOrderAmount nếu có
                    discountAmount = originalCartTotal * 0.10;
                } else {
                    console.warn("Voucher GIAM10PHANTRAM không đủ điều kiện đơn hàng tối thiểu (kiểm tra lại trong finalTotalPrice).");
                    return originalCartTotal;
                }
            }
            // VÍ DỤ 2: Voucher GIAM50K (Giảm trực tiếp 50k cho đơn từ 200k)
            else if (name === 'GIAM50K' || description.includes("giảm trực tiếp 50000 vnd cho đơn từ 200000 vnd")) {
                if (originalCartTotal >= 200000) {
                    discountAmount = 50000;
                } else {
                    console.warn("Voucher GIAM50K không đủ điều kiện đơn hàng tối thiểu (kiểm tra lại trong finalTotalPrice).");
                    return originalCartTotal;
                }
            }
            // VÍ DỤ 3: Voucher SALE20MAX100K (Giảm 20% tối đa 100k cho đơn từ 300k)
            else if (name === 'SALE20MAX100K' || description.includes("giảm 20% tối đa 100000 vnd cho đơn từ 300000 vnd")) {
                if (originalCartTotal >= 300000) {
                    let twentyPercent = originalCartTotal * 0.20;
                    discountAmount = Math.min(twentyPercent, 100000);
                } else {
                    console.warn("Voucher SALE20MAX100K không đủ điều kiện đơn hàng tối thiểu (kiểm tra lại trong finalTotalPrice).");
                    return originalCartTotal;
                }
            }
            // VÍ DỤ 4: Voucher WELCOME5 (Giảm 5% cho mọi đơn hàng)
            else if (name === 'WELCOME5' || description.includes("giảm 5% cho mọi đơn hàng")) {
                discountAmount = originalCartTotal * 0.05;
            }
            // THÊM CÁC TRƯỜNG HỢP VOUCHER KHÁC CỦA BẠN VÀO ĐÂY

            discountAmount = Math.min(discountAmount, originalCartTotal);
            return Math.max(0, originalCartTotal - discountAmount);
        }
        return originalCartTotal;
    }, [originalCartTotal, appliedVoucher]);

    const totalDiscountAmount = useMemo(() => {
        return originalCartTotal - finalTotalPrice;
    }, [originalCartTotal, finalTotalPrice]);

    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            setErrorProvinces(null);
            try {
                const response = await fetch(`${API_BASE_URL}/p/`);
                if (!response.ok) throw new Error('Không thể tải danh sách tỉnh/thành phố');
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

    useEffect(() => {
        if (formData.provinceCode) {
            const fetchDistricts = async () => {
                setLoadingDistricts(true);
                setDistrictsApi([]); setWardsApi([]);
                try {
                    const response = await fetch(`${API_BASE_URL}/p/${formData.provinceCode}?depth=2`);
                    if (!response.ok) throw new Error('Không thể tải danh sách quận/huyện');
                    const data = await response.json();
                    setDistrictsApi(data.districts || []);
                } catch (error) { console.error("Lỗi fetch quận/huyện:", error); }
                setLoadingDistricts(false);
            };
            fetchDistricts();
        } else {
            setDistrictsApi([]); setWardsApi([]);
        }
    }, [formData.provinceCode]);

    useEffect(() => {
        if (formData.districtCode) {
            const fetchWards = async () => {
                setLoadingWards(true); setWardsApi([]);
                try {
                    const response = await fetch(`${API_BASE_URL}/d/${formData.districtCode}?depth=2`);
                    if (!response.ok) throw new Error('Không thể tải danh sách phường/xã');
                    const data = await response.json();
                    setWardsApi(data.wards || []);
                } catch (error) { console.error("Lỗi fetch phường/xã:", error); }
                setLoadingWards(false);
            };
            fetchWards();
        } else {
            setWardsApi([]);
        }
    }, [formData.districtCode]);

    useEffect(() => {
        // Sử dụng 'VNPAY' cho bank transfer
        if (paymentMethod === 'VNPAY' && !orderPlaced) {
            setOrderIdForDisplay(uuidv4().substring(0, 8).toUpperCase());
        } else if (paymentMethod !== 'VNPAY' && !orderPlaced) {
            setOrderIdForDisplay('');
        }
    }, [paymentMethod, orderPlaced]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({
            ...prevState,
            provinceCode: provinceCode, provinceName: provinceCode ? provinceName : '',
            districtCode: '', districtName: '', wardCode: '', wardName: '',
        }));
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const districtName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({
            ...prevState,
            districtCode: districtCode, districtName: districtCode ? districtName : '',
            wardCode: '', wardName: '',
        }));
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = e.target.options[e.target.selectedIndex].text;
        setFormData(prevState => ({ ...prevState, wardCode: wardCode, wardName: wardCode ? wardName : '' }));
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleApplyVoucher = useCallback(async () => {
        if (!voucherCodeInput.trim()) {
            setVoucherMessage({ type: 'error', text: 'Vui lòng nhập mã voucher.' });
            return;
        }
        setIsCheckingVoucher(true);
        setVoucherMessage({ type: '', text: '' });
        setAppliedVoucher(null);

        try {
            const voucherData = await getVoucherByIdAPI(voucherCodeInput.trim());
            if (voucherData && voucherData.voucherId) {
                const today = new Date(); today.setHours(0,0,0,0);
                const expiryDate = new Date(voucherData.expiryDate); expiryDate.setHours(0,0,0,0);

                if (expiryDate < today) {
                    setVoucherMessage({ type: 'error', text: `Mã voucher "${voucherCodeInput}" đã hết hạn.` });
                    return;
                }
                if (voucherData.quantity !== null && voucherData.quantity <= 0) {
                    setVoucherMessage({ type: 'error', text: `Mã voucher "${voucherCodeInput}" đã hết lượt sử dụng.` });
                    return;
                }
                // Kiểm tra điều kiện đơn hàng tối thiểu dựa trên trường `minimumOrderAmount` từ API
                if (voucherData.minimumOrderAmount && originalCartTotal < voucherData.minimumOrderAmount) {
                    setVoucherMessage({
                        type: 'error',
                        text: `Đơn hàng chưa đủ ${formatCurrencyVND(voucherData.minimumOrderAmount)} để áp dụng voucher "${voucherData.voucherName}".`
                    });
                    return;
                }
                setAppliedVoucher({ ...voucherData, validated: true });
                setVoucherMessage({ type: 'success', text: `Áp dụng voucher "${voucherData.voucherName}" thành công!` });
            } else {
                setVoucherMessage({ type: 'error', text: `Mã voucher "${voucherCodeInput}" không hợp lệ.` });
            }
        } catch (error) {
            console.error("Lỗi áp dụng voucher:", error);
            let errorText = `Không tìm thấy hoặc có lỗi với voucher "${voucherCodeInput}".`;
            if (error.response?.data?.message) errorText = error.response.data.message;
            else if (error.message) errorText = error.message;
            setVoucherMessage({ type: 'error', text: errorText });
        } finally {
            setIsCheckingVoucher(false);
        }
    }, [voucherCodeInput, originalCartTotal, formatCurrencyVND]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) { alert("Giỏ hàng của bạn đang trống!"); return; }
        if (!formData.provinceCode || !formData.districtCode || !formData.wardCode || !formData.streetAddress) {
            alert("Vui lòng điền đầy đủ thông tin địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể)."); return;
        }
        if (!formData.fullName || !formData.phone) { alert("Vui lòng điền đầy đủ Họ Tên và Số điện thoại."); return; }

        setIsSubmitting(true);

        // const shippingInfoPayload = {
        //     fullName: formData.fullName, phone: formData.phone, email: formData.email || null,
        //     provinceName: formData.provinceName, districtName: formData.districtName, wardName: formData.wardName,
        //     street: formData.streetAddress, notes: formData.notes || null,
        // };
        const fullAddressString = `${formData.streetAddress}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`;

        const orderItemsPayload = cartItems.map(item => ({ goodsId: item.id, quantity: item.quantity, unitPrice: item.price }));
        const orderPayload = {
            orderItems: orderItemsPayload,
            shippingAddress: fullAddressString, // Gửi dạng chuỗi
            paymentMethod: paymentMethod,
            totalPrice: finalTotalPrice,
            voucherId: appliedVoucher?.validated ? appliedVoucher.voucherId : null,
            totalDiscount: totalDiscountAmount,
            // notes: formData.notes || null, // Trường này có thể không được BE xử lý nếu nó mong đợi address là string
        };

        try {
            console.log('Order Payload to BE:', JSON.stringify(orderPayload, null, 2));
            const createdOrderInSystem = await placeOrderAPI(orderPayload);
            console.log('Order created in system:', createdOrderInSystem);

            if (!createdOrderInSystem || !createdOrderInSystem.id) {
                throw new Error("Không thể tạo đơn hàng trong hệ thống hoặc thiếu ID đơn hàng.");
            }

            const systemOrderId = createdOrderInSystem.id.toString();
            let displayId = systemOrderId;
            if (createdOrderInSystem.transactionId) {
                displayId = createdOrderInSystem.transactionId;
            } else if (paymentMethod === 'VNPAY' && orderIdForDisplay && !createdOrderInSystem.transactionId) {
                displayId = orderIdForDisplay; // Giữ UUID nếu là VNPAY và BE không trả transactionId
            }
            setOrderIdForDisplay(displayId);

            // Sử dụng CASH, VNPAY, ZALOPAY
            if (paymentMethod === 'CASH' || paymentMethod === 'VNPAY') {
                setOrderPlaced(true);
                clearCart();
            } else if (paymentMethod === 'ZALOPAY') {
                const zaloPayInitData = {
                    appOrderSn: systemOrderId,
                    amount: Math.round(finalTotalPrice),
                    description: `Thanh toán cho đơn hàng ${systemOrderId}`
                };
                const zaloPayResponse = await createZaloPayOrderAPI(zaloPayInitData);
                if (zaloPayResponse && zaloPayResponse.order_url) {
                    window.location.href = zaloPayResponse.order_url;
                } else {
                    throw new Error(zaloPayResponse.return_message || "Không thể khởi tạo thanh toán ZaloPay.");
                }
            }
        } catch (error) {
            console.error('Order processing failed:', error);
            let errorMessage = "Xử lý đơn hàng thất bại. Vui lòng thử lại.";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') errorMessage = `Lỗi: ${error.response.data}`;
                else if (error.response.data.message) errorMessage = `Lỗi: ${error.response.data.message}`;
                else if (error.response.data.error) errorMessage = `Lỗi: ${error.response.data.error}`;
                else if (error.response.statusText) errorMessage = `Lỗi: ${error.response.status} ${error.response.statusText}`;
            } else if (error.message) {
                errorMessage = `Lỗi: ${error.message}`;
            }
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Trang thành công cho CASH (COD) và VNPAY (Bank Transfer)
    if (orderPlaced && (paymentMethod === 'CASH' || paymentMethod === 'VNPAY')) {
        const fullAddress = `${formData.streetAddress}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`;
        return (
            <div className="checkout-page container">
                <div className="order-success-message">
                    <h2>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng. {paymentMethod === 'VNPAY' ? `Mã đơn hàng của bạn là:` : `Đơn hàng của bạn đã được ghi nhận. Mã đơn hàng:`} <strong>{orderIdForDisplay || 'N/A'}</strong></p>
                    <p>Địa chỉ giao hàng: <strong>{fullAddress}</strong></p>
                    {paymentMethod === 'VNPAY' && orderIdForDisplay && (
                         <div className="bank-details-summary">
                            <h4>Vui lòng chuyển khoản với nội dung:</h4>
                            <p className="order-id-highlight">{orderIdForDisplay}</p>
                            <p>Ngân hàng: [Tên Ngân Hàng Của Bạn]</p>
                            <p>Số tài khoản: [Số Tài Khoản Của Bạn]</p>
                            <p>Chủ tài khoản: [Tên Chủ Tài Khoản]</p>
                         </div>
                    )}
                    <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
                     <button onClick={() => {navigate('/shop'); }} className="btn btn-secondary btn-continue-shopping">Tiếp tục mua sắm</button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !orderPlaced) {
         return (
            <div className="checkout-page container">
                <h2>Thanh toán</h2>
                <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                 <button onClick={() => navigate('/shop')} className="btn btn-primary">Quay lại cửa hàng</button>
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
                        {/* ... Form input fields for address (giữ nguyên) ... */}
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
                                            <span className="item-price">{formatCurrencyVND(item.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : ( <p>Giỏ hàng trống.</p> )}

                            <div className="voucher-section">
                                <h4>Mã giảm giá</h4>
                                <div className="voucher-input-group">
                                    <input type="text" placeholder="Nhập mã voucher" value={voucherCodeInput}
                                        onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                                        className="voucher-input" disabled={isCheckingVoucher} />
                                    <button type="button" onClick={handleApplyVoucher} className="btn btn-apply-voucher"
                                        disabled={isCheckingVoucher || !voucherCodeInput.trim()}>
                                        {isCheckingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                                    </button>
                                </div>
                                {voucherMessage.text && ( <p className={`voucher-message ${voucherMessage.type}`}>{voucherMessage.text}</p> )}
                                {appliedVoucher?.validated && voucherMessage.type === 'success' && (
                                    <div className="applied-voucher-info">
                                        <p>Đã áp dụng: {appliedVoucher.voucherName}
                                           {appliedVoucher.voucherDescription && ` - ${appliedVoucher.voucherDescription}`}
                                        </p>
                                        <button type="button" onClick={() => { setAppliedVoucher(null); setVoucherMessage({ type: '', text: '' }); setVoucherCodeInput(''); }} className="btn-remove-voucher">Xóa voucher</button>
                                    </div>
                                )}
                            </div>

                            {originalCartTotal !== finalTotalPrice && (
                                <div className="order-total-row">
                                    <span>Tạm tính:</span>
                                    <span className="original-total-amount">{formatCurrencyVND(originalCartTotal)}</span>
                                </div>
                            )}
                            {totalDiscountAmount > 0 && (
                                 <div className="order-total-row discount-row">
                                    <span>Giảm giá:</span>
                                    <span className="discount-amount">-{formatCurrencyVND(totalDiscountAmount)}</span>
                                </div>
                            )}
                            <div className="order-total-row final-total-row">
                                <span>Tổng cộng:</span>
                                <span className="final-total-amount">{formatCurrencyVND(finalTotalPrice)}</span>
                            </div>
                        </div>

                        <div className="payment-method">
                            <h4>Phương thức thanh toán</h4>
                            <div className="payment-option">
                                <input type="radio" id="cod" name="paymentMethod" value="CASH"
                                       checked={paymentMethod === 'CASH'} onChange={handlePaymentChange} />
                                <label htmlFor="cod">
                                     Thanh toán khi nhận hàng (COD)
                                     <p className="payment-description">Trả tiền mặt trực tiếp cho nhân viên giao hàng.</p>
                                </label>
                            </div>
                            <div className="payment-option">
                                {/* value="VNPAY" cho Chuyển khoản ngân hàng */}
                                <input type="radio" id="bank_transfer" name="paymentMethod" value="VNPAY"
                                       checked={paymentMethod === 'VNPAY'} onChange={handlePaymentChange} />
                                <label htmlFor="bank_transfer">
                                    Chuyển khoản ngân hàng (VNPAY Gateway hoặc tương tự)
                                    <p className="payment-description">Thực hiện thanh toán qua cổng VNPAY hoặc chuyển khoản trực tiếp.</p>
                                </label>
                                {/* Hiển thị chi tiết nếu là VNPAY (chuyển khoản) */}
                                {paymentMethod === 'VNPAY' && (
                                    <div className="bank-transfer-details">
                                        <p>Vui lòng chuyển khoản với nội dung (ghi chú):</p>
                                        <p className="order-id-highlight">{orderIdForDisplay || 'Đang tạo ID...'}</p>
                                        <hr/>
                                        <p><strong>Ngân hàng:</strong> [Tên Ngân Hàng Của Bạn]</p>
                                        <p><strong>Số tài khoản:</strong> [Số Tài Khoản Của Bạn]</p>
                                        <p><strong>Chủ tài khoản:</strong> [Tên Chủ Tài Khoản]</p>
                                        <p className="note">Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán.</p>
                                    </div>
                                )}
                            </div>
                            <div className="payment-option">
                                <input type="radio" id="zalopay" name="paymentMethod" value="ZALOPAY"
                                       checked={paymentMethod === 'ZALOPAY'} onChange={handlePaymentChange} />
                                <label htmlFor="zalopay">
                                    Thanh toán qua ZaloPay
                                    <p className="payment-description">Sử dụng ví ZaloPay hoặc ứng dụng ngân hàng hỗ trợ ZaloPay QR.</p>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary place-order-btn"
                                disabled={isSubmitting || cartItems.length === 0}>
                            {isSubmitting ? 'Đang xử lý...' : (paymentMethod === 'ZALOPAY' ? 'Tiếp tục với ZaloPay' : 'Đặt hàng')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;