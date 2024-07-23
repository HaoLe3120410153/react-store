import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdPerson, MdSearch, MdLogout } from 'react-icons/md';
import { ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { database } from '../../firebaseConfig';
import images from '../../constants/images';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const searchContainerRef = useRef(null);

    const handleSearch = useMemo(() => async () => {
        const productsRef = ref(database, 'products');
        const categoriesSnapshot = await get(productsRef);

        if (categoriesSnapshot.exists()) {
            const categories = categoriesSnapshot.val();
            const searchResults = [];

            for (const category in categories) {
                const products = categories[category];
                for (const productId in products) {
                    const product = products[productId];
                    searchResults.push({
                        ...product,
                        category: category,
                        productId: productId
                    });
                }
            }

            setResults(searchResults.filter(product =>
                product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setResults([]);
        }
    }, [searchTerm]);

    const debounceSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        debounceSearch();
    };

    const handleProductClick = (category, productId) => {
        navigate(`/productdetail/${category}/${productId}`);
        setResults([]);
    };

    const handleClickOutside = useMemo(() => (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setResults([]);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLogin(true);
                const userRef = ref(database, `users/${user.uid}`);
                const userSnapshot = await get(userRef);
                if (userSnapshot.exists() && userSnapshot.val().admin === true) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                setIsLogin(false);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setIsLogin(false);
            setIsAdmin(false);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className='app__navbar'>
            <div className='app_logo'>
                <img src={images.logo} alt=''/>
            </div>
            <div className="search-container" ref={searchContainerRef}>
                <input
                    type="text"
                    className="inputField"
                    placeholder="Nhập để tìm kiếm..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Tìm kiếm<MdSearch /></button>
                {searchTerm && (
                    <div className="results-container">
                        {results.length > 0 ? (
                            <ul className="results-list">
                                {results.map((result, index) => (
                                    <li
                                        key={index}
                                        className="result-item"
                                        onClick={() => handleProductClick(result.category, result.productId)}
                                    >
                                        <img src={result.imageUrl} alt={result.pro_name} className="result-image" />
                                        <h3>{result.pro_name}</h3>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-results">Không tìm thấy kết quả</p>
                        )}
                    </div>
                )}
            </div>
            <ul className="app__navbar_link">
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                {isAdmin && (
                    <li>
                        <NavLink to="/product-management">Products</NavLink>
                    </li>
                )}
                {isAdmin && (
                    <li>
                        <NavLink to="/users">Users</NavLink>
                    </li>
                )}
                {isLogin ? (
                    <li onClick={handleLogout}>
                        <MdLogout />
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login">
                            <MdPerson />
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export default Navbar;
