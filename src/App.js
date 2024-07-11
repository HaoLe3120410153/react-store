import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/HomePage/Home";
import ProductManagement from "./components/ProductsPage/ProductsManagement";
import Login from "./components/Auth/LogIn/Login";
import Register from "./components/Auth/Register/Register";
import MainLayout from './layouts/MainLayout';

import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product-management" element={<ProductManagement />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    )
}

export default App;