import React, { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import './EditProductModal.css';
import { ref as dbRef, update } from 'firebase/database';

const EditProductModal = ({ isOpen, onClose, product, category }) => {
  const [proName, setProName] = useState('');
  const [proPriceIn, setProPriceIn] = useState('');
  const [proPriceOut, setProPriceOut] = useState('');
  const [proQuantity, setProQuantity] = useState('');
  const [proCompany, setProCompany] = useState('');
  const productRef = dbRef(database, `products/${category}/${product.id}`);

  useEffect(() => {
    if (product) {
      console.log('Product in useEffect:' , product);
      setProName(product.pro_name || '');
      setProPriceIn(product.pro_price_in || '');
      setProPriceOut(product.pro_price_out || '');
      setProQuantity(product.pro_quantity || '');
      setProCompany(product.pro_company || '');
    } else {
      console.log('No product provided');
    }
  }, [product]);

  const handleSave = () => {
    if (!product) {
      console.error('No product to update');
      return;
    }

    const updatedProduct = {
      pro_name: proName,
      pro_price_in: proPriceIn,
      pro_price_out: proPriceOut,
      pro_quantity: proQuantity,
      pro_company: proCompany,
    };
    
    update(productRef, updatedProduct).then(() => {
      console.log('Product updated successfully');
      onClose();
    }).catch((error) => {
      console.error('Error updating product:', error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Sửa</h2>
        <form>
          <div>
            <label>Tên Sản Phẩm:</label>
            <input
              type="text"
              value={proName}
              onChange={(e) => setProName(e.target.value)}
            />
          </div>
          <div>
            <label>Giá Nhập:</label>
            <input
              type="number"
              value={proPriceIn}
              onChange={(e) => setProPriceIn(e.target.value)}
            />
          </div>
          <div>
            <label>Giá Bán:</label>
            <input
              type="number"
              value={proPriceOut}
              onChange={(e) => setProPriceOut(e.target.value)}
            />
          </div>
          <div>
            <label>Số Lượng:</label>
            <input
              type="number"
              value={proQuantity}
              onChange={(e) => setProQuantity(e.target.value)}
            />
          </div>
          <div>
            <label>Công Ty:</label>
            <input
              type="text"
              value={proCompany}
              onChange={(e) => setProCompany(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
