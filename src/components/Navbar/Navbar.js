import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <ul className="app__navbar">
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            <li>
                <NavLink to="/product-management">Product Management</NavLink>
            </li>
            <li>
                <NavLink to="/login">Login</NavLink>
            </li>
            <li>
                <NavLink to="/register">Register</NavLink>
            </li>
        </ul>
    );
};

export default Navbar;

// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import './Navbar.css';



// const Navbar = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     const handleSearchChange = (e) => {
//         const input = e.target.value;
//         setSearchQuery(input);
//         let result = [];
//         if (input.length) {
//             result = productsDataArray.filter((product) =>
//                 product.name.toLowerCase().includes(input.toLowerCase())
//             );
//         }
//         setSearchResults(result);
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         // Thực hiện hành động tìm kiếm hoặc điều hướng ở đây nếu cần
//         console.log('Search query:', searchQuery);
//     };

//     const handleResultClick = (productId) => {
//         window.location.href = `product_detail.html?productId=${productId}`;
//     };

//     return (
//         <div>
//             <ul className="app__navbar">
//                 <li>
//                     <form className='search_bar' onSubmit={handleSearchSubmit}>
//                         <input
//                             type="text"
//                             id="input-box"
//                             placeholder="Search anything"
//                             autocomplete="off"
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                         />
//                         <button type="submit">Search</button>
//                     </form>
//                 </li>
//                 <li>
//                     <NavLink to="/">Home</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/product-management">Product Management</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/login">Login</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/register">Register</NavLink>
//                 </li>
//             </ul>
//             <div className="result-box">
//                 {searchResults.length > 0 && (
//                     <ul>
//                         {searchResults.map((product) => (
//                             <li key={product.id} onClick={() => handleResultClick(product.id)}>
//                                 {product.name}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Navbar;
