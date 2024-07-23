import React, { useState, useEffect } from 'react';
import AddProductForm from "../Forms/AddProductForm";
import './ProductsManagement.css';
import { FaPlus, FaMinus, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdCheckmark, IoMdCloseCircle } from 'react-icons/io';
import { database } from '../../firebaseConfig';
import { ref as dbRef, onValue, remove, set } from 'firebase/database';
import EditProductModal from '../Forms/EditProductModal';

const ProductManagement = () => {
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [products, setProducts] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const handleDelete = (category, productId) => {
    const productRef = dbRef(database, `products/${category}/${productId}`);
    remove(productRef).then(() => {
      setProducts(prevProducts => {
        const updatedProducts = { ...prevProducts };
        delete updatedProducts[category][productId];
        return updatedProducts;
      });
    }).catch((error) => {
      console.error('Error deleting product:', error);
    });
  };

  const handleEdit = (category, productId) => {
    setSelectedCategory(category);
    setSelectedProduct({ ...products[category][productId], id: productId });
    setIsEditModalOpen(true);
  };

  const handleCheckBuy = async (category, productId, currentStatus) => {
    const productRef = dbRef(database, `products/${category}/${productId}`);
    const newStatus = !currentStatus;
    const updatedProduct = { ...products[category][productId], buy: newStatus };

    await set(productRef, updatedProduct);

    setProducts(prevProducts => ({
      ...prevProducts,
      [category]: {
        ...prevProducts[category],
        [productId]: updatedProduct
      }
    }));
  };

  return (
    <div className='app__product-manage'>
      <div className='app__product-manage__title'>
        <h1>Quản lý sản phẩm và danh mục</h1>
      </div>
      <div className='app__product-manage__add-button'>
        <button className='custom__button' onClick={() => setShowAddProductForm(!showAddProductForm)}>
          {showAddProductForm ? "" : "Thêm sản phẩm "}
          {showAddProductForm ? <FaMinus className='svg'/> : <FaPlus className='svg'/>}
        </button>
        {showAddProductForm && <AddProductForm />}
      </div>
      <div className="app__product__list-manage">
        <h1>Danh sách sản phẩm</h1>
        {Object.keys(products).map((category) => (
          <div key={category} className="app__product__category">
            <div className="app__product__category-name">
              <h2>{category.replace(/-/g, ' ')}</h2>
            </div>
            <div className="app__product__table">
              <table>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Công ty</th>
                    <th>Nhập</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(products[category]).slice(0, 10).map((productId) => {
                    const product = products[category][productId];
                    return (
                      <tr key={productId} className="app__product">
                        <td className='app__product__img'><img src={product.imageUrl} alt={product.pro_name} /></td>
                        <td>{product.pro_name}</td>
                        <td>{product.pro_price_out}</td>
                        <td>{product.pro_quantity}</td>
                        <td>{product.pro_company}</td>
                        <td onClick={() => handleCheckBuy(category, productId, product.buy)} style={{ cursor: 'pointer' }}>
                          {product.buy ? <IoMdCloseCircle /> : <IoMdCheckmark />}
                        </td>
                        <td>
                          <button onClick={() => handleEdit(category, productId)} className="edit-button">
                            <FaEdit />
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(category, productId)} className="delete-button">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default ProductManagement;
