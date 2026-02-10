/**
 * Utility functions for email handling
 */

// Common email template function
export const createEmailTemplate = (customerInfo, serviceInfo = {}) => {
  const {
    fullName,
    email,
    phone,
    serviceName = '',
    servicePrice = '',
    note = 'Khách hàng chưa để lại ghi chú.',
    // Also accept standard field names
    from_name,
    from_email,
    to_email,
    service_name,
    service_price,
    order_note,
    package_name,
    package_price,
    transaction_id
  } = customerInfo;

  // Use the provided field names if available, otherwise use the destructured ones
  const name = from_name || fullName || '';
  const customerEmail = from_email || email || '';
  const customerPhone = phone || '';
  const service = service_name || serviceName || package_name || '';
  const price = service_price || servicePrice || package_price || '';
  const customerNote = order_note || note || 'Khách hàng chưa để lại ghi chú.';
  const transId = transaction_id || '';

  return `Có yêu cầu tư vấn mới từ Website Sen Vàng\n\nThông tin khách hàng:\n- Họ và tên: ${name}\n- Email: ${customerEmail}\n- Số điện thoại: ${customerPhone}\n- Gói dịch vụ: ${service}\n- Giá dịch vụ: ${price}\n- Mã giao dịch: ${transId}\n- Ngày đặt: ${new Date().toLocaleString('vi-VN')}\n- Nội dung yêu cầu: ${customerNote}\n\nVui lòng phản hồi sớm cho khách hàng.`;
};

// Function to clean up email content by removing empty sections
export const cleanEmailContent = (content) => {
  // Remove the problematic template sections that cause empty fields
  let cleanedContent = content;
  
  // Remove the section with empty fields (most specific pattern)
  cleanedContent = cleanedContent.replace(/Xin chào,\s*\n+Có một yêu cầu mới được gửi từ form liên hệ trên website của bạn:\s*\n+─+\s*\n+📌 \*\*Thông tin khách hàng:\*\*\s*\n+- Họ và tên:\s*\n+- Email:\s*\n+- Số điện thoại:\s*\n+- Gói dịch vụ quan tâm:\s+\n+- Nội dung yêu cầu:\s*\n+/g, '');
  
  // Alternative pattern for the empty section
  cleanedContent = cleanedContent.replace(/Xin chào,[\s\S]*?─+\s*\n+📌 \*\*Thông tin khách hàng:\*\*[\s\S]*?- Họ và tên:\s*\n*- Email:\s*\n*- Số điện thoại:\s*\n*- Gói dịch vụ quan tâm:\s*\n*- Nội dung yêu cầu:[\s\S]*?\n+(?=Có yêu cầu tư vấn mới từ Website!)/g, '');
  
  // Clean up any double occurrences of the message
  cleanedContent = cleanedContent.replace(/(Có yêu cầu tư vấn mới từ Website!\s*\n*){2,}/g, 'Có yêu cầu tư vấn mới từ Website!\n\n');
  
  // Remove trailing separators that appear after the actual content
  cleanedContent = cleanedContent.replace(/\s*─+\s*\n*Vui lòng kiểm tra và phản hồi sớm nhất để không bỏ lỡ cơ hội hợp tác!/g, '');
  
  // Additional cleanup: remove any remaining separators that might be left
  cleanedContent = cleanedContent.replace(/\s*─+\s*\n*(?=\s*$)/g, '');
  
  return cleanedContent.trim();
};

// Function to normalize email parameters to ensure consistent field names
export const normalizeEmailParams = (params) => {
  // Map common variations to standard field names that match EmailJS template
  return {
    from_name: params.from_name || params.customer_name || params.fullName || params.name || '',
    from_email: params.from_email || params.email || params.customer_email || params.to_email || '',
    phone: params.phone || params.customer_phone || '',
    package_name: params.package_name || params.service_name || params.serviceName || params.title || '',
    package_price: params.package_price || params.service_price || params.price || params.servicePrice || '',
    transaction_id: params.transaction_id || params.txn_id || params.order_id || '',
    order_date: params.order_date || params.date || new Date().toLocaleString('vi-VN'),
    note: params.note || params.order_note || params.message || params.description || 'Không có ghi chú',
    message: params.message || params.content || params.body || '',
    subject: params.subject || params.title || 'Thông báo từ Kế Toán Sen Vàng',
    to_name: params.to_name || params.recipient_name || 'Quản trị viên',
    to_email: params.to_email || params.recipient_email || params.email || ''
  };
};

// Function to send email via EmailJS with consistent format
export const sendEmailNotification = async (templateParams, templateId = null) => {
  try {
    // Check if EmailJS is configured
    const emailJSConfigured = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY &&
                              import.meta.env.VITE_REACT_APP_SERVICE_ID &&
                              (templateId || import.meta.env.VITE_REACT_APP_TEMPLATE_ID);

    if (emailJSConfigured) {
      // Use provided templateId or fall back to default
      const actualTemplateId = templateId || import.meta.env.VITE_REACT_APP_TEMPLATE_ID;

      // Dynamically import emailjs to avoid bundling when not needed
      const emailjs = await import('@emailjs/browser');

      // Log the incoming parameters to debug
      console.log('Parameters received for email:', templateParams);

      // Prepare parameters with actual values from templateParams, keeping empty strings if not provided
      const preparedParams = {
        from_name: templateParams.from_name || templateParams.fullName || '',
        from_email: templateParams.from_email || templateParams.email || '',
        phone: templateParams.phone || templateParams.customer_phone || '',
        package_name: templateParams.package_name || templateParams.service_name || templateParams.serviceName || '',
        package_price: templateParams.package_price || templateParams.service_price || templateParams.servicePrice || '',
        transaction_id: templateParams.transaction_id || '',
        order_date: templateParams.order_date || new Date().toLocaleString('vi-VN'),
        note: templateParams.note || templateParams.message || 'Đặt mua gói dịch vụ',
        message: templateParams.message || `Có yêu cầu tư vấn mới từ Website Sen Vàng\n\nThông tin khách hàng:\n- Họ và tên: ${templateParams.from_name || templateParams.fullName || 'N/A'}\n- Email: ${templateParams.from_email || templateParams.email || 'N/A'}\n- Số điện thoại: ${templateParams.phone || templateParams.customer_phone || 'N/A'}\n- Gói dịch vụ: ${templateParams.package_name || templateParams.service_name || templateParams.serviceName || 'N/A'}\n- Giá dịch vụ: ${templateParams.package_price || templateParams.service_price || templateParams.servicePrice || 'N/A'}\n- Mã giao dịch: ${templateParams.transaction_id || 'N/A'}\n- Ngày đặt: ${templateParams.order_date || new Date().toLocaleString('vi-VN')}\n- Nội dung yêu cầu: ${templateParams.note || templateParams.message || 'Đặt mua gói dịch vụ'}\n\nVui lòng phản hồi sớm cho khách hàng.`,
        subject: templateParams.subject || 'Yêu cầu dịch vụ mới - Kế Toán Sen Vàng',
        to_name: templateParams.to_name || 'Quản trị viên',
        to_email: templateParams.to_email || 'admin@ketoansenvang.com'
      };

      // Log the prepared parameters to see what will be sent
      console.log('Parameters prepared for email:', preparedParams);

      const result = await emailjs.send(
        import.meta.env.VITE_REACT_APP_SERVICE_ID,
        actualTemplateId,
        preparedParams,
        import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', result);
      return { success: true, result };
    } else {
      console.warn('EmailJS is not configured properly');
      return { success: false, error: 'EmailJS not configured' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};