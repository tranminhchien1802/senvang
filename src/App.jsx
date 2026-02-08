// File: src/App.jsx
// Cấu hình routing chính cho website Kế Toán Sen Vàng
// Bao gồm 5 trang chính theo sitemap

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ensureDataSync } from './utils/dataSync'; // Keep for regular login buttons
import UpdateServicesData from './components/UpdateServicesData';
import DataSync from './components/DataSync';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import TrangChu from './pages/TrangChu';
import ContactForm from './components/ContactForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import AuthSuccess from './pages/AuthSuccess';
import Login from './pages/Login';
import DangKyKinhDoanh from './pages/DangKyKinhDoanh';
import KeToanDoanhNghiep from './pages/KeToanDoanhNghiep';
import ThueHoKinhDoanh from './pages/ThueHoKinhDoanh';
import DichVuThietKeWeb from './pages/DichVuThietKeWeb';
import KnowledgePage from './pages/KnowledgePage';
import ServiceManager from './pages/ServiceManager';
import BusinessRegistrationManager from './pages/BusinessRegistrationManager';
import AccountingManager from './pages/AccountingManager';
import TaxManager from './pages/TaxManager';
import WebDesignManager from './pages/WebDesignManager';
import ProductServiceManager from './pages/ProductServiceManager';
import ProductManager from './pages/ProductManager';
import HomePageManager from './pages/HomePageManager';
import BannerManager from './pages/BannerManager';
import ServiceOrderManager from './pages/ServiceOrderManager';
import ArticleManager from './pages/ArticleManager';
import GeneralSettings from './pages/GeneralSettings';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  useEffect(() => {
    // Ensure data synchronization when app starts
    ensureDataSync();
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
      <UpdateServicesData />
      <DataSync />
      <Router>
        <Routes>
        {/* Routes with Header/Footer */}
        <Route path="/" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-24">
                <TrangChu />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/dang-ky-kinh-doanh" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-32">
                <DangKyKinhDoanh />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/ke-toan-doanh-nghiep" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-24">
                <KeToanDoanhNghiep />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/thue-ho-kinh-doanh" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-32">
                <ThueHoKinhDoanh />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/thiet-ke-web" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-24">
                <DichVuThietKeWeb />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/kien-thuc" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-24">
                <KnowledgePage />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />
        <Route path="/ContactForm" element={
          <>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-white pt-32">
                <ContactForm />
              </main>
              <Footer />
              <FloatingContact />
            </div>
          </>
        } />

        {/* Admin routes without Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <ServiceManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/business-registration" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <BusinessRegistrationManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/accounting" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <AccountingManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/tax" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <TaxManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/web-design" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <WebDesignManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/product-service" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <ProductServiceManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/home-page" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <HomePageManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/banners" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <BannerManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/service-orders" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <ServiceOrderManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <ProductManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/articles" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <ArticleManager />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-900">
              <AdminLayout>
                <GeneralSettings />
              </AdminLayout>
            </div>
          </AdminProtectedRoute>
        } />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login*" element={<Login />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;