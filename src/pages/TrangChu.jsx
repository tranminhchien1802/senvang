import React, { useEffect, useRef, useState } from 'react';
import BannerSlider from '../components/BannerSlider';
import ServicesGrid from '../components/ServicesGrid';
import { getLatestPosts } from '../utils/postUtils';
import NewsTicker from '../components/NewsTicker';
import NewsSlider from '../components/NewsSlider';
import NewsNotificationGrid from '../components/NewsNotificationGrid';
import ServiceOrderForm from '../components/ServiceOrderForm';

// --- COMPONENT CON: XỬ LÝ HIỆU ỨNG SỐ NHẢY (COUNTER UP) ---
const CounterItem = ({ targetValue, label, icon, duration = 2000 }) => {
  // Provide defaults for props
  const safeTargetValue = targetValue || "0";
  const safeLabel = label || "Nhãn mặc định";
  const safeIcon = icon || "fas fa-star";
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const numberPart = parseInt(safeTargetValue.toString().replace(/\D/g, '')) || 0;
  const suffix = safeTargetValue.toString().replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOut = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
      setCount(Math.floor(numberPart * easeOut(percentage)));

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(numberPart);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, numberPart, duration]);

  return (
    <div
      ref={nodeRef}
      className="counter-item flex-1 min-w-[200px] p-6 text-center bg-white rounded-lg shadow-md transition-transform hover:-translate-y-2 border border-gray-200"
      style={{ flex: '1', minWidth: '200px', padding: '30px 20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'all 0.3s', border: '1px solid #e2e8f0' }}
    >
      <div className="counter-icon text-4xl text-[#D4AF37] mb-3" style={{ fontSize: '2.5em', color: '#D4AF37', marginBottom: '15px' }}>
        <i className={safeIcon}></i>
      </div>
      <div className="counter-number text-5xl font-bold text-[#D4AF37] mb-2" style={{ fontSize: '4em', fontWeight: '900', color: '#D4AF37', lineHeight: '1', marginBottom: '15px', textShadow: '2px 2px 4px rgba(212,175,55,0.2)' }}>
        {count}{suffix}
      </div>
      <div className="counter-label text-lg uppercase text-gray-700 font-bold" style={{ fontSize: '1.1em', textTransform: 'uppercase', color: '#4a5568', letterSpacing: '1px' }}>
        {safeLabel}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const TrangChu = () => {
  const statsRef = useRef(null);

  // State for banners and posts
  const [banners, setBanners] = useState([]);
  const [posts, setPosts] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    // Load banners from localStorage
    const savedBanners = JSON.parse(localStorage.getItem('bannerSlides')) || JSON.parse(localStorage.getItem('banners')) || [
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
    setBanners(savedBanners);

    // Load posts from localStorage
    let savedPosts = [];
    const knowledgeArticles = localStorage.getItem('knowledgeArticles');
    const featuredArticles = localStorage.getItem('featuredArticles');

    if (knowledgeArticles) {
      try {
        savedPosts = JSON.parse(knowledgeArticles);
      } catch (e) {
        console.error('Error parsing knowledge articles from localStorage', e);
      }
    } else if (featuredArticles) {
      try {
        savedPosts = JSON.parse(featuredArticles);
      } catch (e) {
        console.error('Error parsing featured articles from localStorage', e);
      }
    }

    // Default posts if no data found in localStorage
    if (!savedPosts || savedPosts.length === 0) {
      savedPosts = [
        {
          id: 1,
          title: "Kiến thức kế toán mới nhất",
          excerpt: "Cập nhật các quy định mới về kế toán, thuế và pháp lý doanh nghiệp",
          date: "2024-01-15",
          category: "Kiến thức",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          link: "/bai-viet/1"
        },
        {
          id: 2,
          title: "Dịch vụ thành lập doanh nghiệp",
          excerpt: "Hướng dẫn chi tiết các bước thành lập doanh nghiệp nhanh chóng và hiệu quả",
          date: "2024-01-10",
          category: "Dịch vụ",
          image: "https://images.unsplash.com/photo-1556761175-5973dc0f5d15?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          link: "/bai-viet/2"
        },
        {
          id: 3,
          title: "Quản lý tài chính doanh nghiệp",
          excerpt: "Chiến lược quản lý tài chính hiệu quả cho doanh nghiệp vừa và nhỏ",
          date: "2024-01-05",
          category: "Tài chính",
          image: "https://images.unsplash.com/photo-1553875270-ec1fd38b1e27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          link: "/bai-viet/3"
        },
        {
          id: 4,
          title: "Thuế cho hộ kinh doanh cá thể",
          excerpt: "Những điều cần biết về nghĩa vụ thuế cho hộ kinh doanh cá thể năm 2024",
          date: "2024-01-01",
          category: "Thuế",
          image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          link: "/bai-viet/4"
        }
      ];
    }

    setPosts(savedPosts);
  }, []);

  // Hook xử lý animation
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => { elements.forEach(el => observer.unobserve(el)); };
  }, []);

  const entershipImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [impressiveNumbers, setImpressiveNumbers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Load impressive numbers from localStorage or use defaults
  useEffect(() => {
    const savedImpressiveNumbers = JSON.parse(localStorage.getItem('impressiveNumbers')) || [
      { id: 1, value: "15+", label: "Năm kinh nghiệm", icon: "fas fa-calendar-alt" },
      { id: 2, value: "3500+", label: "Khách hàng tin dùng", icon: "fas fa-users" },
      { id: 3, value: "99%", label: "Khách hàng hài lòng", icon: "fas fa-smile" },
      { id: 4, value: "100+", label: "Chuyên gia nhân sự", icon: "fas fa-user-tie" }
    ];
    setImpressiveNumbers(savedImpressiveNumbers);
  }, []);

  const handleOrderClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = (order) => {
    // Additional processing if needed
    setShowOrderForm(false);
  };

  const closeOrderForm = () => {
    setShowOrderForm(false);
  };

  // Load products from localStorage
  useEffect(() => {
    // Define 6 specific service products (one for each service category) with format matching service pages
    const defaultProducts = [
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
        timeToComplete: "Trọn gói 7-10 ngày",
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

    // Get products from localStorage or use default service products
    const savedProducts = JSON.parse(localStorage.getItem('homepageProducts')) || defaultProducts;

    setProducts(savedProducts);
  }, []);

  const processSteps = [
    { step: "01", title: "TIẾP NHẬN", desc: "Lắng nghe nhu cầu & phân tích hồ sơ." },
    { step: "02", title: "TƯ VẤN", desc: "Đề xuất giải pháp pháp lý tối ưu." },
    { step: "03", title: "KÝ KẾT", desc: "Thống nhất hợp đồng minh bạch." },
    { step: "04", title: "TRIỂN KHAI", desc: "Thực hiện nghiệp vụ đúng tiến độ." },
    { step: "05", title: "BÁO CÁO", desc: "Bàn giao kết quả & hỗ trợ sau dịch vụ." }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff', color: '#333333', fontFamily: 'Arial, sans-serif' }}>
      <style>
        {`
          @keyframes slowZoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .banner-bg-animate { animation: slowZoom 20s infinite alternate ease-in-out; }
          .banner-content-animate { animation: fadeInUp 1s ease-out forwards; }
          .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
          .animate-visible { opacity: 1; transform: translateY(0); }
          .delay-100 { transition-delay: 0.1s; }
          .delay-200 { transition-delay: 0.2s; }
          .delay-300 { transition-delay: 0.3s; }
          .delay-400 { transition-delay: 0.4s; }

          /* Grid workflow chuyên nghiệp 5 cột */
          .workflow-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0;
            position: relative;
          }
          .workflow-item {
            position: relative;
            padding: 20px 10px;
            text-align: center;
          }
          /* Đường kẻ nối giữa các bước */
          .workflow-line {
            position: absolute;
            top: 40px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #444;
            z-index: 0;
          }
          .workflow-item:last-child .workflow-line {
            display: none;
          }
          /* Responsive cho workflow: Chuyển thành dọc trên mobile */
          @media (max-width: 1024px) {
            .workflow-container { grid-template-columns: 1fr; gap: 40px; }
            .workflow-line {
              width: 2px; height: 100%;
              top: 100%; left: 50%; transform: translateX(-50%);
            }
            .workflow-item:last-child .workflow-line { display: none; }
          }
        `}
      </style>

      {/* Banner Slider Section - Adjusted to account for fixed header */}
      <section className="hero-banner-section relative" style={{ paddingTop: '0px', height: '500px', marginTop: '0px' }}>
        <BannerSlider banners={banners} />
      </section>

      {/* News & Notifications Section - Positioned to account for fixed header */}
      <div style={{ marginTop: '0px', position: 'relative', zIndex: '10' }}>
        <NewsNotificationGrid />
      </div>

      {/* THÀNH LẬP DOANH NGHIỆP */}
      <section className="hero-section bg-gray-100 py-15" style={{ backgroundColor: '#f8f9fa', padding: '80px 0' }}>
        <div className="container max-w-6xl mx-auto px-4 hero-content" style={{ display: 'flex', alignItems: 'center', gap: '50px', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div className="hero-text animate-on-scroll" style={{ flex: '1.2', minWidth: '300px' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontSize: '2.5em', color: '#333', marginBottom: '20px', borderLeft: '5px solid #007bff', paddingLeft: '20px', lineHeight: '1.2' }}>THÀNH LẬP DOANH NGHIỆP</h1>
            <p className="text-gray-600" style={{ fontSize: '1.1em', lineHeight: '1.6', marginBottom: '20px' }}>Dễ dàng – Hiệu quả – Chất lượng. Đồng hành tận tâm và chuyên nghiệp cùng sự phát triển doanh nghiệp của bạn ngay từ những viên gạch đầu tiên.</p>
            <strong className="text-[#D4AF37]" style={{ color: '#D4AF37', display: 'block', marginTop: '10px', fontStyle: 'italic', fontSize: '1.1em' }}>Hỗ trợ 24/7: Đội ngũ chuyên gia sẵn sàng giải đáp mọi vấn đề pháp lý và thuế.</strong>
            <div className="hero-features flex justify-between gap-5 mt-8" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '15px', flexWrap: 'wrap' }}>
              <div className="feature-item text-center flex-1 bg-gray-200 p-4 rounded font-bold text-sm" style={{ textAlign: 'center', flex: '1', backgroundColor: '#e9ecef', padding: '15px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em', color: '#495057', minWidth: '120px' }}>TƯ VẤN 1:1<br/>KHÔNG CHỜ ĐỢI</div>
              <div className="feature-item text-center flex-1 bg-gray-200 p-4 rounded font-bold text-sm" style={{ textAlign: 'center', flex: '1', backgroundColor: '#e9ecef', padding: '15px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em', color: '#495057', minWidth: '120px' }}>THẤU HIỂU<br/>ĐÚNG TRỌNG TÂM</div>
              <div className="feature-item text-center flex-1 bg-gray-200 p-4 rounded font-bold text-sm" style={{ textAlign: 'center', flex: '1', backgroundColor: '#e9ecef', padding: '15px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em', color: '#495057', minWidth: '120px' }}>CHUYÊN NGHIỆP<br/>NẮM TỪNG TIẾN ĐỘ</div>
            </div>
          </div>
          <div className="hero-image animate-on-scroll delay-200" style={{ flex: '1', textAlign: 'center', minWidth: '300px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '100%', height: '100%', border: '3px solid #007bff', borderRadius: '8px', zIndex: 0 }}></div>
              <img src={entershipImage} alt="Thành lập doanh nghiệp" className="max-w-full h-auto rounded shadow-lg" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }} />
            </div>
          </div>
        </div>
      </section>

      {/* LĨNH VỰC HOẠT ĐỘNG */}
      <section className="services-section bg-gray-50 py-15" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-center mb-12 text-primary uppercase animate-on-scroll" style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#007bff', marginBottom: '50px', textAlign: 'center' }}>LĨNH VỰC HOẠT ĐỘNG</h2>
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'center' }}>
            <div className="service-card bg-white p-6 border-t-4 border-primary rounded text-left transition-transform hover:scale-105 animate-on-scroll" style={{ backgroundColor: '#fff', padding: '25px', borderTop: '4px solid #007bff', borderRadius: '4px', textAlign: 'left', transition: 'transform 0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h4 className="number text-xl font-bold text-primary mb-3" style={{ fontSize: '1.2em', color: '#007bff', marginBottom: '10px' }}><span className="text-2xl font-bold text-gray-800 mr-1">01.</span> ĐĂNG KÝ KINH DOANH</h4>
              <p>Thực hiện trọn gói hồ sơ và thủ tục đăng ký thành lập mới, thay đổi nội dung ĐKKD (tăng vốn, chuyển đổi loại hình, thay đổi địa chỉ...).</p>
            </div>
            <div className="service-card bg-white p-6 border-t-4 border-primary rounded text-left transition-transform hover:scale-105 animate-on-scroll delay-100" style={{ backgroundColor: '#fff', padding: '25px', borderTop: '4px solid #007bff', borderRadius: '4px', textAlign: 'left', transition: 'transform 0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h4 className="number text-xl font-bold text-primary mb-3" style={{ fontSize: '1.2em', color: '#007bff', marginBottom: '10px' }}><span className="text-2xl font-bold text-gray-800 mr-1">02.</span> KẾ TOÁN DOANH NGHIỆP</h4>
              <p>Hỗ trợ lập kế hoạch thuế chiến lược, rà soát và tư vấn áp dụng các chính sách ưu đãi, giảm thiểu rủi ro vi phạm, và đại diện làm việc với cơ quan thuế.</p>
            </div>
            <div className="service-card bg-white p-6 border-t-4 border-primary rounded text-left transition-transform hover:scale-105 animate-on-scroll delay-200" style={{ backgroundColor: '#fff', padding: '25px', borderTop: '4px solid #007bff', borderRadius: '4px', textAlign: 'left', transition: 'transform 0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h4 className="number text-xl font-bold text-primary mb-3" style={{ fontSize: '1.2em', color: '#007bff', marginBottom: '10px' }}><span className="text-2xl font-bold text-gray-800 mr-1">03.</span> THIẾT KẾ WEBSITE</h4>
              <p>Phân tích yêu cầu, mục tiêu kinh doanh, và đối tượng người dùng để đưa ra cấu trúc và chức năng website tối ưu nhất.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-300" style={{ border: '1px solid #dee2e6', margin: '0 20px' }} />

      {/* CON SỐ ẤN TƯỢNG */}
      <section ref={statsRef} className="counter-section bg-gray-100 py-15 text-center" style={{ backgroundColor: '#f8f9fa', padding: '80px 0', textAlign: 'center' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-center mb-12 text-[#D4AF37] uppercase animate-on-scroll" style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '60px', textAlign: 'center' }}>NHỮNG CON SỐ ẤN TƯỢNG</h2>
          <div className="counter-grid flex flex-wrap justify-around gap-8 animate-on-scroll delay-100" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '30px' }}>
            {impressiveNumbers.map((number, index) => (
              <CounterItem
                key={`number-${number.id || index}`}
                targetValue={number.value}
                label={number.label}
                icon={number.icon || 'fas fa-star'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="products-section bg-gray-50 py-15 text-center" style={{ backgroundColor: '#f8f9fa', padding: '60px 0', textAlign: 'center' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-center mb-12 text-[#D4AF37] uppercase animate-on-scroll" style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '60px', textAlign: 'center' }}>DỊCH VỤ TIÊU BIỂU</h2>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'center', justifyContent: 'center' }}>
            {products.map((product, index) => (
              <div key={`product-${product.id || index}`} className={`product-card bg-white rounded-xl shadow-lg overflow-hidden ${product.popular ? 'border-2 border-[#D4AF37] relative' : 'border-2 border-gray-200'} `} style={{ backgroundColor: '#fff', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', border: product.popular ? '2px solid #D4AF37' : '2px solid #e5e7eb', position: 'relative' }}>
              {/* Popular badge */}
              {product.popular && (
                <div
                  className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '0.25rem 1rem',
                    borderRadius: '0 0 0 0.5rem',
                    textTransform: 'uppercase',
                    zIndex: '10'
                  }}
                >
                  Phổ biến
                </div>
              )}
              <div className="p-6 text-gray-800 flex flex-col h-full" style={{ padding: '1.5rem', color: '#1f2937', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex-grow" style={{ flexGrow: 1 }}>
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-2" style={{ fontSize: '1.25rem', fontWeight: '700', textAlign: 'center', color: '#1f2937', marginBottom: '0.5rem' }}>{product.name || product.title}</h3>
                    <div className="text-center mb-4" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <span className="text-3xl font-bold text-red-600" style={{ fontSize: '1.875rem', fontWeight: '700', color: '#dc2626' }}>{product.price}</span>
                    </div>
                    <p className="text-gray-700 text-sm text-center mb-6" style={{ color: '#374151', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>{product.description}</p>

                    <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                      <h4 className="font-bold text-gray-800 mb-3 text-sm" style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Tính năng bao gồm:</h4>
                      <ul className="space-y-2" style={{ spacing: '0.5rem' }}>
                        {product.features && product.features.length > 0 ? (
                          product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <span className="text-red-600 mr-2" style={{ color: '#dc2626', marginRight: '0.5rem' }}>•</span>
                              <span className="text-gray-700 text-sm" style={{ color: '#374151', fontSize: '0.875rem' }}>{feature}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <span className="text-red-600 mr-2" style={{ color: '#dc2626', marginRight: '0.5rem' }}>•</span>
                            <span className="text-gray-700 text-sm" style={{ color: '#374151', fontSize: '0.875rem' }}>Tính năng 1</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                      <p className="text-gray-700 text-sm mb-1" style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span className="font-medium text-gray-800" style={{ fontWeight: '500', color: '#1f2937' }}>Phù hợp:</span> {product.suitableFor || 'Phù hợp cho'}
                      </p>
                      <p className="text-gray-700 text-sm" style={{ color: '#374151', fontSize: '0.875rem' }}>
                        <span className="font-medium text-gray-800" style={{ fontWeight: '500', color: '#1f2937' }}>Thời gian:</span> {product.timeToComplete || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrderClick(product)}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium mt-auto"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', color: '#fff', borderRadius: '0.5rem', transition: 'background-color 0.15s', fontWeight: '500', marginTop: 'auto' }}
                  >
                    {product.buttonText || 'ĐẶT DỊCH VỤ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && selectedPackage && (
        <ServiceOrderForm
          serviceName={selectedPackage.name}
          servicePrice={selectedPackage.price}
          onClose={closeOrderForm}
          onSubmit={handleOrderSubmit}
        />
      )}

      <hr className="border-gray-300" style={{ border: '1px solid #dee2e6', margin: '0 20px' }} />

      {/* WORKFLOW SECTION (5 Bước - 1 Hàng) */}
      <section className="workflow-section bg-gray-100 py-20" style={{ backgroundColor: '#f8f9fa', padding: '80px 0' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-center mb-16 text-[#D4AF37] uppercase animate-on-scroll" style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '60px', textAlign: 'center' }}>QUY TRÌNH HỢP TÁC CHUYÊN NGHIỆP</h2>

          <div className="workflow-container animate-on-scroll delay-100">
            {processSteps.map((item, index) => (
              <div key={`step-${index}`} className="workflow-item">
                {/* Đường nối */}
                <div className="workflow-line"></div>

                {/* Vòng tròn số */}
                <div
                  className="step-circle mx-auto mb-6 flex items-center justify-center rounded-full bg-white border-4 border-[#D4AF37] text-[#D4AF37] text-2xl font-bold transition-transform hover:scale-110 relative z-10"
                  style={{ width: '80px', height: '80px', margin: '0 auto 15px', borderRadius: '50%', backgroundColor: '#fff', border: '4px solid #D4AF37', color: '#D4AF37', fontSize: '1.5em', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)' }}
                >
                  {item.step}
                </div>
                {/* Nội dung */}
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontSize: '1.2em', color: '#333', marginBottom: '8px' }}>{item.title}</h3>
                <p className="text-gray-600 text-sm" style={{ color: '#6c757d', fontSize: '0.9em', lineHeight: '1.4', padding: '0 10px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CONTACT STRIP (Nội dung kết thúc) */}
      <div className="bg-[#D4AF37] py-8" style={{ backgroundColor: '#D4AF37', padding: '40px 0' }}>
        <div className="container max-w-6xl mx-auto px-4 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h3 className="text-2xl font-bold text-white mb-4" style={{ fontSize: '1.8em', color: '#fff', marginBottom: '20px' }}>Bạn cần tư vấn?</h3>
          <p className="text-white text-lg mb-6" style={{ color: '#fff', fontSize: '1.2em', marginBottom: '30px' }}>Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
          <div className="contact-info flex flex-col md:flex-row justify-center items-center gap-8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexDirection: 'row', flexWrap: 'wrap' }}>
            <div className="contact-item flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-phone-alt text-white text-2xl mr-3" style={{ fontSize: '1.5em', color: '#fff', marginRight: '15px' }}></i>
              <div className="contact-details" style={{ textAlign: 'left' }}>
                <p className="text-white font-bold" style={{ color: '#fff', fontWeight: 'bold' }}>GỌI NGAY</p>
                <p className="text-white text-xl font-bold" style={{ color: '#fff', fontSize: '1.5em', fontWeight: 'bold' }}>093 209 7986</p>
              </div>
            </div>
            <div className="contact-item flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-envelope text-white text-2xl mr-3" style={{ fontSize: '1.5em', color: '#fff', marginRight: '15px' }}></i>
              <div className="contact-details" style={{ textAlign: 'left' }}>
                <p className="text-white font-bold" style={{ color: '#fff', fontWeight: 'bold' }}>EMAIL</p>
                <p className="text-white" style={{ color: '#fff' }}>ketoansenvang.net@gmail.com</p>
              </div>
            </div>
            <div className="contact-item flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-map-marker-alt text-white text-2xl mr-3" style={{ fontSize: '1.5em', color: '#fff', marginRight: '15px' }}></i>
              <div className="contact-details" style={{ textAlign: 'left' }}>
                <p className="text-white font-bold" style={{ color: '#fff', fontWeight: 'bold' }}>ĐỊA CHỈ</p>
                <p className="text-white" style={{ color: '#fff' }}>25/91 Nguyễn Bỉnh Khiêm, Phường 1, Quận 5, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;