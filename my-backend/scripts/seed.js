const User = require('./models/User');

async function seed() {
  await User.deleteMany({}); // Xóa hết data cũ (dev only!)

  // Tạo admin
  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com', // Sửa lại email admin bạn muốn
    role: 'admin',
  });
  await admin.save();

  // Tạo user mẫu
  const users = [
    { name: 'Sếp Chiến', email: 'sepchien@gmail.com', role: 'user' },
    { name: 'Người dùng 1', email: 'user1@gmail.com', role: 'user' },
  ];

  await User.insertMany(users);
  console.log('✅ Đã thêm 1 admin và 2 user mẫu');
}

seed();