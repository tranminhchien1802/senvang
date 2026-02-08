// Script để thêm các gói dịch vụ vào localStorage
// File này có thể được chạy trong môi trường trình duyệt sau khi trang đã tải

// Gói dịch vụ thành lập công ty (dichVuPackages)
const dichVuPackages = [
  {
    name: 'GÓI STARTED',
    title: 'GÓI STARTED',
    price: '1.570.000đ',
    numericPrice: 1570000,
    description: 'Dịch vụ thành lập công ty trọn gói dành cho doanh nghiệp mới bắt đầu',
    features: [
      'Uỷ quyền thực hiện thành lập',
      'Soạn và nộp hồ sơ đăng ký',
      'Đăng bố cáo điện tử thành lập',
      'Cấp chứng nhận ĐKKD & MST',
      'Dấu tròn pháp lý doanh nghiệp'
    ],
    suitableFor: 'Xây dựng thương hiệu, Giới thiệu hoạt động công ty, Tìm hiểu vận hành doanh nghiệp',
    timeComplete: '3 - 5 ngày',
    isPopular: false,
    _id: 'package-started',
    type: 'dich-vu'
  },
  {
    name: 'GÓI STANDARD',
    title: 'GÓI STANDARD',
    price: '3.239.000đ',
    numericPrice: 3239000,
    description: 'Dịch vụ thành lập công ty với các tiện ích bổ sung',
    features: [
      'GÓI STARTED',
      'Khai thuế ban đầu tại thuế cơ sở',
      'Token khai thuế gói 12 tháng',
      'Bảng công ty mica 20cm x 30cm',
      'Dấu giám đốc họ và tên'
    ],
    suitableFor: 'Giới thiệu quảng bá thương hiệu, Vận hành doanh nghiệp cơ bản, Nắm bắt các quy định thuế & KT',
    timeComplete: '3 - 5 ngày',
    isPopular: true,
    _id: 'package-standard',
    type: 'dich-vu'
  },
  {
    name: 'GÓI BUSINESS',
    title: 'GÓI BUSINESS',
    price: '4.699.000đ',
    numericPrice: 4699000,
    description: 'Dịch vụ thành lập công ty đầy đủ cho doanh nghiệp vận hành chuyên nghiệp',
    features: [
      'GÓI STARTED',
      'Khai thuế ban đầu tại thuế cơ sở',
      'Mở tài khoản ngân hàng giao dịch',
      'Token khai thuế gói 12 tháng',
      'Đăng ký hoá đơn gói 300 số',
      'Bảng công ty mica 20cm x 30cm',
      'Dấu giám đốc họ và tên'
    ],
    suitableFor: 'Vận hành kinh doanh, Tài chính, Phát triển thị trường, hệ thống',
    timeComplete: '7 - 10 ngày',
    isPopular: true,
    _id: 'package-business',
    type: 'dich-vu'
  },
  {
    name: 'LẬP CHI NHÁNH 01',
    title: 'LẬP CHI NHÁNH 01',
    price: '1.150.000đ',
    numericPrice: 1150000,
    description: 'Dịch vụ thành lập chi nhánh cho doanh nghiệp',
    features: [],
    suitableFor: 'Doanh nghiệp muốn mở rộng hoạt động kinh doanh',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-chi-nhanh-01',
    type: 'dich-vu'
  },
  {
    name: 'LẬP CHI NHÁNH 02',
    title: 'LẬP CHI NHÁNH 02',
    price: '1.570.000đ',
    numericPrice: 1570000,
    description: 'Dịch vụ thành lập chi nhánh cấp 2 cho doanh nghiệp',
    features: [],
    suitableFor: 'Doanh nghiệp muốn mở rộng hoạt động kinh doanh',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-chi-nhanh-02',
    type: 'dich-vu'
  },
  {
    name: 'LẬP DỰ ÁN ĐẦU TƯ FDI',
    title: 'LẬP DỰ ÁN ĐẦU TƯ FDI',
    price: 'Liên hệ',
    numericPrice: 0,
    description: 'Dịch vụ thành lập dự án đầu tư nước ngoài',
    features: [
      'Tư vấn pháp lý đầu tư FDI',
      'Thành lập dự án đầu tư nước ngoài',
      'Hỗ trợ thủ tục pháp lý',
      'Đăng ký kinh doanh FDI'
    ],
    suitableFor: 'Nhà đầu tư nước ngoài muốn đầu tư tại Việt Nam',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-fdi',
    type: 'dich-vu'
  }
];

// Gói dịch vụ thay đổi đăng ký kinh doanh (dichVuPackages)
const thayDoiDkkdPackages = [
  {
    name: 'Thay đổi 1 nội dung DKKD',
    title: 'Thay đổi 1 nội dung DKKD',
    price: '1.570.000đ',
    numericPrice: 1570000,
    description: 'Dịch vụ thay đổi 1 nội dung trong đăng ký kinh doanh',
    features: [
      'Soạn thảo hồ sơ thay đổi',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi và cập nhật tiến độ',
      'Hoàn tất thủ tục thay đổi'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi 1 thông tin đăng ký kinh doanh',
    timeComplete: 'Theo quy định pháp luật',
    isPopular: false,
    _id: 'package-thay-doi-1',
    type: 'dich-vu'
  },
  {
    name: 'Thay đổi 2 nội dung DKKD',
    title: 'Thay đổi 2 nội dung DKKD',
    price: '1.770.000đ',
    numericPrice: 1770000,
    description: 'Dịch vụ thay đổi 2 nội dung trong đăng ký kinh doanh',
    features: [
      'Soạn thảo hồ sơ thay đổi',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi và cập nhật tiến độ',
      'Hoàn tất thủ tục thay đổi'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi 2 thông tin đăng ký kinh doanh',
    timeComplete: 'Theo quy định pháp luật',
    isPopular: false,
    _id: 'package-thay-doi-2',
    type: 'dich-vu'
  },
  {
    name: 'Thay đổi 3 nội dung DKKD',
    title: 'Thay đổi 3 nội dung DKKD',
    price: '1.970.000đ',
    numericPrice: 1970000,
    description: 'Dịch vụ thay đổi 3 nội dung trong đăng ký kinh doanh',
    features: [
      'Soạn thảo hồ sơ thay đổi',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi và cập nhật tiến độ',
      'Hoàn tất thủ tục thay đổi'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi 3 thông tin đăng ký kinh doanh',
    timeComplete: 'Theo quy định pháp luật',
    isPopular: false,
    _id: 'package-thay-doi-3',
    type: 'dich-vu'
  },
  {
    name: 'Thay đổi 4 nội dung DKKD',
    title: 'Thay đổi 4 nội dung DKKD',
    price: '2.150.000đ',
    numericPrice: 2150000,
    description: 'Dịch vụ thay đổi 4 nội dung trong đăng ký kinh doanh',
    features: [
      'Soạn thảo hồ sơ thay đổi',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi và cập nhật tiến độ',
      'Hoàn tất thủ tục thay đổi'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi 4 thông tin đăng ký kinh doanh',
    timeComplete: 'Theo quy định pháp luật',
    isPopular: false,
    _id: 'package-thay-doi-4',
    type: 'dich-vu'
  },
  {
    name: 'Thay đổi 5 nội dung DKKD',
    title: 'Thay đổi 5 nội dung DKKD',
    price: '2.050.000đ',
    numericPrice: 2050000,
    description: 'Dịch vụ thay đổi 5 nội dung trong đăng ký kinh doanh',
    features: [
      'Soạn thảo hồ sơ thay đổi',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi và cập nhật tiến độ',
      'Hoàn tất thủ tục thay đổi'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi 5 thông tin đăng ký kinh doanh',
    timeComplete: 'Theo quy định pháp luật',
    isPopular: false,
    _id: 'package-thay-doi-5',
    type: 'dich-vu'
  },
  {
    name: 'Thuế TNCN chuyển nhượng vốn',
    title: 'Thuế TNCN chuyển nhượng vốn',
    price: '550.000đ',
    numericPrice: 550000,
    description: 'Dịch vụ xử lý thuế TNCN từ chuyển nhượng vốn',
    features: [
      'Tính toán thuế TNCN',
      'Hoàn thiện hồ sơ thuế',
      'Kê khai thuế TNCN',
      'Hỗ trợ giải trình với cơ quan thuế'
    ],
    suitableFor: 'Cá nhân chuyển nhượng vốn góp tại doanh nghiệp',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-thue-tncn',
    type: 'dich-vu'
  },
  {
    name: 'Thay đổi dấu tròn doanh nghiệp',
    title: 'Thay đổi dấu tròn doanh nghiệp',
    price: '750.000đ',
    numericPrice: 750000,
    description: 'Dịch vụ thay đổi dấu tròn pháp lý cho doanh nghiệp',
    features: [
      'Tư vấn hình thức con dấu',
      'Thực hiện thủ tục thay đổi',
      'Công bố mẫu dấu mới',
      'Bảo mật thông tin con dấu'
    ],
    suitableFor: 'Doanh nghiệp cần thay đổi mẫu dấu',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-thay-doi-dau',
    type: 'dich-vu'
  }
];

// Gói dịch vụ kế toán (dichVuPackages)
const keToanPackages = [
  {
    name: 'KẾ TOÁN THƯƠNG MẠI DỊCH VỤ',
    title: 'KẾ TOÁN THƯƠNG MẠI DỊCH VỤ',
    price: '1.500.000đ',
    numericPrice: 1500000,
    description: 'Dịch vụ kế toán chuyên cho doanh nghiệp thương mại dịch vụ',
    features: [
      'Hoàn thiện sổ sách kế toán',
      'Khai báo thuế hàng tháng/quý',
      'Lập báo cáo tài chính',
      'Hỗ trợ quyết toán thuế'
    ],
    suitableFor: 'Doanh nghiệp hoạt động trong lĩnh vực thương mại dịch vụ',
    timeComplete: 'Theo chu kỳ kế toán',
    isPopular: true,
    _id: 'package-ke-toan-thuong-mai',
    type: 'dich-vu'
  },
  {
    name: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
    title: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
    price: '2.500.000đ',
    numericPrice: 2500000,
    description: 'Dịch vụ kế toán chuyên cho doanh nghiệp xây dựng',
    features: [
      'Hoàn thiện sổ sách kế toán',
      'Khai báo thuế hàng tháng/quý',
      'Lập báo cáo tài chính',
      'Hỗ trợ quyết toán thuế',
      'Theo dõi dự án xây dựng'
    ],
    suitableFor: 'Doanh nghiệp hoạt động trong lĩnh vực xây dựng',
    timeComplete: 'Theo chu kỳ kế toán',
    isPopular: true,
    _id: 'package-ke-toan-xay-dung',
    type: 'dich-vu'
  },
  {
    name: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
    title: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
    price: '3.000.000đ',
    numericPrice: 3000000,
    description: 'Dịch vụ kế toán chuyên cho doanh nghiệp gia công sản xuất',
    features: [
      'Hoàn thiện sổ sách kế toán',
      'Khai báo thuế hàng tháng/quý',
      'Lập báo cáo tài chính',
      'Hỗ trợ quyết toán thuế',
      'Quản lý chi phí sản xuất'
    ],
    suitableFor: 'Doanh nghiệp hoạt động trong lĩnh vực sản xuất, gia công',
    timeComplete: 'Theo chu kỳ kế toán',
    isPopular: true,
    _id: 'package-ke-toan-san-xuat',
    type: 'dich-vu'
  },
  {
    name: 'Khai thuế trắng',
    title: 'Khai thuế trắng',
    price: '800.000đ',
    numericPrice: 800000,
    description: 'Dịch vụ khai thuế cho doanh nghiệp không phát sinh giao dịch',
    features: [
      'Khai thuế giá trị gia tăng',
      'Khai thuế thu nhập doanh nghiệp',
      'Khai thuế môn bài',
      'Hỗ trợ hoàn thuế'
    ],
    suitableFor: 'Doanh nghiệp không phát sinh hoạt động kinh doanh',
    timeComplete: 'Theo kỳ khai thuế',
    isPopular: false,
    _id: 'package-khai-thue-trang',
    type: 'dich-vu'
  },
  {
    name: 'Khai thuế có phát sinh hóa đơn',
    title: 'Khai thuế có phát sinh hóa đơn',
    price: '1.500.000đ',
    numericPrice: 1500000,
    description: 'Dịch vụ khai thuế cho doanh nghiệp có phát sinh hóa đơn',
    features: [
      'Khai thuế giá trị gia tăng',
      'Khai thuế thu nhập doanh nghiệp',
      'Khai thuế môn bài',
      'Hỗ trợ hoàn thuế',
      'Tư vấn hóa đơn'
    ],
    suitableFor: 'Doanh nghiệp có phát sinh hóa đơn mua bán',
    timeComplete: 'Theo kỳ khai thuế',
    isPopular: false,
    _id: 'package-khai-thue-phat-sinh',
    type: 'dich-vu'
  },
  {
    name: 'Báo cáo tài chính năm',
    title: 'Báo cáo tài chính năm',
    price: '3.500.000đ',
    numericPrice: 3500000,
    description: 'Dịch vụ lập báo cáo tài chính hàng năm',
    features: [
      'Lập báo cáo tài chính',
      'Kiểm toán báo cáo tài chính',
      'Tư vấn các chỉ tiêu tài chính',
      'Hỗ trợ lưu trữ hồ sơ'
    ],
    suitableFor: 'Doanh nghiệp cần lập báo cáo tài chính năm',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-bao-cao-tai-chinh',
    type: 'dich-vu'
  },
  {
    name: 'Làm lại sổ sách kế toán',
    title: 'Làm lại sổ sách kế toán',
    price: '1.200.000đ',
    numericPrice: 1200000,
    description: 'Dịch vụ lập lại sổ sách kế toán cho doanh nghiệp',
    features: [
      'Hoàn thiện lại sổ sách',
      'Điều chỉnh số liệu sai lệch',
      'Kết chuyển số liệu đúng quy định',
      'Tư vấn quy định hiện hành'
    ],
    suitableFor: 'Doanh nghiệp chưa có hoặc có sổ sách kế toán sai lệch',
    timeComplete: 'Theo thỏa thuận',
    isPopular: false,
    _id: 'package-lam-lai-so-sach',
    type: 'dich-vu'
  },
  {
    name: 'Bổ nhiệm Kế Toán Trưởng',
    title: 'Bổ nhiệm Kế Toán Trưởng',
    price: '4.000.000đ',
    numericPrice: 4000000,
    description: 'Dịch vụ hỗ trợ bổ nhiệm Kế Toán Trưởng theo quy định',
    features: [
      'Tư vấn điều kiện bổ nhiệm',
      'Soạn thảo hồ sơ bổ nhiệm',
      'Nộp hồ sơ tại cơ quan chức năng',
      'Theo dõi tiến độ bổ nhiệm'
    ],
    suitableFor: 'Doanh nghiệp cần bổ nhiệm Kế Toán Trưởng',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-bo-nhiem-ke-toan',
    type: 'dich-vu'
  },
  {
    name: 'Giải trình Quyết toán thuế',
    title: 'Giải trình Quyết toán thuế',
    price: '6.000.000đ',
    numericPrice: 6000000,
    description: 'Dịch vụ hỗ trợ giải trình quyết toán thuế với cơ quan thuế',
    features: [
      'Soạn thảo hồ sơ giải trình',
      'Hỗ trợ đối thoại với cơ quan thuế',
      'Tư vấn xử lý sai sót',
      'Theo dõi tiến độ giải trình'
    ],
    suitableFor: 'Doanh nghiệp bị cơ quan thuế yêu cầu giải trình',
    timeComplete: 'Theo tiến độ',
    isPopular: false,
    _id: 'package-giai-trinh-quyet-toan',
    type: 'dich-vu'
  },
  {
    name: 'Khai Khuế TNCN Từ lương (VN)',
    title: 'Khai Khuế TNCN Từ lương (VN)',
    price: '1.500.000đ',
    numericPrice: 1500000,
    description: 'Dịch vụ khai thuế TNCN từ tiền lương, tiền công',
    features: [
      'Tính toán thuế TNCN',
      'Kê khai thuế TNCN',
      'Hỗ trợ hoàn thuế',
      'Tư vấn miễn giảm thuế'
    ],
    suitableFor: 'Doanh nghiệp có phát sinh thu nhập chịu thuế TNCN',
    timeComplete: 'Theo năm dương lịch',
    isPopular: false,
    _id: 'package-khai-thue-tncn-luong',
    type: 'dich-vu'
  },
  {
    name: 'Hoàn Khuế TNCN Từ lương (VN)',
    title: 'Hoàn Khuế TNCN Từ lương (VN)',
    price: '1.500.000đ',
    numericPrice: 1500000,
    description: 'Dịch vụ hoàn thuế TNCN từ tiền lương, tiền công',
    features: [
      'Tính toán số thuế được hoàn',
      'Soạn hồ sơ hoàn thuế',
      'Nộp hồ sơ hoàn thuế',
      'Theo dõi tiến độ hoàn thuế'
    ],
    suitableFor: 'Doanh nghiệp có phát sinh hoàn thuế TNCN',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-hoan-thue-tncn-luong',
    type: 'dich-vu'
  },
  {
    name: 'Khai Khuế TNCN Từ lương (VN) 2.5M',
    title: 'Khai Khuế TNCN Từ lương (VN)',
    price: '2.500.000đ',
    numericPrice: 2500000,
    description: 'Dịch vụ khai thuế TNCN từ tiền lương, tiền công cho trường hợp phức tạp',
    features: [
      'Tính toán thuế TNCN',
      'Kê khai thuế TNCN',
      'Hỗ trợ hoàn thuế',
      'Tư vấn miễn giảm thuế',
      'Hỗ trợ giải trình với cơ quan thuế'
    ],
    suitableFor: 'Doanh nghiệp có phát sinh thu nhập chịu thuế TNCN phức tạp',
    timeComplete: 'Theo năm dương lịch',
    isPopular: false,
    _id: 'package-khai-thue-tncn-luong-2-5m',
    type: 'dich-vu'
  },
  {
    name: 'Hoàn Khuế TNCN Từ lương (Vn)',
    title: 'Hoàn Khuế TNCN Từ lương (Vn)',
    price: '2.500.000đ',
    numericPrice: 2500000,
    description: 'Dịch vụ hoàn thuế TNCN từ tiền lương, tiền công cho trường hợp phức tạp',
    features: [
      'Tính toán số thuế được hoàn',
      'Soạn hồ sơ hoàn thuế',
      'Nộp hồ sơ hoàn thuế',
      'Theo dõi tiến độ hoàn thuế',
      'Hỗ trợ giải trình với cơ quan thuế'
    ],
    suitableFor: 'Doanh nghiệp có phát sinh hoàn thuế TNCN phức tạp',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-hoan-thue-tncn-luong-vn',
    type: 'dich-vu'
  },
  {
    name: 'Thuế TNCN Từ chuyển nhượng',
    title: 'Thuế TNCN Từ chuyển nhượng',
    price: '700.000đ',
    numericPrice: 700000,
    description: 'Dịch vụ xử lý thuế TNCN từ chuyển nhượng vốn, tài sản',
    features: [
      'Tính toán thuế TNCN',
      'Kê khai thuế TNCN',
      'Hỗ trợ hoàn thuế',
      'Tư vấn thủ tục chuyển nhượng'
    ],
    suitableFor: 'Cá nhân có phát sinh thu nhập từ chuyển nhượng',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-thue-tncn-chuyen-nhuong',
    type: 'dich-vu'
  },
  {
    name: 'Đăng ký BHXH Từ dưới 5 nhân sự',
    title: 'Đăng ký BHXH Từ dưới 5 nhân sự',
    price: '1.050.000đ',
    numericPrice: 1050000,
    description: 'Dịch vụ đăng ký BHXH cho doanh nghiệp dưới 5 nhân sự',
    features: [
      'Tư vấn quy định BHXH',
      'Soạn hồ sơ đăng ký',
      'Nộp hồ sơ BHXH',
      'Theo dõi tiến độ'
    ],
    suitableFor: 'Doanh nghiệp có từ 1 đến 4 nhân sự',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-bhxh-duoi-5',
    type: 'dich-vu'
  },
  {
    name: 'Đăng ký BHXH Từ trên 5 nhân sự',
    title: 'Đăng ký BHXH Từ trên 5 nhân sự',
    price: '1.550.000đ',
    numericPrice: 1550000,
    description: 'Dịch vụ đăng ký BHXH cho doanh nghiệp trên 5 nhân sự',
    features: [
      'Tư vấn quy định BHXH',
      'Soạn hồ sơ đăng ký',
      'Nộp hồ sơ BHXH',
      'Theo dõi tiến độ',
      'Hướng dẫn quy trình'
    ],
    suitableFor: 'Doanh nghiệp có từ 5 nhân sự trở lên',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-bhxh-tren-5',
    type: 'dich-vu'
  }
];

// Gói dịch vụ khác (dichVuKhacPackages)
const dichVuKhacPackages = [
  {
    name: 'Khôi phục Mã DN bị khoá',
    title: 'Khôi phục Mã DN bị khoá',
    price: 'Liên hệ',
    numericPrice: 0,
    description: 'Dịch vụ hỗ trợ khôi phục mã doanh nghiệp bị khoá',
    features: [
      'Tư vấn nguyên nhân khóa mã DN',
      'Hướng dẫn chuẩn bị hồ sơ',
      'Thực hiện thủ tục khôi phục',
      'Theo dõi tiến độ xử lý'
    ],
    suitableFor: 'Doanh nghiệp bị khóa mã số doanh nghiệp',
    timeComplete: 'Theo quy định',
    isPopular: false,
    _id: 'package-khoi-phuc-ma-dn',
    type: 'dich-vu-khac'
  },
  {
    name: 'Tư vấn báo giá - Phân tích Dữ liệu doanh nghiệp',
    title: 'Phân tích Dữ liệu doanh nghiệp',
    price: 'Liên hệ',
    numericPrice: 0,
    description: 'Dịch vụ tư vấn phân tích dữ liệu doanh nghiệp',
    features: [
      'Phân tích hệ thống dữ liệu',
      'Đánh giá hiệu quả kinh doanh',
      'Tư vấn cải thiện hoạt động',
      'Báo cáo phân tích chi tiết'
    ],
    suitableFor: 'Doanh nghiệp muốn cải thiện dữ liệu vận hành',
    timeComplete: 'Theo thỏa thuận',
    isPopular: false,
    _id: 'package-phan-tich-du-lieu',
    type: 'dich-vu-khac'
  },
  {
    name: 'Tư vấn báo giá - Lập phương án Tài chính vay vốn',
    title: 'Lập phương án Tài chính vay vốn',
    price: 'Liên hệ',
    numericPrice: 0,
    description: 'Dịch vụ tư vấn lập phương án tài chính để vay vốn',
    features: [
      'Tư vấn phương án vay vốn',
      'Soạn thảo phương án tài chính',
      'Định hướng cải thiện năng lực tài chính',
      'Hỗ trợ thủ tục vay vốn'
    ],
    suitableFor: 'Doanh nghiệp cần vốn để phát triển',
    timeComplete: 'Theo thỏa thuận',
    isPopular: false,
    _id: 'package-phuong-an-vay-von',
    type: 'dich-vu-khac'
  },
  {
    name: 'Tư vấn báo giá - Làm website theo yêu cầu',
    title: 'Làm website theo yêu cầu',
    price: 'Liên hệ',
    numericPrice: 0,
    description: 'Dịch vụ thiết kế website chuyên nghiệp theo yêu cầu',
    features: [
      'Thiết kế giao diện chuyên nghiệp',
      'Tối ưu trải nghiệm người dùng',
      'Tích hợp tính năng tùy chỉnh',
      'Hỗ trợ bảo trì sau bàn giao'
    ],
    suitableFor: 'Doanh nghiệp cần website chuyên nghiệp',
    timeComplete: '7-15 ngày',
    isPopular: false,
    _id: 'package-lam-website',
    type: 'dich-vu-khac'
  }
];

// Gộp tất cả các gói dịch vụ thành lập và kinh doanh
const allDichVuPackages = [
  ...dichVuPackages,
  ...thayDoiDkkdPackages,
  ...keToanPackages
];

// Gộp tất cả các gói dịch vụ khác
const allDichVuKhacPackages = [
  ...dichVuKhacPackages
];

// Hàm kiểm tra và thêm gói dịch vụ vào localStorage với kiểm tra lỗi
function addPackagesToStorage() {
  try {
    // Kiểm tra xem localStorage có khả dụng không
    if (typeof(Storage) === "undefined") {
      console.warn("Trình duyệt không hỗ trợ localStorage");
      return;
    }

    // Lấy dữ liệu hiện tại từ localStorage
    const currentDichVuPackages = localStorage.getItem('dichVuPackages');
    const currentDichVuKhacPackages = localStorage.getItem('dichVuKhacPackages');

    // So sánh dữ liệu hiện tại với dữ liệu mới (chỉ so sánh số lượng và ID)
    let shouldUpdate = false;

    if (!currentDichVuPackages || !currentDichVuKhacPackages) {
      // Nếu không có dữ liệu, cập nhật
      shouldUpdate = true;
    } else {
      try {
        const parsedCurrentDichVu = JSON.parse(currentDichVuPackages) || [];
        const parsedCurrentDichVuKhac = JSON.parse(currentDichVuKhacPackages) || [];

        // So sánh số lượng
        if (parsedCurrentDichVu.length !== allDichVuPackages.length ||
            parsedCurrentDichVuKhac.length !== allDichVuKhacPackages.length) {
          shouldUpdate = true;
        } else {
          // So sánh một số ID tiêu biểu
          const newIdsDichVu = new Set(allDichVuPackages.map(pkg => pkg._id));
          const currentIdsDichVu = new Set(parsedCurrentDichVu.map(pkg => pkg._id));

          // Nếu có ID khác nhau thì cập nhật
          const hasDifferentIds = [...newIdsDichVu].some(id => !currentIdsDichVu.has(id)) ||
                                  [...currentIdsDichVu].some(id => !newIdsDichVu.has(id));

          if (hasDifferentIds) {
            shouldUpdate = true;
          }
        }
      } catch (parseError) {
        // Nếu không thể parse JSON hiện tại, cập nhật lại
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      // Thêm các gói dịch vụ vào localStorage
      localStorage.setItem('dichVuPackages', JSON.stringify(allDichVuPackages));
      localStorage.setItem('dichVuKhacPackages', JSON.stringify(allDichVuKhacPackages));

      console.log('Đã thêm ' + allDichVuPackages.length + ' gói dịch vụ vào "dichVuPackages"');
      console.log('Đã thêm ' + allDichVuKhacPackages.length + ' gói dịch vụ vào "dichVuKhacPackages"');
      console.log('Tổng cộng: ' + (allDichVuPackages.length + allDichVuKhacPackages.length) + ' gói dịch vụ đã được cập nhật thành công!');
    } else {
      console.log('Dữ liệu gói dịch vụ đã tồn tại. Bỏ qua cập nhật.');
    }
  } catch (e) {
    console.error('Lỗi khi lưu gói dịch vụ vào localStorage:', e);
  }
}

// Gọi hàm thêm gói
addPackagesToStorage();

// Gửi sự kiện để thông báo cho các thành phần khác biết dữ liệu đã thay đổi
try {
  window.dispatchEvent(new Event('storage'));
} catch (e) {
  console.warn('Không thể gửi sự kiện storage:', e);
}