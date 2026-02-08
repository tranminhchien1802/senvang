import React, { useState, useEffect } from 'react';
import FaqAccordion from '../components/FaqAccordion';
import { knowledgePageFAQs } from '../data/faqData';

const KnowledgePage = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Hướng Dẫn Thành Lập Doanh Nghiệp Năm 2024",
      excerpt: "Bộ luật hướng dẫn chi tiết các bước thành lập doanh nghiệp theo quy định mới nhất",
      content: "Hướng dẫn chi tiết các bước thành lập doanh nghiệp năm 2024 theo quy định mới nhất của Luật Doanh nghiệp. Bao gồm các loại hình doanh nghiệp, hồ sơ cần chuẩn bị, thủ tục thực hiện và các lưu ý quan trọng.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      date: "2024-01-15",
      category: "Thành lập doanh nghiệp"
    },
    {
      id: 2,
      title: "So Sánh Các Loại Hình Doanh Nghiệp Phổ Biến",
      excerpt: "So sánh chi tiết các loại hình doanh nghiệp phổ biến và ưu nhược điểm của từng loại",
      content: "Phân tích chi tiết các loại hình doanh nghiệp phổ biến tại Việt Nam bao gồm công ty TNHH, công ty cổ phần, doanh nghiệp tư nhân và công ty hợp danh. Ưu nhược điểm, điều kiện thành lập và phù hợp với từng mô hình kinh doanh.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
      date: "2024-01-14",
      category: "Tư vấn pháp lý"
    },
    {
      id: 3,
      title: "Các Thủ Tục Sau Khi Thành Lập Doanh Nghiệp",
      excerpt: "Danh sách các thủ tục cần thực hiện sau khi thành lập doanh nghiệp thành công",
      content: "Sau khi thành lập doanh nghiệp, bạn cần thực hiện các thủ tục quan trọng như khắc dấu, thông báo mẫu dấu, đăng ký chữ ký số, tài khoản ngân hàng, mua chữ ký số, đăng ký nộp thuế điện tử, và nhiều thủ tục khác.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      date: "2024-01-13",
      category: "Thủ tục sau thành lập"
    },
    {
      id: 4,
      title: "Dịch Vụ Kế Toán Cho Doanh Nghiệp Nhỏ",
      excerpt: "Tại sao doanh nghiệp nhỏ cần sử dụng dịch vụ kế toán chuyên nghiệp",
      content: "Dịch vụ kế toán giúp doanh nghiệp nhỏ tiết kiệm thời gian, đảm bảo tuân thủ pháp luật, giảm thiểu sai sót và tập trung vào hoạt động kinh doanh chính. Các gói dịch vụ kế toán phù hợp với từng quy mô doanh nghiệp.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      date: "2024-01-12",
      category: "Kế toán doanh nghiệp"
    },
    {
      id: 5,
      title: "Các Loại Thuế Phải Nộp Cho Doanh Nghiệp Mới",
      excerpt: "Tổng hợp các loại thuế mà doanh nghiệp mới cần biết và thực hiện",
      content: "Doanh nghiệp mới cần nắm rõ các loại thuế phải nộp bao gồm thuế môn bài, thuế GTGT, thuế TNDN, và các loại thuế khác theo quy định. Hướng dẫn cách tính và thời hạn nộp thuế.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      date: "2024-01-11",
      category: "Thuế doanh nghiệp"
    },
    {
      id: 6,
      title: "Lợi Ích Của Việc Sử Dụng Dịch Vụ Kế Toán Trọn Gói",
      excerpt: "Tại sao nên lựa chọn dịch vụ kế toán trọn gói thay vì tự làm kế toán nội bộ",
      content: "Dịch vụ kế toán trọn gói giúp doanh nghiệp tiết kiệm chi phí, đảm bảo tính chuyên nghiệp, tuân thủ pháp luật và có đội ngũ chuyên gia hỗ trợ khi cần thiết.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
      date: "2024-01-10",
      category: "Tư vấn kinh doanh"
    },
    {
      id: 7,
      title: "Hướng Dẫn Xin Giấy Phép Kinh Doanh",
      excerpt: "Các bước cần thực hiện để xin giấy phép kinh doanh cho doanh nghiệp",
      content: "Hướng dẫn chi tiết các bước xin giấy phép kinh doanh, các loại giấy phép cần thiết và thủ tục pháp lý liên quan.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      date: "2024-01-09",
      category: "Thủ tục sau thành lập"
    },
    {
      id: 8,
      title: "Quyền Và Nghĩa Vụ Của Doanh Nghiệp",
      excerpt: "Tổng hợp quyền lợi và nghĩa vụ pháp lý của doanh nghiệp tại Việt Nam",
      content: "Phân tích chi tiết các quyền lợi và nghĩa vụ pháp lý mà doanh nghiệp cần biết để hoạt động đúng quy định.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
      date: "2024-01-08",
      category: "Tư vấn pháp lý"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load articles from localStorage if available
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('knowledgeArticles')) || JSON.parse(localStorage.getItem('featuredArticles')) || JSON.parse(localStorage.getItem('blogPosts')) || articles;
    
    // Sort articles: featured articles first, then by date (most recent first)
    const sortedArticles = [...savedArticles].sort((a, b) => {
      // If one is featured and the other is not, featured comes first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      // Otherwise sort by date (most recent first)
      return new Date(b.date || b.createdAt || new Date()) - new Date(a.date || a.createdAt || new Date());
    });
    
    setArticles(sortedArticles);

    // Luôn lưu dữ liệu vào localStorage để đảm bảo admin có thể truy cập
    localStorage.setItem('knowledgeArticles', JSON.stringify(sortedArticles));
    localStorage.setItem('featuredArticles', JSON.stringify(sortedArticles));
    localStorage.setItem('blogPosts', JSON.stringify(sortedArticles));
  }, []);

  // Filter articles based on category
  const filteredArticles = articles.filter(article => {
    return selectedCategory === 'all' || article.category === selectedCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-12" style={{ backgroundColor: '#f8f9fa', padding: '3rem 0', fontFamily: 'Arial, sans-serif' }}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontSize: '2.5em', color: '#333', marginBottom: '1rem' }}>
            KIẾN THỨC DOANH NGHIỆP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.25em', color: '#666' }}>
            Cẩm nang pháp lý, kế toán, thuế và kinh doanh cho doanh nghiệp
          </p>
        </div>


        {/* Category Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category || (category === 'all' && selectedCategory === 'all')
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Tất cả danh mục' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Hiển thị <span className="font-bold text-[#D4AF37]">{filteredArticles.length}</span> bài viết
            {selectedCategory !== 'all' && (
              <span> trong danh mục <span className="font-bold text-[#D4AF37]">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* All Articles Section */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', transition: 'box-shadow 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {article.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium" style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex-grow" style={{ fontSize: '1.25em', color: '#333', marginBottom: '1rem' }}>
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow" style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {article.excerpt}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-sm text-gray-500" style={{ fontSize: '0.875rem', color: '#777' }}>
                      {new Date(article.date).toLocaleDateString('vi-VN')}
                    </span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:text-[#b8942f] font-medium inline-flex items-center"
                      style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}
                    >
                      Đọc tiếp
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Không có bài viết nào trong danh mục này</div>
            </div>
          )}
        </div>

      </div>

      {/* FAQ Section */}
      <FaqAccordion 
        faqs={knowledgePageFAQs} 
        title="Câu Hỏi Thường Gặp Về Pháp Lý Doanh Nghiệp" 
      />

    </div>
  );
};

export default KnowledgePage;