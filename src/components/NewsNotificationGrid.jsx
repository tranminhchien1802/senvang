import React, { useState, useEffect } from 'react';

const NewsNotificationGrid = () => {
  const [articles, setArticles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load articles from localStorage
    let savedArticles = JSON.parse(localStorage.getItem('knowledgeArticles')) ||
                       JSON.parse(localStorage.getItem('featuredArticles')) ||
                       JSON.parse(localStorage.getItem('blogPosts')) ||
                       JSON.parse(localStorage.getItem('newsArticles')) ||
                       JSON.parse(localStorage.getItem('homepageArticles')) ||
                       [];

    // If no articles found, create sample data
    if (savedArticles.length === 0) {
      savedArticles = [
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

      // Save sample data to localStorage
      localStorage.setItem('knowledgeArticles', JSON.stringify(savedArticles));
    }

    // Updated logic based on your requirements:
    // - When "Là bài viết chính" is selected, article appears in main position (where "Chưa có bài viết nào" is)
    // - When "Là thông báo" is selected, article appears in "THÔNG BÁO MỚI NHẤT" section (sidebar)
    // - When "Là bài viết nổi bật" is selected, article appears under main article
    // - When multiple flags are selected, article appears in corresponding sections

    // Get the main article (with isMain flag) - only 1 should be shown as main
    const mainArticle = savedArticles
      .filter(article => article.isMain)
      .sort((a, b) => new Date(b.date || b.createdAt || new Date()) - new Date(a.date || a.createdAt || new Date()))
      .slice(0, 1); // Only take the most recent one

    // Get articles for sidebar notifications (with isNotification flag but not isMain)
    const notificationArticles = savedArticles
      .filter(article => article.isNotification && !article.isMain)
      .sort((a, b) => new Date(b.date || b.createdAt || new Date()) - new Date(a.date || a.createdAt || new Date()))
      .slice(0, 3); // Up to 3 notifications in sidebar

    // Get articles for under main article section (with isFeatured flag but not isMain)
    const featuredUnderMain = savedArticles
      .filter(article => article.isFeatured && !article.isMain)
      .sort((a, b) => new Date(b.date || b.createdAt || new Date()) - new Date(a.date || a.createdAt || new Date()))
      .slice(0, 5); // Up to 5 featured articles under main

    // Set the articles and notifications
    setArticles([...mainArticle, ...featuredUnderMain]); // Main article first, then featured under it
    setNotifications(notificationArticles); // Notifications in sidebar
  }, []);

  return (
    <div className="py-15 bg-gray-50" style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Professional news layout with 70/30 split */}
        <div className="news-container" style={{ display: 'flex', gap: '20px' }}>
          {/* Featured articles section (left side) */}
          <div className="main-news" style={{ flex: '7' }}>
            <div className="category-tag" style={{
              backgroundColor: '#005a9e',
              color: 'white',
              padding: '5px 15px',
              display: 'inline-block',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              BÀI VIẾT
            </div>

            {articles.length > 0 ? (
              <>
                {/* Main article (first article in the list should be the main one) */}
                {articles[0]?.isMain && (
                  <div className="featured-article" style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '10px',
                    borderTop: '2px solid #005a9e',
                    paddingTop: '15px'
                  }}>
                    <div className="flex-shrink-0" style={{ flex: '0 0 300px' }}>
                      {articles[0].image && (
                        <img
                          src={articles[0].image}
                          alt={articles[0].title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      )}
                    </div>
                    <div className="featured-content" style={{ flex: '1' }}>
                      <h3 style={{
                        fontSize: '1.2em',
                        color: '#005a9e',
                        marginBottom: '10px',
                        fontWeight: 'bold'
                      }}>
                        {articles[0].title}
                      </h3>
                      <p style={{
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '15px'
                      }}>
                        {articles[0].excerpt || articles[0].description}
                      </p>
                      {articles[0].link ? (
                        <a
                          href={articles[0].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#005a9e',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.9em'
                          }}
                          className="read-more"
                        >
                          XEM THÊM...
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(articles[0].title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#005a9e',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.9em'
                          }}
                          className="read-more"
                        >
                          XEM THÊM...
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Featured articles under main article (those with isFeatured flag) */}
                {articles.slice(1).length > 0 && (
                  <div className="sub-news-grid" style={{ marginTop: '20px' }}>
                    {articles.slice(1).map((article, index) => (
                      <div key={`featured-under-main-${article.id || index}`} className="sub-notification" style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '10px 0',
                        borderBottom: '1px dashed #ccc',
                        alignItems: 'center',
                        backgroundColor: '#f0f8ff',
                        borderLeft: '3px solid #005a9e',
                        paddingLeft: '10px'
                      }}>
                        <div className="flex-shrink-0" style={{ width: '80px', height: '60px' }}>
                          {article.image && (
                            <img
                              src={article.image}
                              alt={article.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                        </div>
                        <div className="sub-notification-info" style={{ flex: '1' }}>
                          {article.link ? (
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#005a9e',
                                textDecoration: 'none',
                                fontSize: '14px',
                                margin: '0 0 5px 0',
                                lineHeight: '1.4'
                              }}
                            >
                              {article.title}
                            </a>
                          ) : (
                            <h4 style={{
                              fontSize: '14px',
                              color: '#005a9e',
                              margin: '0 0 5px 0',
                              lineHeight: '1.4'
                            }}>
                              {article.title}
                            </h4>
                          )}
                          <span style={{
                            fontSize: '11px',
                            color: '#666'
                          }}>
                            Ngày đăng: {new Date(article.date).toLocaleDateString('vi-VN')}
                            {article.isNotification && ' (Thông báo)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có bài viết nào
              </div>
            )}
          </div>

          {/* Sidebar news section (right side) */}
          <div className="sidebar-news" style={{ flex: '3', display: 'flex', flexDirection: 'column' }}>
            <div className="category-tag" style={{
              backgroundColor: '#005a9e',
              color: 'white',
              padding: '5px 15px',
              display: 'inline-block',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              THÔNG BÁO MỚI NHẤT
            </div>

            {notifications.length > 0 ? (
              notifications.map((article, index) => (
                <div key={article.id || index} className="sidebar-item" style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: '1px dashed #ddd',
                  alignItems: 'center'
                }}>
                  <div className="flex-shrink-0" style={{ width: '80px', height: '60px' }}>
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    )}
                  </div>
                  <div className="sidebar-info" style={{ flex: '1' }}>
                    {article.link ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#005a9e',
                          textDecoration: 'none',
                          fontSize: '14px',
                          margin: '0 0 5px 0',
                          lineHeight: '1.4'
                        }}
                      >
                        {article.title}
                      </a>
                    ) : (
                      <h4 style={{
                        fontSize: '14px',
                        color: '#005a9e',
                        margin: '0 0 5px 0',
                        lineHeight: '1.4'
                      }}>
                        {article.title}
                      </h4>
                    )}
                    <span style={{
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      Ngày đăng: {new Date(article.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có thông báo nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsNotificationGrid;