import React, { useState, useEffect } from 'react';
import { getAllPosts, addPost, updatePost, deletePost } from '../utils/postUtils';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    featured: false
  });

  // Load posts when component mounts
  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostForm({
      ...postForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPost) {
      // Update existing post
      updatePost(editingPost.id, postForm);
    } else {
      // Add new post
      addPost(postForm);
    }

    // Refresh posts
    setPosts(getAllPosts());

    // Reset form and close
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      featured: false
    });
    setShowForm(false);
    setEditingPost(null);
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || post.name || '',
      excerpt: post.excerpt || post.description || '',
      content: post.content || '',
      image: post.image || '',
      featured: post.featured || post.isFeatured || false
    });
    setShowForm(true);
  };

  const deletePostHandler = (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deletePost(postId);
      setPosts(getAllPosts());
    }
  };

  return (
    <div className="py-12" style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontSize: '2em', color: '#333' }}>
            Quản Lý Bài Viết
          </h1>
          <button
            onClick={() => {
              setEditingPost(null);
              setPostForm({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                featured: false
              });
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors shadow-md"
          >
            Thêm Bài Viết
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-xl">Chưa có bài viết nào</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(post)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deletePostHandler(post._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                  {post.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Nổi bật
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">
                {editingPost ? 'SỬA BÀI VIẾT' : 'THÊM BÀI VIẾT MỚI'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Tiêu đề <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={postForm.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Tóm tắt <span className="text-red-500">*</span></label>
                    <textarea
                      name="excerpt"
                      value={postForm.excerpt}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập tóm tắt bài viết"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Nội dung</label>
                    <textarea
                      name="content"
                      value={postForm.content}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập nội dung bài viết"
                      rows="5"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">URL hình ảnh</label>
                    <input
                      type="text"
                      name="image"
                      value={postForm.image}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập URL hình ảnh cho bài viết"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={postForm.featured}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-gray-700 font-medium">Bài viết nổi bật</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-all duration-300"
                  >
                    {editingPost ? 'CẬP NHẬT' : 'THÊM'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManager;