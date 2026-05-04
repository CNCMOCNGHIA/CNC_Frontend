import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Login.css"
import Cookies from 'js-cookie';
import {login} from "../../api/authentication"


const Login = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLoginClick = async (e) => {
        e.preventDefault();
        try {
            const result = await login(username, password);

            // Kiểm tra trạng thái kết quả từ API
            if (result.resultStatus !== 'Success') {
                alert("Đăng nhập thất bại, vui lòng thử lại!");
                return;
            }

            // Lưu token vào cookie, thời hạn 1 giờ
            Cookies.set('token', result.data, { expires: 1 / 24, secure: true });

            navigate('/projects'); // Điều hướng đến trang 'projects'

        } catch (err) {
            console.error("Login error:", err.message);
            alert("Login failed: " + (err.message || "Có lỗi xảy ra, vui lòng thử lại!"));
        }
    };


    return (
        <div className="login">
            <div className="login-container">
                <form className="login-form" onSubmit={handleLoginClick}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password   ">Password</label>
                        <input type="password" id="password" name="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>

    )
}

export default Login
