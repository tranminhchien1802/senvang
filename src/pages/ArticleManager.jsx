import React, { useState, useEffect } from 'react';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Bài viết',
    isMain: false,      // Là bài viết chính
    isNotification: false,
    isFeatured: false,
    url: '' // Trường URL liên kết
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Drag and Drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  // Load articles from localStorage
  useEffect(() => {
    let savedArticles = JSON.parse(localStorage.getItem('knowledgeArticles')) || [];
    
    // Check if the specific article "Các Loại Thuế Phải Nộp Cho Doanh Nghiệp Mới" exists
    const articleExists = savedArticles.some(article => 
      article.title === "Các Loại Thuế Phải Nộp Cho Doanh Nghiệp Mới"
    );
    
    // If the article doesn't exist, add it to the list
    if (!articleExists) {
      const newArticle = {
        id: Date.now(), // Generate a unique ID
        title: "Các Loại Thuế Phải Nộp Cho Doanh Nghiệp Mới",
        excerpt: "Tổng hợp các loại thuế mà doanh nghiệp mới cần biết và thực hiện",
        content: "Doanh nghiệp mới cần nắm rõ các loại thuế phải nộp bao gồm thuế môn bài, thuế GTGT, thuế TNDN, và các loại thuế khác theo quy định. Hướng dẫn cách tính và thời hạn nộp thuế.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
        date: "2024-01-11",
        category: "Thuế doanh nghiệp",
        isMain: false,
        isNotification: false,
        isFeatured: false,
        url: ''
      };
      
      savedArticles = [newArticle, ...savedArticles]; // Add to the beginning
      localStorage.setItem('knowledgeArticles', JSON.stringify(savedArticles));
    }
    
    setArticles(savedArticles);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing article
      const updatedArticles = articles.map(article =>
        article.id === editingId ? { ...formData, id: editingId } : article
      );
      setArticles(updatedArticles);
      localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    } else {
      // Add new article
      const newArticle = {
        ...formData,
        id: Date.now() // Simple ID generation
      };
      const updatedArticles = [...articles, newArticle];
      setArticles(updatedArticles);
      localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Bài viết',
      isNotification: false,
      isFeatured: false,
      url: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (article) => {
    setFormData(article);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const updatedArticles = articles.filter(article => article.id !== id);
      setArticles(updatedArticles);
      localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
    }
  };

  const toggleForm = () => {
    if (showForm) {
      resetForm();
    } else {
      setShowForm(true);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set a transparent drag image or custom drag image
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverItemIndex(null);
    
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      return;
    }

    // Create a copy of articles array
    const updatedArticles = [...articles];
    
    // Remove the dragged item
    const [draggedItem] = updatedArticles.splice(draggedItemIndex, 1);
    
    // Insert it at the new position
    updatedArticles.splice(dropIndex, 0, draggedItem);
    
    // Update state
    setArticles(updatedArticles);
    setDraggedItemIndex(null);
    
    // Save to localStorage
    localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bài Viết & Thông Báo</h1>
          <button
            onClick={toggleForm}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] transition-colors"
          >
            {showForm ? 'Hủy' : 'Thêm Bài Viết'}
          </button>
        </div>

        {/* Form for adding/editing articles */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="Bài viết">Bài viết</option>
                    <option value="Thông báo">Thông báo</option>
                    <option value="Tin tức">Tin tức</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="URL của ảnh đại diện"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL liên kết (tùy chọn)
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="https://example.com/bai-viet"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả ngắn *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    rows="3"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    rows="4"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isMain"
                      checked={formData.isMain}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Là bài viết chính</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isNotification"
                      checked={formData.isNotification}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Là thông báo</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Là bài viết nổi bật</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày đăng
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách bài viết & thông báo ({articles.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              💡 Kéo thả để thay đổi vị trí các bài viết
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kéo thả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <tr
                      key={article.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`hover:bg-gray-50 cursor-move transition-colors duration-200 ${
                        draggedItemIndex === index ? 'opacity-50 bg-yellow-50' : ''
                      } ${
                        dragOverItemIndex === index && draggedItemIndex !== index ? 'border-t-2 border-b-2 border-[#D4AF37]' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <span className="text-lg">⋮⋮</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {article.excerpt.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.url ? (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 text-sm truncate block max-w-xs"
                          >
                            🔗 {article.url}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Không có</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {article.isMain && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              CV
                            </span>
                          )}
                          {article.isNotification && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              TB
                            </span>
                          )}
                          {article.isFeatured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              NB
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      Chưa có bài viết hoặc thông báo nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleManager;