import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedNews, getLatestNews } from '../utils/dataService';

const NewsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu bài viết từ service
    const featuredNews = getFeaturedNews();
    const latestNews = getLatestNews(4);
    
    setFeaturedArticles(featuredNews);
    setRecentArticles(latestNews);
    
    // Auto slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredArticles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">TIN TỨC & SỰ KIỆN</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slider Section - Left side */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              {/* Slides */}
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredArticles.map((article, index) => (
                  <div key={article.id || index} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-64 md:h-80 object-cover"
                          />
                        </div>
                        <div className="md:w-1/3 p-6 flex flex-col justify-center">
                          <div className="mb-3">
                            <span className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-xs font-medium">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            <Link to={`/tin-tuc/${article.id}`} className="hover:text-[#D4AF37] transition-colors">
                              {article.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                            <span>{article.views} lượt xem</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentSlide === index ? 'bg-[#D4AF37]' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
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

export default NewsSlider;