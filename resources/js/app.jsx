import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoriteProvider } from "./components/context/FavoriteContext";

    // Users Import
    import LandingPage from "./components/LandingPage";
    import SignupPage from "./components/SignupPage";
    import LoginPage from "./components/LoginPage";
    import NavbarAfter from "./components/NavbarAfter";
    import NavbarBefore from "./components/NavbarBefore";
    import Footer from "./components/Footer"
    import Dashboard from "./components/Dashboard"
    import SellPage from "./components/SellPage"
    import FavoritePage from "./components/FavoritePage"
    import ProductDetailPage from "./components/ProductDetailPage"
    import Profile from "./components/Profile"
    import DetailSeller from "./components/DetailSeller"
    import NotFoundPage from "./components/NotFoundPage"
    import ChatPage from "./components/ChatPage"
    import ChatRoom from "./components/ChatRoom"
    import NotificationPage from "./components/NotificationPage"

    // Admin Import
    import AdminDashboard from "./components/admin/AdminDashboard";
    import AdminUsers from "./components/admin/AdminUsers";
    import AdminProducts from "./components/admin/AdminProducts";
    import AdminReports from "./components/admin/AdminReports";



    ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <BrowserRouter>
            <FavoriteProvider>

        <Routes>
            {/* Halaman User */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/navbarAfter" element={<NavbarAfter />} />
            <Route path="/navbarBefore" element={<NavbarBefore />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/detailSeller/:id" element={<DetailSeller />} />
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/room" element={<ChatRoom />} />
            <Route path="/notif" element={<NotificationPage />} />

            {/* Halaman Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/reports" element={<AdminReports />} />





        </Routes>
        </FavoriteProvider>
    </BrowserRouter>
    </React.StrictMode>
);