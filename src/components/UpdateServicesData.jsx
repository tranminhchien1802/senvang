import { useEffect } from 'react';

const UpdateServicesData = () => {
  useEffect(() => {
    // Chỉ cập nhật dữ liệu nếu chưa có trong localStorage
    if (!localStorage.getItem('businessRegistrationServices')) {
      const businessRegistrationServices = [
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
      localStorage.setItem('businessRegistrationServices', JSON.stringify(businessRegistrationServices));
    }

    if (!localStorage.getItem('accountingServices')) {
      const accountingServices = [
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
      localStorage.setItem('accountingServices', JSON.stringify(accountingServices));
    }

    if (!localStorage.getItem('taxServices')) {
      const taxServices = [
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
          timeComplete: 'Theo năm',
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
          timeComplete: 'Tùy hồ sơ',
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
          timeComplete: 'Theo kỳ',
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
          timeComplete: 'Tùy mức độ sự cố',
          popular: false
        }
      ];
      localStorage.setItem('taxServices', JSON.stringify(taxServices));
    }

    if (!localStorage.getItem('webDesignServices')) {
      const webDesignServices = [
        {
          id: 'web1',
          title: 'GÓI 1: WEB GIỚI THIỆU',
          price: '3.000.000đ',
          description: 'Gói website giới thiệu cơ bản cho doanh nghiệp',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Responsive - tương thích di động',
            'Tối ưu SEO cơ bản',
            'Tích hợp form liên hệ',
            'Hỗ trợ kỹ thuật 3 tháng'
          ],
          suitableFor: 'Doanh nghiệp mới, cá nhân kinh doanh',
          timeComplete: '7-15 ngày',
          isPopular: true
        },
        {
          id: 'web2',
          title: 'GÓI 2: WEB GIỚI THIỆU + QUẢN TRỊ',
          price: '4.000.000đ',
          description: 'Gói website giới thiệu có trang quản trị',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Trang quản trị nội dung',
            'Tự cập nhật nội dung dễ dàng',
            'Tối ưu SEO nâng cao',
            'Hỗ trợ kỹ thuật 6 tháng'
          ],
          suitableFor: 'Doanh nghiệp vừa và nhỏ',
          timeComplete: '7-15 ngày',
          isPopular: false
        },
        {
          id: 'web3',
          title: 'GÓI 3: WEB GIỚI THIỆU + RESPONSIVE',
          price: '6.000.000đ',
          description: 'Gói website giới thiệu tương thích responsive',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Responsive - tương thích mọi thiết bị',
            'Tối ưu trải nghiệm người dùng',
            'Tích hợp mạng xã hội',
            'Hỗ trợ kỹ thuật 12 tháng'
          ],
          suitableFor: 'Doanh nghiệp muốn hiện diện chuyên nghiệp',
          timeComplete: '7-15 ngày',
          isPopular: true
        },
        {
          id: 'web4',
          title: 'GÓI 4: WEB GIỚI THIỆU + ADMIN + RESPONSIVE',
          price: '7.000.000đ',
          description: 'Gói website giới thiệu đầy đủ tính năng',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Trang quản trị nội dung',
            'Responsive - tương thích mọi thiết bị',
            'Tích hợp form liên hệ, chat',
            'Tự cập nhật nội dung dễ dàng',
            'Hỗ trợ kỹ thuật trọn đời'
          ],
          suitableFor: 'Doanh nghiệp chuyên nghiệp',
          timeComplete: '7-15 ngày',
          isPopular: false
        },
        {
          id: 'web5',
          title: 'GÓI TƯ VẤN',
          price: 'Liên hệ tư vấn',
          description: 'Gói tư vấn thiết kế web theo yêu cầu đặc biệt',
          features: [
            'Tư vấn lựa chọn gói phù hợp',
            'Phân tích yêu cầu chi tiết',
            'Thiết kế theo yêu cầu đặc biệt',
            'Tích hợp tính năng tùy chỉnh',
            'Hỗ trợ kỹ thuật trọn đời'
          ],
          suitableFor: 'Doanh nghiệp có yêu cầu đặc biệt',
          timeComplete: '7-15 ngày',
          isPopular: false
        }
      ];
      localStorage.setItem('webDesignServices', JSON.stringify(webDesignServices));
    }

    // Cập nhật featuredServices nếu chưa có
    if (!localStorage.getItem('featuredServices')) {
      const businessServices = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
      const accountingServices = JSON.parse(localStorage.getItem('accountingServices')) || [];
      const taxServices = JSON.parse(localStorage.getItem('taxServices')) || [];
      const webDesignServices = JSON.parse(localStorage.getItem('webDesignServices')) || [];

      const featuredServices = [
        ...businessServices.filter(service => service.popular),
        ...accountingServices.filter(service => service.isPopular),
        ...taxServices.filter(service => service.popular),
        ...webDesignServices.filter(service => service.isPopular)
      ];
      localStorage.setItem('featuredServices', JSON.stringify(featuredServices));
    }

    console.log('Dữ liệu dịch vụ đã được kiểm tra và cập nhật nếu cần!');
  }, []);

  return null;
};

export default UpdateServicesData;