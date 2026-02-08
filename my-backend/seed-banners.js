const Banner = require('./models/Banner');
const mongoose = require('mongoose');
require('dotenv').config();

const sampleBanners = [
  {
    title: "DỊCH VỤ KẾ TOÁN CHUYÊN NGHIỆP",
    description: "Hơn 10 năm kinh nghiệm đồng hành cùng 5000+ doanh nghiệp khởi sự thành công. Chúng tôi mang đến sự an tâm tuyệt đối về pháp lý và tài chính.",
    buttonText: "Xem Các Dịch Vụ",
    buttonLink: "/dich-vu",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true,
    sortOrder: 1
  },
  {
    title: "THÀNH LẬP DOANH NGHIỆP",
    description: "Dễ dàng – Hiệu quả – Chất lượng. Đồng hành tận tâm và chuyên nghiệp cùng sự phát triển doanh nghiệp của bạn ngay từ những viên gạch đầu tiên.",
    buttonText: "Liên Hệ Tư Vấn",
    buttonLink: "/lien-he",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true,
    sortOrder: 2
  },
  {
    title: "GIẢI PHÁP TÀI CHÍNH TOÀN DIỆN",
    description: "Tư vấn chiến lược thuế, quản lý kế toán chuyên nghiệp, hỗ trợ pháp lý doanh nghiệp trọn đời.",
    buttonText: "Tìm Hiểu Thêm",
    buttonLink: "/",
    image: "https://images.unsplash.com/photo-1554224155-6d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true,
    sortOrder: 3
  }
];

async function seedBanners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing banners
    await Banner.deleteMany({});
    
    // Insert sample banners
    await Banner.insertMany(sampleBanners);
    
    console.log('✅ Sample banners seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
    process.exit(1);
  }
}

seedBanners();