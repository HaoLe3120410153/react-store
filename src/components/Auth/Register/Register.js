import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import './Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                uid: user.uid,
                password: password,
                address: address,
                admin:false,
                isNew:true,
            });

            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleToLogin = () => {
        navigate('/login')
    }

    return (
        <div className='register'>
            <div className="register-container">
                <h1>Đăng Ký</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Địa Chỉ:</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div>
                        <label>Mật Khẩu:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label>Nhập lại Mật Khẩu:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className="custom__button" type="submit">Đăng Ký</button>
                </form>
                <div className='btn_back_tologin'>
                    <p>Đã có tài khoản</p>
                    <button className="custom__button" onClick={handleToLogin}>Trở về trang đăng nhập</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
