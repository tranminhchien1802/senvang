import React, { useState } from 'react';
import PostForm from '../components/PostForm';

const PostManager = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Chiêu sinh khóa học thuế chuyên sâu",
      excerpt: "Chưa bao giờ môi trường thuế tại Việt Nam lại biến động nhanh chóng như hiện nay...",
      content: "Nội dung chi tiết của bài viết về khóa học thuế chuyên sâu...",
      category: "Tin tức",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
      date: "2024-01-15",
      featured: true,
      views: 1250
    },
    {
      id: 2,
      title: "Hướng dẫn quyết toán thuế 2024",
      excerpt: "Các bước cần thực hiện để quyết toán thuế cuối năm hiệu quả...",
      content: "Nội dung chi tiết về hướng dẫn quyết toán thuế...",
      category: "Kiến thức",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
      date: "2024-01-14",
      featured: false,
      views: 980
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleCreatePost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    setPosts([newPost, ...posts]);
    setShowForm(false);
  };

  const handleUpdatePost = (postData) => {
    setPosts(posts.map(post => post.id === editingPost.id ? {...postData, id: editingPost.id} : post));
    setShowForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bài Viết</h1>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            Tạo bài viết mới
          </button>
        </div>

        {showForm ? (
          <PostForm
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            onCancel={handleCancel}
            initialData={editingPost}
          />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Có
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Không
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManager;