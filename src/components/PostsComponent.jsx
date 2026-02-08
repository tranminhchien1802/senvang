import React, { useState, useEffect } from 'react';
import { getLatestNews } from '../utils/dataService';

const PostsComponent = ({ posts = [] }) => {
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    if (posts.length > 0) {
      setDisplayPosts(posts);
    } else {
      // Fetch from service if none provided
      const latestNews = getLatestNews(4);
      setDisplayPosts(latestNews);
    }
  }, [posts]);

  // Không hiển thị gì nếu không có bài viết
  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <div className="py-15 bg-gray-50" style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title text-3xl font-bold text-center mb-12 text-primary uppercase"
            style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#007bff', marginBottom: '50px', textAlign: 'center' }}>
          BÀI VIẾT MỚI NHẤT
        </h2>

        <div className="posts-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {displayPosts.map((post, index) => (
            <div
              key={post.id || index}
              className="post-card bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Post Content - Left Side */}
                <div className="md:w-1/2 p-6 flex flex-col justify-center" style={{ padding: '25px', flex: '1' }}>
                  <h3 className="text-xl font-bold text-primary mb-3" style={{ fontSize: '1.4em', color: '#007bff', marginBottom: '15px' }}>
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-4" style={{ color: '#495057', marginBottom: '15px', lineHeight: '1.6' }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="text-sm text-gray-500" style={{ fontSize: '0.9em', color: '#6c757d' }}>
                      {post.date ? new Date(post.date).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                    </span>
                  </div>
                </div>

                {/* Post Image - Right Side */}
                <div className="md:w-1/2" style={{ flex: '1' }}>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                      style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center" style={{ width: '100%', height: '192px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="text-gray-500">Không có hình ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4" style={{ padding: '15px 25px' }}>
                <a
                  href={`/bai-viet/${post.id || index}`}
                  className="text-primary hover:text-blue-700 font-medium inline-flex items-center"
                  style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}
                >
                  Đọc tiếp
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsComponent;