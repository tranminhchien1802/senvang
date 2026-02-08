import { getAllPosts, addPost } from '../utils/postUtils';

// Function to initialize sample posts
const initializeSamplePosts = () => {
  const existingPosts = getAllPosts();
  
  // If we already have posts, don't add samples again
  if (existingPosts.length > 0) {
    return;
  }

  // Sample posts for the website
  const samplePosts = [
    {
      id: '1',
      title: 'Hướng Dẫn Thành Lập Doanh Nghiệp Năm 2024',
      excerpt: 'Bộ luật hướng dẫn chi tiết các bước thành lập doanh nghiệp theo quy định mới nhất',
      content: 'Hướng dẫn chi tiết các bước thành lập doanh nghiệp năm 2024 theo quy định mới nhất của Luật Doanh nghiệp. Bao gồm các loại hình doanh nghiệp, hồ sơ cần chuẩn bị, thủ tục thực hiện và các lưu ý quan trọng.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
      date: new Date().toISOString(),
      featured: true,
      author: 'Admin',
      slug: 'huong-dan-thanh-lap-doanh-nghiep-2024'
    },
    {
      id: '2',
      title: 'So Sánh Các Loại Hình Doanh Nghiệp Phổ Biến',
      excerpt: 'So sánh chi tiết các loại hình doanh nghiệp phổ biến và ưu nhược điểm của từng loại',
      content: 'Phân tích chi tiết các loại hình doanh nghiệp phổ biến tại Việt Nam bao gồm công ty TNHH, công ty cổ phần, doanh nghiệp tư nhân và công ty hợp danh. Ưu nhược điểm, điều kiện thành lập và phù hợp với từng mô hình kinh doanh.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      featured: true,
      author: 'Admin',
      slug: 'so-sanh-loai-hinh-doanh-nghiep'
    },
    {
      id: '3',
      title: 'Các Thủ Tục Sau Khi Thành Lập Doanh Nghiệp',
      excerpt: 'Danh sách các thủ tục cần thực hiện sau khi thành lập doanh nghiệp thành công',
      content: 'Sau khi thành lập doanh nghiệp, bạn cần thực hiện các thủ tục quan trọng như khắc dấu, thông báo mẫu dấu, đăng ký chữ ký số, tài khoản ngân hàng, mua chữ ký số, đăng ký nộp thuế điện tử, và nhiều thủ tục khác.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      featured: false,
      author: 'Admin',
      slug: 'thu-tuc-sau-thanh-lap-doanh-nghiep'
    },
    {
      id: '4',
      title: 'Dịch Vụ Kế Toán Cho Doanh Nghiệp Nhỏ',
      excerpt: 'Tại sao doanh nghiệp nhỏ cần sử dụng dịch vụ kế toán chuyên nghiệp',
      content: 'Dịch vụ kế toán giúp doanh nghiệp nhỏ tiết kiệm thời gian, đảm bảo tuân thủ pháp luật, giảm thiểu sai sót và tập trung vào hoạt động kinh doanh chính. Các gói dịch vụ kế toán phù hợp với từng quy mô doanh nghiệp.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      featured: false,
      author: 'Admin',
      slug: 'dich-vu-ke-toan-doanh-nghiep-nho'
    }
  ];

  // Add sample posts to storage
  samplePosts.forEach(post => {
    addPost(post);
  });
};

export default initializeSamplePosts;