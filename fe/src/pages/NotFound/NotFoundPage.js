import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Trang không tồn tại</h2>
                <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
                <Link to="/" className="back-home">
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
