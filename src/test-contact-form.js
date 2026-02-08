/**
 * Test script for Contact Form functionality
 * This is a simple test to verify that the contact form works as expected
 * 
 * To run this test:
 * 1. Make sure your development server is running (npm run dev)
 * 2. Open browser to your app
 * 3. Navigate to where the contact form is used
 * 4. Use this as reference for manual testing
 */

// Sample test data
const testData = {
  fullName: "Nguyễn Văn Test",
  phone: "0987654321",
  email: "test@example.com",
  servicePackage: "premium", // premium package
  message: "Test message for contact form functionality"
};

// Test instructions
console.log("Contact Form Test Instructions:");
console.log("1. Fill the contact form with the following data:");
console.log("   - Full Name:", testData.fullName);
console.log("   - Phone:", testData.phone);
console.log("   - Email:", testData.email);
console.log("   - Service Package: Premium");
console.log("   - Message:", testData.message);
console.log("\n2. Submit the form");
console.log("3. Verify that the form shows success message");
console.log("4. Check your email for the notification");
console.log("\nNote: Make sure EmailJS is properly configured with valid credentials");

// Validation test data
const testValidation = {
  invalidPhone: "12345", // Should fail phone validation
  invalidEmail: "invalid-email", // Should fail email validation
  emptyName: "", // Should fail required validation
};

console.log("\nValidation Tests:");
console.log("1. Test invalid phone:", testValidation.invalidPhone);
console.log("2. Test invalid email:", testValidation.invalidEmail);
console.log("3. Test empty name field:", testValidation.emptyName);

// Expected behavior
console.log("\nExpected Results:");
console.log("1. After successful submission, form should reset and show success message");
console.log("2. The configured email should receive notification");
console.log("3. Email should contain the submitted information and package details");
console.log("4. Error messages should appear for invalid inputs");