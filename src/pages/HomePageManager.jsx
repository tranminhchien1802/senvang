import React, { useState, useEffect } from 'react';

const HomePageManager = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [banners, setBanners] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    // Load articles
    const savedArticles = JSON.parse(localStorage.getItem('knowledgeArticles')) || JSON.parse(localStorage.getItem('featuredArticles')) || [];
    setArticles(savedArticles);

    // Load banners
    const savedBanners = JSON.parse(localStorage.getItem('banners')) || JSON.parse(localStorage.getItem('bannerSlides')) || JSON.parse(localStorage.getItem('sliderBanners')) || [];

    setBanners(savedBanners);
  }, []);

  // Articles management
  const addArticle = () => {
    const newArticle = {
      id: Date.now(),
      title: 'Tiêu đề bài viết mới',
      excerpt: 'Mô tả ngắn cho bài viết',
      content: 'Nội dung chi tiết của bài viết...',
      image: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Danh mục',
      isNotification: false,
      isFeatured: false,
      isAnnouncement: false
    };
    const updatedArticles = [...articles, newArticle];
    setArticles(updatedArticles);
    localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    localStorage.setItem('homepageArticles', JSON.stringify(updatedArticles));
  };

  const handleArticleImageChange = (articleId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedArticles = articles.map(article =>
          article.id === articleId ? { ...article, image: reader.result } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
        localStorage.setItem('homepageArticles', JSON.stringify(updatedArticles));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateArticle = (id, field, value) => {
    const updatedArticles = articles.map(article =>
      article.id === id ? { ...article, [field]: value } : article
    );
    setArticles(updatedArticles);
    localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    localStorage.setItem('homepageArticles', JSON.stringify(updatedArticles));
  };

  const deleteArticle = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const updatedArticles = articles.filter(article => article.id !== id);
      setArticles(updatedArticles);
      localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    }
  };

  const toggleEdit = (id) => {
    if (editingArticleId === id) {
      setEditingArticleId(null);
    } else {
      setEditingArticleId(id);
    }
  };


  // Banner management
  const addBanner = () => {
    const newBanner = {
      id: Date.now(),
      title: 'Tiêu đề banner mới',
      description: 'Mô tả cho banner',
      image: '',
      buttonText: 'Tìm hiểu thêm',
      buttonLink: '/'
    };
    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
  };

  const updateBanner = (id, field, value) => {
    const updatedBanners = banners.map(banner =>
      banner.id === id ? { ...banner, [field]: value } : banner
    );
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
  };

  const handleBannerImageChange = (bannerId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedBanners = banners.map(banner =>
          banner.id === bannerId ? { ...banner, image: reader.result } : banner
        );
        setBanners(updatedBanners);
        localStorage.setItem('banners', JSON.stringify(updatedBanners));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteBanner = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      const updatedBanners = banners.filter(banner => banner.id !== id);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản Lý Trang Chủ</h1>


        {/* Articles Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Quản Lý Bài Viết</h2>
            <button
              type="button"
              onClick={addArticle}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f]"
            >
              Thêm Bài Viết
            </button>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className={`border ${article.isFeatured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} rounded-lg p-4`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">Bài viết #{article.id}</h3>
                    {article.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Bài viết
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleEdit(article.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {editingArticleId === article.id ? 'Ẩn' : 'Sửa'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteArticle(article.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {editingArticleId === article.id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                      <input
                        type="text"
                        value={article.title}
                        onChange={(e) => updateArticle(article.id, 'title', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <input
                        type="text"
                        value={article.category}
                        onChange={(e) => updateArticle(article.id, 'category', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                      <input
                        type="date"
                        value={article.date}
                        onChange={(e) => updateArticle(article.id, 'date', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                      <input
                        type="text"
                        value={article.excerpt}
                        onChange={(e) => updateArticle(article.id, 'excerpt', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                      <textarea
                        value={article.content}
                        onChange={(e) => updateArticle(article.id, 'content', e.target.value)}
                        rows="3"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bài viết</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleArticleImageChange(article.id, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      {article.image && (
                        <div className="mt-2">
                          <img src={article.image} alt="Preview" className="w-32 h-24 object-cover border border-gray-300 rounded" />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Chọn ảnh cho bài viết (đề xuất: 400x300px)</p>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`notification-${article.id}`}
                          checked={article.isNotification || article.isAnnouncement}
                          onChange={(e) => updateArticle(article.id, 'isNotification', e.target.checked)}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                        />
                        <label htmlFor={`notification-${article.id}`} className="ml-2 block text-sm text-gray-700">
                          Là thông báo
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`featured-${article.id}`}
                          checked={article.isFeatured}
                          onChange={(e) => updateArticle(article.id, 'isFeatured', e.target.checked)}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                        />
                        <label htmlFor={`featured-${article.id}`} className="ml-2 block text-sm text-gray-700">
                          Là bài viết
                        </label>
                        {article.isFeatured && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                            Đang hiển thị
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Banners Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Quản Lý Banner</h2>
            <button
              type="button"
              onClick={addBanner}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f]"
            >
              Thêm Banner
            </button>
          </div>

          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">Banner #{banner.id}</h3>
                  <button
                    type="button"
                    onClick={() => deleteBanner(banner.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nút bấm</label>
                    <input
                      type="text"
                      value={banner.buttonText}
                      onChange={(e) => updateBanner(banner.id, 'buttonText', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <input
                      type="text"
                      value={banner.description}
                      onChange={(e) => updateBanner(banner.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liên kết nút bấm</label>
                    <input
                      type="text"
                      value={banner.buttonLink}
                      onChange={(e) => updateBanner(banner.id, 'buttonLink', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Banner</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBannerImageChange(banner.id, e)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    {banner.image && (
                      <div className="mt-2">
                        <img src={banner.image} alt="Banner Preview" className="w-32 h-20 object-cover border border-gray-300 rounded" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Chọn ảnh banner mới (đề xuất: 1200x400px)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageManager;