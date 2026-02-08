import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Hidden on mobile when closed */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} hidden md:block bg-gradient-to-b from-gray-800 to-gray-900 p-6 z-10 shadow-xl transition-all duration-300 overflow-hidden`}>
        <div className="flex items-center mb-10">
          <div className="bg-white p-2 rounded-xl shadow-lg border-2 border-[#FFD700]">
            <span className="text-xl font-bold text-[#FFD700]">
              KTSV
            </span>
          </div>
          {sidebarOpen && <h1 className="text-2xl font-bold text-[#FFD700] ml-4 tracking-wide">ADMIN</h1>}
        </div>

        <nav className="mt-12">
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              {sidebarOpen && 'Tổng quan'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/product-service')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              {sidebarOpen && 'QL Sản Phẩm DV'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/home-page')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {sidebarOpen && 'QL Trang Chủ'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/banners')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {sidebarOpen && 'QL Banner'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/service-orders')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              {sidebarOpen && 'QL Đơn Hàng'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/articles')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747.777 3.332 1.253 4.5 2.027v13C19.832 18.477 18.247 18 16.5 18c-1.746.777-3.332 1.253-4.5 2.027"></path>
              </svg>
              {sidebarOpen && 'QL Bài Viết'}
            </button>
          </div>
          <div className="mb-3">
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full text-left px-6 py-4 rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {sidebarOpen && 'Cài Đặt Chung'}
            </button>
          </div>
        </nav>

        {/* Decorative elements */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-500 text-center">Kế Toán Sen Vàng</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-5 flex items-center justify-between border-b border-gray-700 shadow-lg">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <div className="flex-1 flex justify-center md:justify-end">
            <h2 className="text-lg md:text-xl font-bold text-[#FFD700] tracking-wide">
              {window.location.pathname === '/admin' && 'Tổng quan'}
              {window.location.pathname === '/admin/services' && 'Quản lý dịch vụ'}
              {window.location.pathname === '/admin/product-service' && 'QL Sản Phẩm DV'}
              {window.location.pathname === '/admin/home-page' && 'QL Trang Chủ'}
              {window.location.pathname === '/admin/banners' && 'QL Banner'}
              {window.location.pathname === '/admin/settings' && 'Cài Đặt Chung'}
            </h2>
          </div>
          
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm md:text-base"
          >
            Đăng xuất
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;