import React, { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import { ref as dbRef, onValue } from 'firebase/database';
import ProductSlider from '../SwiperSlide/ProductSlider';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const productsRef = dbRef(database, "products");
        onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
            setProducts(snapshot.val());
        } else {
            setProducts({});
        }
        });
    }, []);

    const handleProduct = (category, productId) => {
        navigate(`/productdetail/${category}/${productId}`);
        console.log(productId)
    }

    return (
        <div className='app__home-page'>
            <ProductSlider/>
            <div className='app__product__list'>
                <h1>Danh sách sản phẩm</h1>
                {Object.keys(products).map((category) => (
                    <div key={category} className='app__product__category'>
                        <div className='app__product__category-name'>
                            <h2>{category}</h2>
                        </div>
                        <div className='app__product__container'>
                            {Object.keys(products[category]).slice(0, 8).map((productId) => {
                            const product = products[category][productId];
                            return (
                                <div key={productId} className='app__product' onClick={() => handleProduct(category,productId)}>
                                <img src={product.imageUrl} alt={product.pro_name} />
                                <div className='app__product__details'>
                                    <div><h5>{product.pro_name}</h5></div>
                                    <h6>Giá bán: {product.pro_price_out}</h6>
                                    <h6>Số lượng: {product.pro_quantity}</h6>
                                    <h6>Công ty: {product.pro_company}</h6>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Home;
