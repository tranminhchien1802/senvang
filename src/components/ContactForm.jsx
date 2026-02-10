// File: src/components/ContactForm.jsx
// Form liên hệ truyền thống cho website Kế Toán Sen Vàng
// Chỉ gồm các trường: tên, số điện thoại, email và nội dung tin nhắn

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import FaqAccordion from './FaqAccordion'; // Import the FAQ component
import { knowledgePageFAQs } from '../data/faqData'; // Import the FAQ data

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState(null); // Thêm state để theo dõi lỗi

  // Kiểm tra xem các thư viện cần thiết có tồn tại không
  React.useEffect(() => {
    if (typeof emailjs === 'undefined') {
      setError('EmailJS library is not loaded properly');
      console.error('EmailJS library is not loaded properly');
      return;
    }
  }, []);

  // Hàm validate số điện thoại Việt Nam
  const validateVietnamPhone = (phone) => {
    const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[0|6-9]|8[1-9]|9[0-4|6-9])[0-9]{7}$/;
    return phoneRegex.test(phone) || 'Số điện thoại không hợp lệ';
  };

  // Hàm kiểm tra email trùng lặp
  const checkDuplicateEmail = (email) => {
    const submittedEmails = JSON.parse(localStorage.getItem('contactFormSubmissions')) || [];
    return submittedEmails.some(submission =>
      submission.email.toLowerCase() === email.toLowerCase()
    );
  };

  // Hàm lưu thông tin đăng ký vào localStorage
  const saveSubmission = (data) => {
    const submittedEmails = JSON.parse(localStorage.getItem('contactFormSubmissions')) || [];
    const newSubmission = {
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    submittedEmails.push(newSubmission);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(submittedEmails));
  };

  const onSubmit = async (data) => {
    try {
      // Kiểm tra email đã tồn tại chưa
      if (checkDuplicateEmail(data.email)) {
        setSubmitStatus('duplicate');
        return;
      }

      setSubmitStatus('sending');

      // Cấu hình thông tin gửi mail
      const templateParams = {
        from_name: data.fullName,
        from_email: data.email,
        phone: data.phone,
        to_email: 'chien180203@gmail.com', // Bạn có thể thay bằng email nhận
        reply_to: data.email,
        // Nội dung email chi tiết
        message: `Có yêu cầu tư vấn mới từ Website!\n\nThông tin khách hàng:\n- Họ và tên: ${data.fullName}\n- Email: ${data.email}\n- Số điện thoại: ${data.phone}\n- Nội dung yêu cầu: ${data.message || 'Khách hàng chưa để lại ghi chú.'}\n\nVui lòng phản hồi sớm cho khách hàng.`,
        subject: 'Yêu cầu dịch vụ mới - Kế Toán Sen Vàng'
      };

      // Import email utility function
      const { createEmailTemplate, sendEmailNotification } = await import('../utils/emailUtils');

      // Create customer info object
      const customerInfo = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        serviceName: 'Liên hệ tư vấn',
        servicePrice: 'Liên hệ để biết giá',
        note: data.message || 'Khách hàng chưa để lại ghi chú.'
      };

      // Create email template
      const emailMessage = createEmailTemplate(customerInfo);

      // Update templateParams with the message from createEmailTemplate
      templateParams.message = emailMessage;

      // Send email using utility function
      const response = await sendEmailNotification(templateParams);

      console.log('SUCCESS!', response.status, response.text);

      // Lưu thông tin đăng ký vào localStorage nếu gửi email thành công
      saveSubmission(data);

      // Gửi custom event để cập nhật admin dashboard
      window.dispatchEvent(new Event('contactFormSubmitted'));

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('FAILED...', error);
      setSubmitStatus('error');
    }
  };

  // Nếu có lỗi xảy ra, chỉ hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong>Lỗi: </strong> {error}
        <p>Vui lòng kiểm tra lại cấu hình hoặc liên hệ với quản trị viên.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">Liên Hệ Với Chúng Tôi</h2>
      <p className="text-gray-600 mb-6 text-center">Để lại thông tin, chúng tôi sẽ gọi lại ngay!</p>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#333] rounded-lg">
          Gửi thành công! Chúng tôi đã nhận được thông tin đăng ký của bạn và sẽ liên hệ sớm nhất.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          Có lỗi xảy ra, vui lòng thử lại sau.
        </div>
      )}

      {submitStatus === 'duplicate' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          Email này đã được đăng ký trước đó. Mỗi email chỉ được đăng ký một lần.
        </div>
      )}

      {/* Thông báo hotline */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <p className="text-blue-700 font-medium">
            Gọi ngay: <a href="tel:0932097986" className="text-blue-900 hover:underline">093 209 7986</a> để được hỗ trợ nhanh chóng
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-[#D4AF37]'
            } bg-white text-gray-900`}
            placeholder="Nhập họ và tên của bạn"
            {...register('fullName', {
              required: 'Vui lòng nhập họ và tên',
              minLength: {
                value: 2,
                message: 'Họ và tên phải có ít nhất 2 ký tự'
              },
              maxLength: {
                value: 50,
                message: 'Họ và tên không được vượt quá 50 ký tự'
              }
            })}
          />
          {errors.fullName && (
            <p className="mt-1 text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.phone
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-[#D4AF37]'
            } bg-white text-gray-900`}
            placeholder="Nhập số điện thoại"
            {...register('phone', {
              required: 'Vui lòng nhập số điện thoại',
              validate: validateVietnamPhone
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.email
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-[#D4AF37]'
            } bg-white text-gray-900`}
            placeholder="Nhập địa chỉ email"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Nội dung
          </label>
          <textarea
            id="message"
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.message
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-[#D4AF37]'
            } bg-white text-gray-900`}
            placeholder="Nhập nội dung tin nhắn hoặc yêu cầu cụ thể của bạn..."
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-bold text-white transition duration-300 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#D4AF37] hover:bg-[#b8942f] text-white'
          }`}
        >
          {isSubmitting ? 'Gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>

      {/* FAQ Section */}
      <div className="mt-12">
        <FaqAccordion 
          faqs={knowledgePageFAQs} 
          title="Câu Hỏi Thường Gặp Về Pháp Lý Doanh Nghiệp" 
        />
      </div>
    </div>
  );
};

export default ContactForm;