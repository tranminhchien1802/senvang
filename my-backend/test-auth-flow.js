// Test script to verify admin authentication and email functionality
require('dotenv').config();
const axios = require('axios');

async function testAdminAuthAndEmail() {
  console.log('Testing admin authentication and email functionality...\n');
  
  const baseURL = 'http://localhost:5000';
  
  try {
    // Test 1: Admin login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${baseURL}/api/admin/login`, {
      email: 'chien180203@gmail.com',
      password: '123'
    });
    
    console.log('✅ Admin login successful');
    console.log('Token received:', loginResponse.data.token.substring(0, 30) + '...');
    
    const token = loginResponse.data.token;
    
    // Test 2: Access protected endpoint (get orders)
    console.log('\n2. Testing access to protected endpoint...');
    const ordersResponse = await axios.get(`${baseURL}/api/admin/orders`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('✅ Successfully accessed protected endpoint');
    console.log('Number of orders retrieved:', ordersResponse.data.length);
    
    // Test 3: Test sending order confirmation email (with dummy data since we don't have real orders)
    console.log('\n3. Testing email confirmation endpoint...');
    try {
      const emailResponse = await axios.post(`${baseURL}/api/admin/send-order-confirmation`, {
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        serviceName: 'Test Service',
        servicePrice: '1,000,000 VND',
        transactionId: 'TEST001'
      }, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Email confirmation endpoint called successfully');
      console.log('Response:', emailResponse.data);
    } catch (emailError) {
      if (emailError.response) {
        if (emailError.response.status === 500 && emailError.response.data.msg.includes('Cấu hình email chưa được thiết lập')) {
          console.log('⚠️  Email configuration issue (expected if EMAIL_PASS not set properly):', emailError.response.data.msg);
        } else {
          console.log('❌ Email confirmation endpoint error:', emailError.response.data.msg);
        }
      } else {
        console.log('❌ Network error calling email endpoint:', emailError.message);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.data.msg || error.response.statusText);
    } else if (error.request) {
      console.log('❌ Network Error: Could not connect to server. Make sure your backend is running on http://localhost:5000');
    } else {
      console.log('❌ Unexpected Error:', error.message);
    }
  }
}

testAdminAuthAndEmail();