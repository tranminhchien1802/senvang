import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  // Dữ liệu mẫu cho các bài viết
  const [featuredArticle, setFeaturedArticle] = useState({
    id: 1,
    title: "Chiêu sinh khóa học thuế chuyên sâu",
    excerpt: "Chưa bao giờ môi trường thuế tại Việt Nam lại biến động nhanh chóng như hiện nay...",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    date: "2024-01-15",
    category: "Tin tức",
    views: 1250
  });

  const [recentArticles, setRecentArticles] = useState([
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
  ]);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">TIN TỨC & SỰ KIỆN</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Main news section with featured article and recent articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Left side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
                <div className="md:w-1/3 p-6 flex flex-col justify-center">
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-xs font-medium">
                      {featuredArticle.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    <Link to={`/tin-tuc/${featuredArticle.id}`} className="hover:text-[#D4AF37] transition-colors">
                      {featuredArticle.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(featuredArticle.date).toLocaleDateString('vi-VN')}</span>
                    <span>{featuredArticle.views} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles - Right side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">BÀI VIẾT MỚI NHẤT</h3>
              
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start space-x-3 group cursor-pointer">
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                        <Link to={`/tin-tuc/${article.id}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                        <span className="text-xs text-gray-500">{article.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/kien-thuc" 
                  className="inline-block px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] transition-colors font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;