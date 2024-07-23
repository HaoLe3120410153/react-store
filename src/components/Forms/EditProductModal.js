// import React, { useState, useEffect } from 'react';
// import { database } from '../../firebaseConfig';
// import './EditProductModal.css';
// import { ref as dbRef, update } from 'firebase/database';

// const EditProductModal = ({ isOpen, onClose, product, category }) => {
//   const [proName, setProName] = useState('');
//   const [proPriceIn, setProPriceIn] = useState('');
//   const [proPriceOut, setProPriceOut] = useState('');
//   const [proQuantity, setProQuantity] = useState('');
//   const [proCompany, setProCompany] = useState('');
//   const productRef = dbRef(database, `products/${category}/${product.id}`);

//   useEffect(() => {
//     if (product) {
//       console.log('Product in useEffect:' , product);
//       setProName(product.pro_name || '');
//       setProPriceIn(product.pro_price_in || '');
//       setProPriceOut(product.pro_price_out || '');
//       setProQuantity(product.pro_quantity || '');
//       setProCompany(product.pro_company || '');
//     } else {
//       console.log('No product provided');
//     }
//   }, [product]);

//   const handleSave = () => {
//     if (!product) {
//       console.error('No product to update');
//       return;
//     }

//     const updatedProduct = {
//       pro_name: proName,
//       pro_price_in: proPriceIn,
//       pro_price_out: proPriceOut,
//       pro_quantity: proQuantity,
//       pro_company: proCompany,
//     };
  
//     update(productRef, updatedProduct).then(() => {
//       console.log('Product updated successfully');
//       onClose();
//     }).catch((error) => {
//       console.error('Error updating product:', error);
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close-button" onClick={onClose}>&times;</span>
//         <h2>Sửa</h2>
//         <form>
//           <div>
//             <label>Tên Sản Phẩm:</label>
//             <input
//               type="text"
//               value={proName}
//               onChange={(e) => setProName(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Giá Nhập:</label>
//             <input
//               type="number"
//               value={proPriceIn}
//               onChange={(e) => setProPriceIn(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Giá Bán:</label>
//             <input
//               type="number"
//               value={proPriceOut}
//               onChange={(e) => setProPriceOut(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Số Lượng:</label>
//             <input
//               type="number"
//               value={proQuantity}
//               onChange={(e) => setProQuantity(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Công Ty:</label>
//             <input
//               type="text"
//               value={proCompany}
//               onChange={(e) => setProCompany(e.target.value)}
//             />
//           </div>
//           <button type="button" onClick={handleSave}>Save</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProductModal;

import React, { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import { ref as dbRef, update } from 'firebase/database';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProductModal = ({ isOpen, onClose, product, category }) => {
  const [proName, setProName] = useState('');
  const [proPriceIn, setProPriceIn] = useState('');
  const [proPriceOut, setProPriceOut] = useState('');
  const [proQuantity, setProQuantity] = useState('');
  const [proCompany, setProCompany] = useState('');
  const productRef = dbRef(database, `products/${category}/${product.id}`);

  useEffect(() => {
    if (product) {
      setProName(product.pro_name || '');
      setProPriceIn(product.pro_price_in || '');
      setProPriceOut(product.pro_price_out || '');
      setProQuantity(product.pro_quantity || '');
      setProCompany(product.pro_company || '');
    }
  }, [product]);

  const handleSave = () => {
    const updatedProduct = {
      pro_name: proName,
      pro_price_in: proPriceIn,
      pro_price_out: proPriceOut,
      pro_quantity: proQuantity,
      pro_company: proCompany,
    };
  
    update(productRef, updatedProduct).then(() => {
      onClose();
    }).catch((error) => {
      console.error('Error updating product:', error);
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="proName">
            <Form.Label>Tên Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              value={proName}
              onChange={(e) => setProName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proPriceIn">
            <Form.Label>Giá Nhập</Form.Label>
            <Form.Control
              type="number"
              value={proPriceIn}
              onChange={(e) => setProPriceIn(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proPriceOut">
            <Form.Label>Giá Bán</Form.Label>
            <Form.Control
              type="number"
              value={proPriceOut}
              onChange={(e) => setProPriceOut(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proQuantity">
            <Form.Label>Số Lượng</Form.Label>
            <Form.Control
              type="number"
              value={proQuantity}
              onChange={(e) => setProQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proCompany">
            <Form.Label>Công Ty</Form.Label>
            <Form.Control
              type="text"
              value={proCompany}
              onChange={(e) => setProCompany(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
