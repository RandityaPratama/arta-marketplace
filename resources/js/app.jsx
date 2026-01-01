// app.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { FavoriteProvider } from "./components/context/FavoriteContext";
import { ChatProvider } from "./components/context/ChatContext";
import { ReportProvider } from "./components/context/ReportContext";
import { ProductProvider } from "./components/context/ProductContext";
import { AuthProvider } from './components/context/AuthContext';
import { AdminAuthProvider } from "./components/admin/admincontext/AdminAuthContext";

// Route Guards
import ProtectedRoute from "./components/protectedroutes/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/protectedroutes/AdminProtectedRoute";

// User Components
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import SellPage from "./components/SellPage";
import FavoritePage from "./components/FavoritePage";
import ProductDetailPage from "./components/ProductDetailPage";
import Profile from "./components/Profile";
import DetailSeller from "./components/DetailSeller";
import NotFoundPage from "./components/NotFoundPage";
import ChatPage from "./components/ChatPage";
import ChatRoom from "./components/ChatRoom";
import NotificationPage from "./components/NotificationPage";
import PurchaseHistoryPage from "./components/PurchaseHistoryPage";
import DiskonPage from "./components/DiskonPage";
import PopularPage from "./components/PopularPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

// Admin Components
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminProducts from "./components/admin/AdminProducts";
import AdminReports from "./components/admin/AdminReports";
import AdminUserProfile from "./components/admin/AdminUserProfile";
import AdminSettings from "./components/admin/AdminSettings";
import AdminActivity from "./components/admin/AdminActivity";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ADMIN AUTH PROVIDER DI LEVEL PALING ATAS */}
      <AdminAuthProvider>
        <FavoriteProvider>
          <ChatProvider>
            <ReportProvider>
              <ProductProvider>
                <AuthProvider> {/* AuthProvider untuk user juga di root */}
                  <Routes>
                    
                    {/* ========== PUBLIC USER ROUTES ========== */}
                    <Route element={<ProtectedRoute requireAuth={false} />}>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/forgot" element={<ForgotPasswordPage />} />
                    </Route>

                    {/* ========== PROTECTED USER ROUTES ========== */}
                    <Route element={<ProtectedRoute requireAuth={true} />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/sell" element={<SellPage />} />
                      <Route path="/favorite" element={<FavoritePage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/detailSeller/:id" element={<DetailSeller />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/chatroom/:id" element={<ChatRoom />} />
                      <Route path="/notif" element={<NotificationPage />} />
                      <Route path="/history" element={<PurchaseHistoryPage />} />
                      <Route path="/diskon" element={<DiskonPage />} />
                      <Route path="/popular" element={<PopularPage />} />
                    </Route>

                    {/* ========== ADMIN ROUTES ========== */}
                    {/* ADMIN LOGIN - tanpa protection karena untuk login */}
                    <Route path="/admin" element={
                      <AdminProtectedRoute requireAuth={false}>
                        <AdminLogin />
                      </AdminProtectedRoute>
                    } />

                    {/* PROTECTED ADMIN ROUTES */}
                    <Route element={<AdminProtectedRoute requireAuth={true} />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/user/:userId" element={<AdminUserProfile />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                      <Route path="/admin/activity" element={<AdminActivity />} />
                    </Route>

                    {/* ========== 404 PAGE ========== */}
                    <Route path="/*" element={<NotFoundPage />} />

                  </Routes>
                </AuthProvider>
              </ProductProvider>
            </ReportProvider>
          </ChatProvider>
        </FavoriteProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);