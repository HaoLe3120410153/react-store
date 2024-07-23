import React, { useState } from 'react';
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './login.css'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
            navigate("/");
            })
            .catch((error) => {
            console.error("Login failed", error);
            });
    };

    const handleRegister = (e) => {
        navigate("/register")
    }

    return (
        <div className='login'>
            <div className='login_container'>
                <h1>Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="custom__button" type="submit">Đăng nhập</button>
                </form>
                <div className='btn__register'>
                    <p>Chưa có tài khoản vui lòng tạo!</p>
                    <button className="custom__button" onClick={handleRegister}>Đăng ký ngay</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
