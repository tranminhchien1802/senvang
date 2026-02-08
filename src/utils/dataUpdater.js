// src/utils/dataUpdater.js
// Script cập nhật dữ liệu mẫu cho bài viết và banner nếu không tồn tại trong localStorage

// Dữ liệu banner mẫu
const sampleBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "DỊCH VỤ KẾ TOÁN CHUYÊN NGHIỆP",
    description: "Hơn 10 năm kinh nghiệm đồng hành cùng 5000+ doanh nghiệp khởi sự thành công. Chúng tôi mang đến sự an tâm tuyệt đối về pháp lý và tài chính.",
    buttonText: "Xem Các Dịch Vụ",
    buttonLink: "/dich-vu"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "THÀNH LẬP DOANH NGHIỆP",
    description: "Dễ dàng – Hiệu quả – Chất lượng. Đồng hành tận tâm và chuyên nghiệp cùng sự phát triển doanh nghiệp của bạn ngay từ những viên gạch đầu tiên.",
    buttonText: "Liên Hệ Tư Vấn",
    buttonLink: "/lien-he"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1554224155-6d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "GIẢI PHÁP TÀI CHÍNH TOÀN DIỆN",
    description: "Tư vấn chiến lược thuế, quản lý kế toán chuyên nghiệp, hỗ trợ pháp lý doanh nghiệp trọn đời.",
    buttonText: "Tìm Hiểu Thêm",
    buttonLink: "/"
  }
];

// Dữ liệu bài viết mẫu
const sampleArticles = [
  {
    id: 1,
    title: "Hướng Dẫn Thành Lập Doanh Nghiệp Năm 2024",
    excerpt: "Bộ luật hướng dẫn chi tiết các bước thành lập doanh nghiệp theo quy định mới nhất",
    content: "Hướng dẫn chi tiết các bước thành lập doanh nghiệp năm 2024 theo quy định mới nhất của Luật Doanh nghiệp...",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    date: "2024-01-15",
    category: "Thành lập doanh nghiệp",
    isNotification: true,
    isFeatured: false,
    link: "https://example.com/huong-dan-thanh-lap-doanh-nghiep"
  },
  {
    id: 2,
    title: "So Sánh Các Loại Hình Doanh Nghiệp Phổ Biến",
    excerpt: "So sánh chi tiết các loại hình doanh nghiệp phổ biến và ưu nhược điểm của từng loại",
    content: "Phân tích chi tiết các loại hình doanh nghiệp phổ biến tại Việt Nam...",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
    date: "2024-01-14",
    category: "Tư vấn pháp lý",
    isNotification: false,
    isFeatured: true,
    link: "https://example.com/so-sanh-loai-hinh-doanh-nghiep"
  },
  {
    id: 3,
    title: "Các Thủ Tục Sau Khi Thành Lập Doanh Nghiệp",
    excerpt: "Danh sách các thủ tục cần thực hiện sau khi thành lập doanh nghiệp thành công",
    content: "Sau khi thành lập doanh nghiệp, bạn cần thực hiện các thủ tục quan trọng...",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    date: "2024-01-13",
    category: "Thủ tục sau thành lập",
    isNotification: false,
    isFeatured: false,
    link: "https://example.com/thu-tuc-sau-thanh-lap"
  },
  {
    id: 4,
    title: "Dịch Vụ Kế Toán Cho Doanh Nghiệp Nhỏ",
    excerpt: "Tại sao doanh nghiệp nhỏ cần sử dụng dịch vụ kế toán chuyên nghiệp",
    content: "Dịch vụ kế toán giúp doanh nghiệp nhỏ tiết kiệm thời gian, đảm bảo tuân thủ pháp luật...",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    date: "2024-01-12",
    category: "Kế toán doanh nghiệp",
    isNotification: true,
    isFeatured: false,
    link: "https://example.com/dich-vu-ke-toan"
  },
  {
    id: 5,
    title: "Các Loại Thuế Phải Nộp Cho Doanh Nghiệp Mới",
    excerpt: "Tổng hợp các loại thuế mà doanh nghiệp mới cần biết và thực hiện",
    content: "Doanh nghiệp mới cần nắm rõ các loại thuế phải nộp bao gồm...",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    date: "2024-01-11",
    category: "Thuế doanh nghiệp",
    isNotification: false,
    isFeatured: false,
    link: "https://example.com/cac-loai-thue-doanh-nghiep-moi"
  },
  {
    id: 6,
    title: "Lợi Ích Của Việc Sử Dụng Dịch Vụ Kế Toán Trọn Gói",
    excerpt: "Tại sao nên lựa chọn dịch vụ kế toán trọn gói thay vì tự làm kế toán nội bộ",
    content: "Dịch vụ kế toán trọn gói giúp doanh nghiệp tiết kiệm chi phí, đảm bảo tính chuyên nghiệp...",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
    date: "2024-01-10",
    category: "Tư vấn kinh doanh",
    isNotification: false,
    isFeatured: true,
    link: "https://example.com/loi-ich-dich-vu-ke-toan-tron-goi"
  }
];

// Dữ liệu bài viết nổi bật
const sampleFeaturedNews = [
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

// Dữ liệu bài viết mới nhất
const sampleLatestNews = [
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

// Dữ liệu con số ấn tượng
const sampleImpressiveNumbers = [
  { id: 1, value: "15+", label: "Năm kinh nghiệm", icon: "fas fa-calendar-alt" },
  { id: 2, value: "3500+", label: "Khách hàng tin dùng", icon: "fas fa-users" },
  { id: 3, value: "99%", label: "Khách hàng hài lòng", icon: "fas fa-smile" },
  { id: 4, value: "100+", label: "Chuyên gia nhân sự", icon: "fas fa-user-tie" }
];

// Dữ liệu sản phẩm/dịch vụ tiêu biểu
const sampleProducts = [
  {
    id: 1,
    name: "Đăng Ký Kinh Doanh",
    price: "1.500.000đ",
    description: "Dịch vụ thành lập doanh nghiệp nhanh chóng, uy tín",
    features: [
      "Soạn thảo hồ sơ đầy đủ",
      "Nộp hồ sơ lên Sở KHĐT",
      "Nhận giấy phép sau 3-5 ngày"
    ],
    suitableFor: "Doanh nghiệp mới thành lập",
    timeToComplete: "Trọn gói 3-5 ngày",
    popular: true
  },
  {
    id: 2,
    name: "Kế Toán Doanh Nghiệp",
    price: "2.000.000đ",
    description: "Dịch vụ kế toán chuyên nghiệp cho doanh nghiệp",
    features: [
      "Lập báo cáo tài chính",
      "Kê khai thuế hàng tháng/quý",
      "Lưu trữ chứng từ kế toán"
    ],
    suitableFor: "Doanh nghiệp cần dịch vụ kế toán trọn gói",
    timeToComplete: "Theo tháng/quý",
    popular: true
  },
  {
    id: 3,
    name: "Thuế Hộ Kinh Doanh",
    price: "500.000đ",
    description: "Dịch vụ báo cáo thuế cho hộ kinh doanh cá thể",
    features: [
      "Kê khai thuế GTGT, TNCN",
      "Lập báo cáo tài chính",
      "Hoàn tất nghĩa vụ thuế"
    ],
    suitableFor: "Hộ kinh doanh cá thể",
    timeToComplete: "Theo tháng/quý",
    popular: true
  },
  {
    id: 4,
    name: "Thiết Kế Web",
    price: "5.000.000đ",
    description: "Dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO",
    features: [
      "Website responsive, chuẩn mobile",
      "Tối ưu SEO cơ bản",
      "Hướng dẫn sử dụng"
    ],
    suitableFor: "Doanh nghiệp cần website chuyên nghiệp",
    timeToComplete: "Trọn gói 7-15 ngày",
    popular: true
  },
  {
    id: 5,
    name: "Kiến Thức",
    price: "Liên hệ",
    description: "Cung cấp kiến thức chuyên sâu và tư vấn nghiệp vụ vững vàng",
    features: [
      "Tư vấn nghiệp vụ vững vàng",
      "Tư vấn ngày Thứ 7, chủ nhật & nghỉ lễ",
      "Tư vấn chọn tên công ty"
    ],
    suitableFor: "Doanh nghiệp muốn nâng cao kiến thức pháp lý",
    timeToComplete: "Linh hoạt",
    popular: true
  },
  {
    id: 6,
    name: "Dịch Vụ Khác",
    price: "Tùy gói",
    description: "Các dịch vụ hỗ trợ doanh nghiệp khác",
    features: [
      "Tư vấn pháp lý",
      "Hỗ trợ thủ tục",
      "Dịch vụ trọn gói"
    ],
    suitableFor: "Doanh nghiệp cần hỗ trợ đa dạng",
    timeToComplete: "Theo yêu cầu",
    popular: true
  }
];

// Hàm cập nhật dữ liệu vào localStorage
function updateSampleData() {
  try {
    // Kiểm tra xem localStorage có khả dụng không
    if (typeof(Storage) === "undefined") {
      console.warn("Trình duyệt không hỗ trợ localStorage");
      return;
    }

    // Cập nhật banner nếu chưa có
    if (!localStorage.getItem('bannerSlides') && !localStorage.getItem('banners')) {
      localStorage.setItem('bannerSlides', JSON.stringify(sampleBanners));
      console.log('Đã thêm dữ liệu banner mẫu vào localStorage');
    }

    // Cập nhật bài viết nếu chưa có
    if (!localStorage.getItem('knowledgeArticles') && 
        !localStorage.getItem('featuredArticles') && 
        !localStorage.getItem('blogPosts') && 
        !localStorage.getItem('newsArticles') && 
        !localStorage.getItem('homepageArticles')) {
      localStorage.setItem('knowledgeArticles', JSON.stringify(sampleArticles));
      console.log('Đã thêm dữ liệu bài viết mẫu vào localStorage');
    }

    // Cập nhật bài viết nổi bật nếu chưa có
    if (!localStorage.getItem('featuredNews')) {
      localStorage.setItem('featuredNews', JSON.stringify(sampleFeaturedNews));
      console.log('Đã thêm dữ liệu bài viết nổi bật mẫu vào localStorage');
    }

    // Cập nhật bài viết mới nhất nếu chưa có
    if (!localStorage.getItem('latestNews')) {
      localStorage.setItem('latestNews', JSON.stringify(sampleLatestNews));
      console.log('Đã thêm dữ liệu bài viết mới nhất mẫu vào localStorage');
    }

    // Cập nhật con số ấn tượng nếu chưa có
    if (!localStorage.getItem('impressiveNumbers')) {
      localStorage.setItem('impressiveNumbers', JSON.stringify(sampleImpressiveNumbers));
      console.log('Đã thêm dữ liệu con số ấn tượng mẫu vào localStorage');
    }

    // Cập nhật sản phẩm/dịch vụ tiêu biểu nếu chưa có
    if (!localStorage.getItem('homepageProducts')) {
      localStorage.setItem('homepageProducts', JSON.stringify(sampleProducts));
      console.log('Đã thêm dữ liệu sản phẩm/dịch vụ tiêu biểu mẫu vào localStorage');
    }

    // Gửi sự kiện để thông báo cho các thành phần khác biết dữ liệu đã thay đổi
    window.dispatchEvent(new Event('storageUpdated'));
    
    console.log('Cập nhật dữ liệu mẫu hoàn tất!');
  } catch (e) {
    console.error('Lỗi khi cập nhật dữ liệu mẫu:', e);
  }
}

// Gọi hàm cập nhật dữ liệu
updateSampleData();

export { updateSampleData, sampleBanners, sampleArticles, sampleFeaturedNews, sampleLatestNews, sampleImpressiveNumbers, sampleProducts };