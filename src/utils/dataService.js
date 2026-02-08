// src/utils/dataService.js
// Service để quản lý dữ liệu bài viết và dịch vụ

// Lấy bài viết nổi bật
export const getFeaturedNews = () => {
  // Trong thực tế, đây sẽ là API call để lấy bài viết nổi bật từ backend
  // Hiện tại dùng dữ liệu mẫu
  const sampleNews = [
    {
      id: 1,
      title: "Chiêu sinh khóa học thuế chuyên sâu",
      excerpt: "Chưa bao giờ môi trường thuế tại Việt Nam lại biến động nhanh chóng như hiện nay...",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
      date: "2024-01-15",
      category: "Tin tức",
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: "Hướng dẫn quyết toán thuế 2024",
      excerpt: "Các bước cần thực hiện để quyết toán thuế cuối năm hiệu quả...",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
      date: "2024-01-14",
      category: "Kiến thức",
      views: 980,
      featured: true
    }
  ];
  
  // Lấy từ localStorage nếu có
  const storedNews = localStorage.getItem('featuredNews');
  if (storedNews) {
    try {
      return JSON.parse(storedNews);
    } catch (e) {
      console.error('Error parsing featured news from localStorage', e);
    }
  }
  
  return sampleNews;
};

// Lấy các bài viết mới nhất
export const getLatestNews = (limit = 4) => {
  const sampleNews = [
    {
      id: 2,
      title: "Hướng dẫn quyết toán thuế 2024",
      excerpt: "Các bước cần thực hiện để quyết toán thuế cuối năm hiệu quả...",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      date: "2024-01-14",
      category: "Kiến thức",
      views: 980
    },
    {
      id: 3,
      title: "Thay đổi mới về hóa đơn điện tử",
      excerpt: "Các quy định mới về hóa đơn điện tử bắt đầu áp dụng từ tháng 7/2024...",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      date: "2024-01-13",
      category: "Thông báo",
      views: 756
    },
    {
      id: 4,
      title: "Lợi ích của dịch vụ kế toán trọn gói",
      excerpt: "Tại sao doanh nghiệp nên lựa chọn dịch vụ kế toán trọn gói thay vì tự làm...",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
      date: "2024-01-12",
      category: "Tư vấn",
      views: 1102
    },
    {
      id: 5,
      title: "Các thủ tục sau thành lập doanh nghiệp",
      excerpt: "Danh sách các thủ tục cần thực hiện sau khi thành lập doanh nghiệp thành công...",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      date: "2024-01-11",
      category: "Thủ tục",
      views: 876
    }
  ];
  
  const storedNews = localStorage.getItem('latestNews');
  if (storedNews) {
    try {
      const parsedNews = JSON.parse(storedNews);
      return parsedNews.slice(0, limit);
    } catch (e) {
      console.error('Error parsing latest news from localStorage', e);
    }
  }
  
  return sampleNews.slice(0, limit);
};

// Lấy dịch vụ nổi bật
export const getFeaturedServices = (limit = 4) => {
  const sampleServices = [
    {
      id: 1,
      category: 'Đăng Ký Kinh Doanh',
      name: 'Gói Khởi Nghiệp',
      description: 'Thành lập doanh nghiệp cơ bản',
      price: '1.500.000đ',
      features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST'],
      status: 'active'
    },
    {
      id: 2,
      category: 'Kế Toán Doanh Nghiệp',
      name: 'Gói Cơ Bản',
      description: 'Dịch vụ kế toán hoàn chỉnh cho doanh nghiệp',
      price: '2.500.000đ',
      features: ['Kê khai thuế', 'Lập báo cáo tài chính', 'Lưu trữ hồ sơ'],
      status: 'active'
    },
    {
      id: 3,
      category: 'Thuế Hộ Kinh Doanh',
      name: 'Gói Tiêu Chuẩn',
      description: 'Dịch vụ kế toán thuế cho hộ kinh doanh quy mô vừa',
      price: '1.000.000đ',
      features: ['Kê khai thuế GTGT', 'Lập báo cáo tài chính', 'Tư vấn thuế'],
      status: 'active'
    },
    {
      id: 4,
      category: 'Thiết Kế Web',
      name: 'Website Doanh Nghiệp',
      description: 'Gói website chuyên nghiệp cho doanh nghiệp',
      price: '5.000.000đ',
      features: ['Thiết kế giao diện', 'Tối ưu SEO', 'Hỗ trợ kỹ thuật'],
      status: 'active'
    }
  ];
  
  const storedServices = localStorage.getItem('featuredServices');
  if (storedServices) {
    try {
      const parsedServices = JSON.parse(storedServices);
      return parsedServices.slice(0, limit);
    } catch (e) {
      console.error('Error parsing featured services from localStorage', e);
    }
  }
  
  return sampleServices.slice(0, limit);
};