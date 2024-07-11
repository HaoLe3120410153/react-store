import React, { useState, useEffect } from 'react';
import { database, storage } from '../../firebaseConfig';
import { ref as dbRef, onValue, push } from 'firebase/database';
import { ref as strRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import './AddProductForm.css'

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [proName, setProName] = useState('');
  const [proPriceIn, setProPriceIn] = useState('');
  const [proPriceOut, setProPriceOut] = useState('');
  const [proQuantity, setProQuantity] = useState('');
  const [proCompany, setProCompany] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const categoriesRef = dbRef(database, 'products');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategories(Object.keys(data));
      }
    });
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const category = selectedCategory || newCategory.trim();
    if (!category || !proName || !proPriceIn || !proPriceOut || !proQuantity || !proCompany || !file) {
      alert('Vui lòng điền tất cả các trường và chọn tệp ảnh.');
      return;
    }

    const storageRef = strRef(storage, `images/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    }).then((downloadURL) => {
      const productRef = dbRef(database, `products/${category}`);
      const newProduct = {
        pro_name: proName,
        pro_price_in: proPriceIn,
        pro_price_out: proPriceOut,
        pro_quantity: proQuantity,
        pro_company: proCompany,
        imageUrl: downloadURL
      };
      push(productRef, newProduct);
      clearForm();
    }).catch((error) => {
      console.error('Error uploading image:', error);
    });
  };

  const clearForm = () => {
    setSelectedCategory('');
    setNewCategory('');
    setProName('');
    setProPriceIn('');
    setProPriceOut('');
    setProQuantity('');
    setProCompany('');
    setFile(null);
  };

  return (
    <form onSubmit={handleAddProduct} className='app__add-product__form'>
      <h2>Thêm Sản Phẩm</h2>
      <div className='app__form_add'>
        <label>Chọn Danh Mục:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled={newCategory}>
          <option value="">Chọn danh mục</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className='app__form_add'>
        <label>Hoặc Thêm Danh Mục Mới:</label>
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} disabled={selectedCategory} />
      </div>
      <div className='app__form_add'>
        <label>Tên Sản Phẩm:</label>
        <input type="text" value={proName} onChange={(e) => setProName(e.target.value)} />
      </div>
      <div className='app__form_add'>
        <label>Giá Nhập:</label>
        <input type="number" value={proPriceIn} onChange={(e) => setProPriceIn(e.target.value)} />
      </div>
      <div className='app__form_add'>
        <label>Giá Bán:</label>
        <input type="number" value={proPriceOut} onChange={(e) => setProPriceOut(e.target.value)} />
      </div>
      <div className='app__form_add'>
        <label>Số Lượng:</label>
        <input type="number" value={proQuantity} onChange={(e) => setProQuantity(e.target.value)} />
      </div>
      <div className='app__form_add'>
        <label>Công Ty:</label>
        <input type="text" value={proCompany} onChange={(e) => setProCompany(e.target.value)} />
      </div>
      <div className='app__form_add'>
        <label>Ảnh Sản Phẩm:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div className='div__button'>
        <button type="submit" className='custom__button'>Thêm Sản Phẩm</button>
      </div>
    </form>
  );
};

export default AddProductForm;
