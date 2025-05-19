import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Auth.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState("");

    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect URL from query parameters
    const getRedirectUrl = () => {
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');
        return redirect ? decodeURIComponent(redirect) : "/";
    };

    // Only redirect if user is already authenticated and we've checked localStorage (not loading)
    useEffect(() => {
        if (!loading && isAuthenticated) {
            const redirectUrl = getRedirectUrl();
            // Only navigate if we're not already on the target page
            if (location.pathname !== redirectUrl) {
                navigate(redirectUrl, { replace: true });
            }
        }
    }, [isAuthenticated, loading]); // Remove location and navigate from dependencies

    const validate = () => {
        const newErrors = {};

        if (!username) {
            newErrors.username = "Username is required";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");

        if (validate()) {
            setIsSubmitting(true);
            try {
                const success = await login({ username, password });
                if (success) {
                    const redirectUrl = getRedirectUrl();
                    // Only navigate if we're not already on the target page
                    if (location.pathname !== redirectUrl) {
                        navigate(redirectUrl, { replace: true });
                    }
                }
            } catch (error) {
                setLoginError(error.message || "Failed to login. Please try again.");
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1>Login</h1>
                {loginError && <div className="auth-error">{loginError}</div>}

                <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                isInvalid={!!errors.username}
                                className={errors.username ? "error" : ""}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!errors.password}
                                className={errors.password ? "error" : ""}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <div className="remember-forgot">
                        <Form.Check type="checkbox" label="Remember me" id="remember-me" className="remember-me" />
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Login;
