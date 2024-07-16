import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/HomePage/Home";
import ProductManagement from "./components/ProductsPage/ProductsManagement";
import Login from "./components/Auth/LogIn/Login";
import Register from "./components/Auth/Register/Register";
import ProductDetail from "./components/ProductsPage/ProductDetail/ProductDetail";
import MainLayout from './layouts/MainLayout';

import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product-management" element={<ProductManagement />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/productdetail" element={<ProductDetail />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App;