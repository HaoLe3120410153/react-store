import React, { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import { ref as dbRef, onValue } from 'firebase/database';
import ProductSlider from '../SwiperSlide/ProductSlider';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState({});

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
                                <div key={productId} className='app__product'>
                                <img src={product.imageUrl} alt={product.pro_name} />
                                <div className='app__product__details'>
                                    <h4>{product.pro_name}</h4>
                                    <h5>Giá bán: {product.pro_price_out}</h5>
                                    <h5>Số lượng: {product.pro_quantity}</h5>
                                    <h5>Công ty: {product.pro_company}</h5>
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
