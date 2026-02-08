// Script cập nhật dữ liệu dịch vụ vào localStorage
// Sử dụng để cập nhật dữ liệu mới nhất cho người dùng hiện tại

const updateServicesData = () => {
  // Dữ liệu mới cho Đăng Ký Kinh Doanh
  const newBusinessRegistrationServices = [
    {
      id: 1,
      name: 'GÓI STARTED',
      price: '1.570.000đ',
      description: 'Dịch vụ thành lập doanh nghiệp cơ bản cho doanh nghiệp mới',
      features: [
        'Ủy quyền',
        'Hồ sơ đăng ký kinh doanh',
        'Bố cáo thành lập',
        'ĐKKD & MST',
        'Dấu tròn'
      ],
      suitableFor: 'Doanh nghiệp mới thành lập',
      timeToComplete: 'Trọn gói 3-5 ngày',
      popular: true
    },
    {
      id: 2,
      name: 'GÓI STANDARD',
      price: '3.239.000đ',
      description: 'Dịch vụ thành lập doanh nghiệp với các tiện ích mở rộng',
      features: [
        'Gói STARTED',
        'Khai thuế ban đầu',
        'Token 12 tháng',
        'Bảng hiệu',
        'Dấu tên'
      ],
      suitableFor: 'Doanh nghiệp vừa và nhỏ',
      timeToComplete: 'Trọn gói 5-7 ngày',
      popular: false
    },
    {
      id: 3,
      name: 'GÓI BUSINESS',
      price: '4.699.000đ',
      description: 'Gói dịch vụ hoàn chỉnh cho doanh nghiệp mới thành lập',
      features: [
        'Gói STANDARD',
        'Mở tài khoản ngân hàng',
        '300 số hóa đơn'
      ],
      suitableFor: 'Doanh nghiệp muốn dịch vụ trọn gói',
      timeToComplete: 'Trọn gói 7-10 ngày',
      popular: true
    },
    {
      id: 4,
      name: 'THAY ĐỔI 1 NỘI DUNG',
      price: '1.570.000đ',
      description: 'Dịch vụ thay đổi đăng ký kinh doanh 1 nội dung',
      features: [
        'Thay đổi 1 nội dung ĐKKD',
        'Hoàn tất thủ tục pháp lý',
        'Nhận kết quả sau 3-5 ngày'
      ],
      suitableFor: 'Doanh nghiệp cần thay đổi thông tin',
      timeToComplete: 'Trọn gói 3-5 ngày',
      popular: false
    },
    {
      id: 5,
      name: 'THAY ĐỔI 2-4 NỘI DUNG',
      price: '1.770.000đ - 2.150.000đ',
      description: 'Dịch vụ thay đổi đăng ký kinh doanh từ 2 đến 4 nội dung',
      features: [
        'Thay đổi từ 2-4 nội dung ĐKKD',
        'Hoàn tất thủ tục pháp lý',
        'Nhận kết quả sau 5-7 ngày'
      ],
      suitableFor: 'Doanh nghiệp cần thay đổi nhiều thông tin',
      timeToComplete: 'Trọn gói 5-7 ngày',
      popular: false
    },
    {
      id: 6,
      name: 'NỘI DUNG THAY ĐỔI',
      price: 'Liên hệ tư vấn',
      description: 'Dịch vụ thay đổi các nội dung ĐKKD: Tên công ty, địa chỉ, vốn điều lệ, ngành nghề, người đại diện, thành viên góp vốn, chuyển đổi loại hình DN',
      features: [
        'Tên công ty',
        'Địa chỉ',
        'Vốn điều lệ',
        'Ngành nghề',
        'Người đại diện',
        'Thành viên góp vốn',
        'Chuyển đổi loại hình DN'
      ],
      suitableFor: 'Doanh nghiệp cần thay đổi nhiều thông tin',
      timeToComplete: 'Tùy nội dung thay đổi',
      popular: false
    }
  ];

  // Dữ liệu mới cho Kế Toán Doanh Nghiệp
  const newAccountingServices = [
    {
      id: 'ktdn1',
      title: 'KẾ TOÁN TM DỊCH VỤ',
      price: '1.500.000đ',
      description: 'Dịch vụ kế toán cho doanh nghiệp thương mại dịch vụ',
      features: [
        'Kê khai thuế GTGT hàng tháng/quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Quyết toán thuế cuối năm',
        'Tư vấn kế toán miễn phí'
      ],
      suitableFor: 'Doanh nghiệp thương mại dịch vụ',
      timeComplete: 'Trọn gói 1 năm',
      popular: true,
      isPopular: true
    },
    {
      id: 'ktdn2',
      title: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
      price: '2.500.000đ',
      description: 'Dịch vụ kế toán cho doanh nghiệp thi công xây dựng',
      features: [
        'Kê khai thuế GTGT hàng tháng/quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Quyết toán thuế cuối năm',
        'Tư vấn kế toán miễn phí'
      ],
      suitableFor: 'Doanh nghiệp thi công xây dựng',
      timeComplete: 'Trọn gói 1 năm',
      popular: false,
      isPopular: false
    },
    {
      id: 'ktdn3',
      title: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
      price: '3.000.000đ',
      description: 'Dịch vụ kế toán cho doanh nghiệp gia công sản xuất',
      features: [
        'Kê khai thuế GTGT hàng tháng/quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Quyết toán thuế cuối năm',
        'Tư vấn kế toán miễn phí'
      ],
      suitableFor: 'Doanh nghiệp gia công sản xuất',
      timeComplete: 'Trọn gói 1 năm',
      popular: true,
      isPopular: true
    },
    {
      id: 'ktdn4',
      title: 'LÀM LẠI SỔ SÁCH KẾ TOÁN',
      price: '1.200.000đ',
      description: 'Dịch vụ làm lại sổ sách kế toán cho doanh nghiệp',
      features: [
        'Kiểm tra sổ sách hiện tại',
        'Lập lại chứng từ kế toán',
        'Cập nhật sổ sách theo quy định',
        'Tư vấn xử lý sai sót'
      ],
      suitableFor: 'Doanh nghiệp cần làm lại sổ sách',
      timeComplete: 'Tùy theo tình trạng sổ sách',
      popular: false,
      isPopular: false
    },
    {
      id: 'ktdn5',
      title: 'BÁO CÁO TÀI CHÍNH NĂM',
      price: '3.500.000đ',
      description: 'Dịch vụ lập báo cáo tài chính năm cho doanh nghiệp',
      features: [
        'Lập báo cáo tài chính năm',
        'Kiểm toán nội bộ',
        'Tư vấn tài chính',
        'Hỗ trợ giải trình với cơ quan thuế'
      ],
      suitableFor: 'Doanh nghiệp cần báo cáo tài chính năm',
      timeComplete: 'Theo quy định',
      popular: false,
      isPopular: false
    },
    {
      id: 'ktdn6',
      title: 'BỔ NHIỆM KẾ TOÁN TRƯỞNG',
      price: '4.000.000đ',
      description: 'Dịch vụ bổ nhiệm kế toán trưởng',
      features: [
        'Tư vấn pháp lý kế toán',
        'Đại diện làm việc với cơ quan thuế',
        'Hỗ trợ chuyên môn kế toán',
        'Quản lý hồ sơ kế toán'
      ],
      suitableFor: 'Doanh nghiệp cần bổ nhiệm kế toán trưởng',
      timeComplete: 'Trọn gói 1 năm',
      popular: false,
      isPopular: false
    },
    {
      id: 'ktdn7',
      title: 'ĐĂNG KÝ BHXH',
      price: '1.050.000đ - 1.550.000đ',
      description: 'Dịch vụ đăng ký bảo hiểm xã hội cho doanh nghiệp',
      features: [
        'Tư vấn chính sách BHXH',
        'Làm thủ tục đăng ký BHXH',
        'Theo dõi quá trình xử lý',
        'Hỗ trợ giải đáp thắc mắc'
      ],
      suitableFor: 'Doanh nghiệp cần đăng ký BHXH',
      timeComplete: 'Tùy số lượng nhân sự',
      popular: false,
      isPopular: false
    }
  ];

  // Dữ liệu mới cho Thuế Hộ Kinh Doanh
  const newTaxServices = [
    {
      id: 1,
      name: 'KHAI THUẾ TRẮNG (KHÔNG PHÁT SINH)',
      price: '800.000đ',
      description: 'Dịch vụ báo cáo thuế định kỳ cho hộ kinh doanh không có phát sinh',
      features: [
        'Kê khai thuế GTGT hàng quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Tư vấn thuế miễn phí'
      ],
      suitableFor: 'Hộ kinh doanh không có phát sinh',
      timeToComplete: 'Theo kỳ',
      popular: true
    },
    {
      id: 2,
      name: 'KHAI THUẾ CÓ PHÁT SINH HÓA ĐƠN',
      price: '1.500.000đ',
      description: 'Dịch vụ báo cáo thuế định kỳ cho hộ kinh doanh có phát sinh hóa đơn',
      features: [
        'Kê khai thuế GTGT hàng quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Tư vấn thuế miễn phí'
      ],
      suitableFor: 'Hộ kinh doanh có phát sinh hóa đơn',
      timeToComplete: 'Theo kỳ',
      popular: true
    },
    {
      id: 3,
      name: 'KHAI THUẾ TNCN TỪ LƯƠNG',
      price: '1.500.000đ - 2.500.000đ',
      description: 'Dịch vụ khai thuế thu nhập cá nhân từ tiền lương',
      features: [
        'Kê khai thuế TNCN từ tiền lương',
        'Tư vấn chính sách thuế',
        'Hỗ trợ hoàn thuế nếu có',
        'Lưu trữ hồ sơ 3 năm'
      ],
      suitableFor: 'Cá nhân có thu nhập từ tiền lương',
      timeToComplete: 'Theo năm',
      popular: false
    },
    {
      id: 4,
      name: 'HOÀN THUẾ TNCN TỪ LƯƠNG',
      price: '1.500.000đ - 2.500.000đ',
      description: 'Dịch vụ hoàn thuế thu nhập cá nhân từ tiền lương',
      features: [
        'Tư vấn hoàn thuế TNCN',
        'Làm thủ tục hoàn thuế',
        'Theo dõi tiến độ hoàn thuế',
        'Hỗ trợ giải trình với cơ quan thuế'
      ],
      suitableFor: 'Cá nhân cần hoàn thuế TNCN từ tiền lương',
      timeToComplete: 'Tùy hồ sơ',
      popular: false
    },
    {
      id: 5,
      name: 'THUẾ TNCN TỪ CHUYỂN NHƯỢNG VỐN',
      price: '700.000đ - 750.000đ',
      description: 'Dịch vụ khai thuế thu nhập cá nhân từ chuyển nhượng vốn',
      features: [
        'Tư vấn thuế TNCN từ chuyển nhượng vốn',
        'Làm thủ tục khai thuế',
        'Hỗ trợ hoàn tất nghĩa vụ thuế',
        'Giải thích quy trình cho khách hàng'
      ],
      suitableFor: 'Cá nhân có thu nhập từ chuyển nhượng vốn',
      timeToComplete: 'Theo kỳ',
      popular: false
    },
    {
      id: 6,
      name: 'XỬ LÝ SỰ CỐ - KHÔI PHỤC MST BỊ KHÓA',
      price: 'Liên hệ tư vấn',
      description: 'Dịch vụ xử lý sự cố và khôi phục mã số thuế bị khóa',
      features: [
        'Tư vấn nguyên nhân khóa MST',
        'Hướng dẫn xử lý sự cố',
        'Hỗ trợ khôi phục MST',
        'Tư vấn tránh khóa MST trong tương lai'
      ],
      suitableFor: 'Doanh nghiệp/mã số thuế bị khóa',
      timeToComplete: 'Tùy mức độ sự cố',
      popular: false
    }
  ];

  // Cập nhật dữ liệu vào localStorage
  localStorage.setItem('dangKyKinhDoanhServices', JSON.stringify(newBusinessRegistrationServices));
  localStorage.setItem('keToanDoanhNghiepServices', JSON.stringify(newAccountingServices));
  localStorage.setItem('thueHoKinhDoanhServices', JSON.stringify(newTaxServices));

  console.log('Dữ liệu dịch vụ đã được cập nhật vào localStorage!');
  
  // Cập nhật featuredServices với các dịch vụ phổ biến
  const featuredServices = [
    ...newBusinessRegistrationServices.filter(service => service.popular),
    ...newAccountingServices.filter(service => service.isPopular),
    ...newTaxServices.filter(service => service.popular)
  ];
  localStorage.setItem('featuredServices', JSON.stringify(featuredServices));
  
  console.log('Dữ liệu dịch vụ nổi bật đã được cập nhật!');
};

// Gọi hàm cập nhật dữ liệu
updateServicesData();

export default updateServicesData;