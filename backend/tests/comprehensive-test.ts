/**
 * Comprehensive API Test Suite
 * Tests all 22 endpoints with proper dummy data
 */

import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:5000/api';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  errorMessage?: string;
  responseTime?: number;
  phase: string;
}

const testResults: TestResult[] = [];
const testUsers = {
  user1: {
    email: 'sujalsinha2001@gmail.com',
    password: 'TestPassword123!',
    fullName: 'Sujal Sinha 1',
    role: 'USER' as const,
  },
  user2: {
    email: 'sujalmilind300@gmail.com',
    password: 'TestPassword123!',
    fullName: 'Sujal Milind',
    role: 'USER' as const,
  },
  dsa: {
    email: 'krsujalsinha2003@gmail.com',
    password: 'TestPassword123!',
    fullName: 'KR Sujal Sinha',
    role: 'USER' as const,
  },
};

let user1Token = '';
let user2Token = '';
let dsaToken = '';
let employeeToken = '';
let serviceId = '';
let requestId = '';
let paymentOrderId = '';
let dsaId = '';

// Helper function to log test results
function logTest(
  phase: string,
  endpoint: string,
  method: string,
  status: 'PASS' | 'FAIL',
  statusCode?: number,
  errorMessage?: string,
  responseTime?: number
) {
  testResults.push({
    phase,
    endpoint,
    method,
    status,
    statusCode,
    errorMessage,
    responseTime,
  });

  const emoji = status === 'PASS' ? '✅' : '❌';
  //console.log(`${emoji} [${phase}] ${method} ${endpoint} - ${status} (${statusCode || 'N/A'})`);
  if (errorMessage) //console.log(`   Error: ${errorMessage}`);
}

// Test Phase 1: User Registration and Authentication
async function phase1_UserAuth() {
  //console.log('\n=== PHASE 1: USER REGISTRATION & AUTHENTICATION ===\n');

  // Test 1: Register User 1
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/register`, testUsers.user1);
    logTest('PHASE 1', '/auth/register', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    logTest('PHASE 1', '/auth/register', 'POST', 'FAIL', err.response?.status, errorMsg);
  }

  // Test 2: Register User 2
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/register`, testUsers.user2);
    logTest('PHASE 1', '/auth/register', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 1', '/auth/register', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Test 3: Send OTP to User 1
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/otp/send`, {
      email: testUsers.user1.email,
    });
    logTest('PHASE 1', '/otp/send', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 1', '/otp/send', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Test 4: Verify OTP (using 123456 for testing)
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/otp/verify`, {
      email: testUsers.user1.email,
      otp: '123456',
    });
    logTest('PHASE 1', '/otp/verify', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 1', '/otp/verify', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Test 5: Login User 1
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.user1.email,
      password: testUsers.user1.password,
    });
    user1Token = res.headers['set-cookie']?.[0] || '';
    logTest('PHASE 1', '/auth/login', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 1', '/auth/login', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Test 6: Get current user
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Cookie: user1Token },
    });
    logTest('PHASE 1', '/auth/me', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 1', '/auth/me', 'GET', 'FAIL', err.response?.status, err.message);
  }
}

// Test Phase 2: Services and Requests
async function phase2_ServicesAndRequests() {
  //console.log('\n=== PHASE 2: SERVICES & REQUESTS ===\n');

  // Test 7: Get all services
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/services`);
    serviceId = res.data.data.services[0]?.id || '';
    logTest('PHASE 2', '/services', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 2', '/services', 'GET', 'FAIL', err.response?.status, err.message);
  }

  // Test 8: Get service by ID
  if (serviceId) {
    try {
      const start = Date.now();
      const res = await axios.get(`${BASE_URL}/services/${serviceId}`);
      logTest('PHASE 2', `/services/:id`, 'GET', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 2', `/services/:id`, 'GET', 'FAIL', err.response?.status, err.message);
    }
  }

  // Test 9: Get services by category
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/services/category/government`);
    logTest('PHASE 2', '/services/category/:category', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 2', '/services/category/:category', 'GET', 'FAIL', err.response?.status, err.message);
  }

  // Test 10: Create service request
  try {
    const start = Date.now();
    const res = await axios.post(
      `${BASE_URL}/requests`,
      {
        serviceId,
        formData: {
          fullName: testUsers.user1.fullName,
          phone: '9876543210',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
      },
      { headers: { Cookie: user1Token } }
    );
    requestId = res.data.data.request.id;
    logTest('PHASE 2', '/requests', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 2', '/requests', 'POST', 'FAIL', err.response?.status, err.response?.data as string);
  }

  // Test 11: Get my requests
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/requests/my-requests`, {
      headers: { Cookie: user1Token },
    });
    logTest('PHASE 2', '/requests/my-requests', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 2', '/requests/my-requests', 'GET', 'FAIL', err.response?.status, err.message);
  }

  // Test 12: Get request by ID
  if (requestId) {
    try {
      const start = Date.now();
      const res = await axios.get(`${BASE_URL}/requests/${requestId}`, {
        headers: { Cookie: user1Token },
      });
      logTest('PHASE 2', '/requests/:id', 'GET', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 2', '/requests/:id', 'GET', 'FAIL', err.response?.status, err.message);
    }
  }
}

// Test Phase 3: Payment Processing
async function phase3_Payments() {
  //console.log('\n=== PHASE 3: PAYMENT PROCESSING ===\n');

  // Test 13: Create payment order
  if (requestId) {
    try {
      const start = Date.now();
      const res = await axios.post(
        `${BASE_URL}/payments/create-order`,
        { requestId },
        { headers: { Cookie: user1Token } }
      );
      paymentOrderId = res.data.data.orderId;
      logTest('PHASE 3', '/payments/create-order', 'POST', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 3', '/payments/create-order', 'POST', 'FAIL', err.response?.status, err.response?.data as string);
    }
  }

  // Test 14: Verify payment (will fail without real Razorpay, but tests the endpoint)
  if (paymentOrderId) {
    try {
      const start = Date.now();
      const res = await axios.post(
        `${BASE_URL}/payments/verify`,
        {
          razorpay_order_id: paymentOrderId,
          razorpay_payment_id: 'pay_test123',
          razorpay_signature: 'test_signature',
          requestId,
        },
        { headers: { Cookie: user1Token } }
      );
      logTest('PHASE 3', '/payments/verify', 'POST', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 3', '/payments/verify', 'POST', 'FAIL', err.response?.status, err.response?.data as string);
    }
  }
}

// Test Phase 4: DSA Registration and Operations
async function phase4_DSA() {
  //console.log('\n=== PHASE 4: DSA REGISTRATION & OPERATIONS ===\n');

  // Test 15: Register DSA
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      email: testUsers.dsa.email,
      password: testUsers.dsa.password,
      fullName: testUsers.dsa.fullName,
    });
    logTest('PHASE 4', '/auth/register (DSA)', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 4', '/auth/register (DSA)', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Verify DSA email
  try {
    await axios.post(`${BASE_URL}/otp/send`, {
      email: testUsers.dsa.email,
    });
    await axios.post(`${BASE_URL}/otp/verify`, {
      email: testUsers.dsa.email,
      otp: '123456',
    });
  } catch (error) {
    //console.log('DSA verification skipped');
  }

  // Login as DSA
  try {
    const start = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.dsa.email,
      password: testUsers.dsa.password,
    });
    dsaToken = res.headers['set-cookie']?.[0] || '';
    logTest('PHASE 4', '/auth/login (DSA)', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 4', '/auth/login (DSA)', 'POST', 'FAIL', err.response?.status, err.message);
  }

  // Test 16: DSA Registration (convert user to DSA)
  try {
    const start = Date.now();
    const res = await axios.post(
      `${BASE_URL}/dsa/register`,
      {
        phone: '9876543211',
        address: '456 DSA Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      { headers: { Cookie: dsaToken } }
    );
    dsaId = res.data.data.profile.userId;
    logTest('PHASE 4', '/dsa/register', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 4', '/dsa/register', 'POST', 'FAIL', err.response?.status, err.response?.data as string);
  }

  // Test 17: Get DSA requests
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/dsa/requests`, {
      headers: { Cookie: dsaToken },
    });
    logTest('PHASE 4', '/dsa/requests', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 4', '/dsa/requests', 'GET', 'FAIL', err.response?.status, err.message);
  }

  // Test 18: Update DSA request status
  if (requestId) {
    try {
      const start = Date.now();
      const res = await axios.patch(
        `${BASE_URL}/dsa/requests/${requestId}`,
        { status: 'in_progress' },
        { headers: { Cookie: dsaToken } }
      );
      logTest('PHASE 4', '/dsa/requests/:id', 'PATCH', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 4', '/dsa/requests/:id', 'PATCH', 'FAIL', err.response?.status, err.response?.data as string);
    }
  }

  // Test 19: Export DSA requests
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/dsa/export`, {
      headers: { Cookie: dsaToken },
    });
    logTest('PHASE 4', '/dsa/export', 'GET', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 4', '/dsa/export', 'GET', 'FAIL', err.response?.status, err.message);
  }
}

// Test Phase 5: Employee Operations (requires employee account)
async function phase5_Employee() {
  //console.log('\n=== PHASE 5: EMPLOYEE OPERATIONS ===\n');

  //console.log('⚠️  Employee tests require manual database role update');
  //console.log('⚠️  Update a user role to EMPLOYEE in database to test these endpoints\n');

  // Test 20: Get all requests (Employee)
  try {
    const start = Date.now();
    const res = await axios.get(`${BASE_URL}/employee/requests`, {
      headers: { Cookie: employeeToken || user1Token },
    });
    logTest('PHASE 5', '/employee/requests', 'GET', res.status >= 200 && res.status < 300 ? 'PASS' : 'FAIL', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 5', '/employee/requests', 'GET', 'FAIL', err.response?.status, 'Expected - Employee role required');
  }

  // Test 21: Assign DSA
  if (requestId && dsaId) {
    try {
      const start = Date.now();
      const res = await axios.post(
        `${BASE_URL}/employee/assign-dsa`,
        { requestId, dsaId },
        { headers: { Cookie: employeeToken || user1Token } }
      );
      logTest('PHASE 5', '/employee/assign-dsa', 'POST', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 5', '/employee/assign-dsa', 'POST', 'FAIL', err.response?.status, 'Expected - Employee role required');
    }
  }

  // Test 22: Invite DSA
  try {
    const start = Date.now();
    const res = await axios.post(
      `${BASE_URL}/employee/invite-dsa`,
      {
        email: 'newdsa@example.com',
        fullName: 'New DSA Agent',
      },
      { headers: { Cookie: employeeToken || user1Token } }
    );
    logTest('PHASE 5', '/employee/invite-dsa', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 5', '/employee/invite-dsa', 'POST', 'FAIL', err.response?.status, 'Expected - Employee role required');
  }

  // Test 23: Update request status (Employee)
  if (requestId) {
    try {
      const start = Date.now();
      const res = await axios.patch(
        `${BASE_URL}/employee/requests/${requestId}`,
        { status: 'completed' },
        { headers: { Cookie: employeeToken || user1Token } }
      );
      logTest('PHASE 5', '/employee/requests/:id', 'PATCH', 'PASS', res.status, undefined, Date.now() - start);
    } catch (error: any) {
      const err = error as AxiosError;
      logTest('PHASE 5', '/employee/requests/:id', 'PATCH', 'FAIL', err.response?.status, 'Expected - Employee role required');
    }
  }

  // Test 24: Logout
  try {
    const start = Date.now();
    const res = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      { headers: { Cookie: user1Token } }
    );
    logTest('PHASE 5', '/auth/logout', 'POST', 'PASS', res.status, undefined, Date.now() - start);
  } catch (error: any) {
    const err = error as AxiosError;
    logTest('PHASE 5', '/auth/logout', 'POST', 'FAIL', err.response?.status, err.message);
  }
}

// Generate Markdown Report
function generateReport() {
  const timestamp = new Date().toISOString();
  let markdown = `# API Test Results\n\n`;
  markdown += `**Generated:** ${timestamp}\n\n`;
  markdown += `**Base URL:** ${BASE_URL}\n\n`;

  const passCount = testResults.filter((r) => r.status === 'PASS').length;
  const failCount = testResults.filter((r) => r.status === 'FAIL').length;
  const totalTests = testResults.length;

  markdown += `## Summary\n\n`;
  markdown += `- **Total Tests:** ${totalTests}\n`;
  markdown += `- **Passed:** ✅ ${passCount} (${((passCount / totalTests) * 100).toFixed(1)}%)\n`;
  markdown += `- **Failed:** ❌ ${failCount} (${((failCount / totalTests) * 100).toFixed(1)}%)\n\n`;

  // Group by phase
  const phases = ['PHASE 1', 'PHASE 2', 'PHASE 3', 'PHASE 4', 'PHASE 5'];
  phases.forEach((phase) => {
    const phaseTests = testResults.filter((r) => r.phase === phase);
    if (phaseTests.length === 0) return;

    markdown += `## ${phase}\n\n`;
    markdown += `| Endpoint | Method | Status | Code | Response Time | Error |\n`;
    markdown += `|----------|--------|--------|------|---------------|-------|\n`;

    phaseTests.forEach((test) => {
      const statusEmoji = test.status === 'PASS' ? '✅' : '❌';
      markdown += `| ${test.endpoint} | ${test.method} | ${statusEmoji} ${test.status} | ${test.statusCode || 'N/A'} | ${test.responseTime ? test.responseTime + 'ms' : 'N/A'} | ${test.errorMessage || '-'} |\n`;
    });

    markdown += `\n`;
  });

  // Failed tests details
  const failedTests = testResults.filter((r) => r.status === 'FAIL');
  if (failedTests.length > 0) {
    markdown += `## Failed Tests Details\n\n`;
    failedTests.forEach((test, index) => {
      markdown += `### ${index + 1}. ${test.method} ${test.endpoint}\n\n`;
      markdown += `- **Phase:** ${test.phase}\n`;
      markdown += `- **Status Code:** ${test.statusCode || 'N/A'}\n`;
      markdown += `- **Error Message:** ${test.errorMessage || 'Unknown error'}\n\n`;
      markdown += `**Recommended Fix:**\n`;
      markdown += `- Check endpoint implementation\n`;
      markdown += `- Verify request payload and authentication\n`;
      markdown += `- Review server logs for detailed error\n\n`;
    });
  }

  // Write report
  const reportPath = path.join(__dirname, 'TEST_RESULTS.md');
  fs.writeFileSync(reportPath, markdown);
  //console.log(`\n📄 Report generated: ${reportPath}`);
}

// Main execution
async function runAllTests() {
  //console.log('🚀 Starting comprehensive API tests...\n');
  //console.log('Using test accounts:');
  //console.log(`  - User 1: ${testUsers.user1.email}`);
  //console.log(`  - User 2: ${testUsers.user2.email}`);
  //console.log(`  - DSA: ${testUsers.dsa.email}`);
  //console.log('');

  try {
    await phase1_UserAuth();
    await phase2_ServicesAndRequests();
    await phase3_Payments();
    await phase4_DSA();
    await phase5_Employee();
  } catch (error) {
    //console.error('Test execution error:', error);
  } finally {
    generateReport();
    //console.log('\n✅ All tests completed!');
  }
}

runAllTests();
