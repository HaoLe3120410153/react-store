import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdReply, MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { ref, get, set as dbSet } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import './ProductDetail.css';

const ProductDetail = () => {
    const navigate = useNavigate();
    const [showImage, setShowImage] = useState(true);
    const containerRef = useRef(null);
    const { category, productId } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const itemsToScroll = 3;

    useEffect(() => {
        const fetchProduct = async () => {
            const decodedCategory = decodeURIComponent(category);
            const productRef = ref(database, `products/${decodedCategory}/${productId}`);
            const snapshot = await get(productRef);

            if (snapshot.exists()) {
                setProduct(snapshot.val());
                fetchSimilarProducts(decodedCategory, productId);
            }
        };

        const fetchSimilarProducts = async (category, currentProductId) => {
            const categoryRef = ref(database, `products/${category}`);
            const snapshot = await get(categoryRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const filteredProducts = Object.keys(data)
                    .filter(id => id !== currentProductId)
                    .map(id => ({ ...data[id], category, productId: id }));
                setSimilarProducts(filteredProducts);
            }
        };

        fetchProduct();
    }, [category, productId]);

    const toggleToImage = () => {
        setShowImage(true);
    }

    const toggleToDetail = () => {
        setShowImage(false);
    }

    const handleBack = () => {
        navigate("/");
    }

    const handlePrev = () => {
        if (containerRef.current) {
            const itemWidth = containerRef.current.scrollWidth / similarProducts.length;
            const scrollPosition = containerRef.current.scrollLeft - itemWidth * itemsToScroll;
            containerRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
        }
    }

    const handleNext = () => {
        if (containerRef.current) {
            const itemWidth = containerRef.current.scrollWidth / similarProducts.length;
            const scrollPosition = containerRef.current.scrollLeft + itemWidth * itemsToScroll;
            containerRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
        }
    }

    if (!product) {
        return <p>Loading...</p>;
    }

    const handleProduct = (category, productId) => {
        navigate(`/productdetail/${category}/${productId}`);
    }

    const handleBuyProduct = async (category, productId, currentStatus) => {
        if (!currentStatus) {
            const productRef = ref(database, `products/${category}/${productId}`);
            const newStatus = !currentStatus;
            const updatedProduct = { ...product, buy: newStatus };

            await dbSet(productRef, updatedProduct);

            setProduct(updatedProduct);
        }
    };

    return (
        <div className='product'>
            <div className='product__back'>
                <button onClick={handleBack} className='custom__button'>
                    <MdReply className='reply-icon svg' /> Trở về
                </button>
            </div>
            <div className='product__container'>
                <div className='product__side'>
                    <div className='product__info'>
                        {showImage ? (
                            <div className='product_img'>
                                <img src={product.imageUrl} alt={product.pro_name} />
                            </div>
                        ) : (
                            <div className='product_detail'>
                                <table>
                                    <tbody>
                                        {[
                                            { label: 'Thương hiệu', value: product.pro_company },
                                            { label: 'Xuất xứ', value: 'Việt Nam' },
                                            { label: 'Hướng dẫn sử dụng', value: 'Chiên đồ các kiểu' },
                                        ].map((row, index) => (
                                            <tr key={index} className={`product_${row.label.toLowerCase().replace(' ', '_')}`}>
                                                <td className='td_first'><h3>{row.label}</h3></td>
                                                <td>{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className='toggle_button'>
                            <div
                                onClick={toggleToImage}
                                className={`toggleToImage ${showImage ? 'active' : ''}`}
                            >
                                <p>Ảnh Sản Phẩm</p>
                            </div>
                            <div
                                onClick={toggleToDetail}
                                className={`toggleToDetail ${!showImage ? 'active' : ''}`}
                            >
                                <p>Thông Tin Sản Phẩm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='product__select'>
                    <div className='product__name'>
                        <h3>{product.pro_name}</h3>
                    </div>
                    <div className='product__price'>
                        <h2>{product.pro_price_out}đ</h2>
                        <span>{product.pro_price_in}đ</span>
                    </div>
                    <div className='product__buy'>
                        <button
                            className={`custom__button ${product.buy ? 'requesting' : ''}`}
                            onClick={() => handleBuyProduct(category, productId, product.buy)}
                        >
                            {
                                product.buy ? <p>Đang Yêu Cầu</p> : <p>Yêu Cầu Nhập Hàng</p>
                            }
                        </button>
                    </div>
                </div>
            </div>
            <div className='product_same'>
                <div className='product_same-controls-prev'>
                    <button onClick={handlePrev} className='custom__button'><MdArrowLeft /></button>
                </div>
                <div className='product_same-list' ref={containerRef}>
                    {similarProducts.length > 0 ? (
                        similarProducts.map((item, index) => (
                            <div
                                key={item.pro_name + index}
                                className='product_same-container'
                                onClick={() => handleProduct(item.category, item.productId)}
                            >
                                <img src={item.imageUrl} alt={item.pro_name} />
                                <div className='product_same-container-detail'>
                                    <div className='detail'>
                                        <div>
                                            <h4>{item.pro_name}</h4>
                                        </div>
                                        <span>{item.pro_price_out}đ</span>
                                    </div>
                                    <button className='custom__button'><p>Xem Ngay</p></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm tương tự</p>
                    )}
                </div>
                <div className='product_same-controls-next'>
                    <button onClick={handleNext} className='custom__button'><MdArrowRight /></button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
